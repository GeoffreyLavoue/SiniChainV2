'use client'

// Importation des hooks et composants React et Chakra UI nécessaires.
import { useState, useEffect } from "react";
import {
  Box, Button, FormControl, FormLabel, Input, VStack, Textarea,
  Heading, Container, SimpleGrid, Flex, List, ListItem, Spinner,
  Text, useToast
} from "@chakra-ui/react";
// Importation des hooks wagmi pour l'interaction avec les contrats Ethereum.
import { useAccount, useReadContract, useWriteContract } from "wagmi";
// Importation des adresses et ABIs des contrats intelligents depuis un module constant.
import { driverManagementABI, driverManagementAddress, vehicleManagementABI,
  vehicleManagementAddress, sinisterManagementABI, sinisterManagementAddress } from '@/constant';
// Importation des styles globaux.
import '../app/globals.css';

const Client = () => {

   // Définition des interfaces pour structurer les données des profils conducteur.
  interface DriverProfile {
    name: string;
    location: string;
    licenseNumber: string;
    phoneNumber: string;
    birthday: string;
  }

  // Définition des interfaces pour structurer les données des sinistres.
  interface Sinistre {
    id: string;
    date: string;
    vehicleId: number;
    description: string;
    status: number;
  }

  // Utilisation des hooks pour gérer l'état local et interagir avec les contrats intelligents.
  const { address } = useAccount();
  const toast = useToast();
  const { writeContract, error: writeError, isPending: isWriteLoading } = useWriteContract();
  const [driverProfile, setDriverProfile] = useState<DriverProfile | null>(null);
  const [vehiclesList, setVehiclesList] = useState<string[]>([]);
  const [sinistreList, setSinistreList] = useState<Sinistre[]>([]);
  //Conducteur
  const [name, setName] = useState('');
  const [birthday, setBirthday] = useState('');
  const [location, setLocation] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  //Voiture
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [color, setColor] = useState('');
  const [year, setYear] = useState('');
  //Sinistre
  const [date, setDate] = useState('');
  const [vehicleId, setVehiculeId] = useState('');
  const [description, setDescription] = useState('');

  // Définition de la fonction pour enregistrer un conducteur.
  const registerDriver = async () => {
    writeContract({
      address: driverManagementAddress,
      abi: driverManagementABI,
      functionName: 'createDriverProfile',
      args: [name, birthday, location, licenseNumber, phoneNumber],
    });
  }

  // Définition de la fonction pour enregistrer des véhicules.
  const registerVehicle = async () => {
    writeContract({
      address: vehicleManagementAddress,
      abi: vehicleManagementABI,
      functionName: 'registerVehicle',
      args: [make, model, color, year],
    });
  }

  // Définition de la fonction pour enregistrer des sinistres.
  const registerSinistre = async () => {
    writeContract({
      address: sinisterManagementAddress,
      abi: sinisterManagementABI,
      functionName: 'declareSinister',
      args: [date, vehicleId, description],
    });
  }

  // Utilise le hook useReadContract de wagmi pour récupérer le profil du conducteur depuis la blockchain.
  const { data, isError, isLoading } = useReadContract({
    address: driverManagementAddress,
    abi: driverManagementABI,
    functionName: 'getDriverProfil',
    args: [address],
  });

  // Utilise useReadContract pour récupérer tous les véhicules associés à un conducteur.
  const { data: vehiclesData, isError: isVehiclesError, isLoading: isVehiclesLoading } = useReadContract({
    address: vehicleManagementAddress, 
    abi: vehicleManagementABI, 
    functionName: 'getAllVehicles',
    args: [address], 
  });

  // Utilise useReadContract pour récupérer tous les sinistres déclarés par le conducteur.
  const { data: sinistresData, isError: isSinistresError, isLoading: isSinistresLoading } = useReadContract({
    address: sinisterManagementAddress,
    abi: sinisterManagementABI,
    functionName: 'getMyAllSinisters',
    args: [address],
  });

  // Un hook useEffect pour afficher un toast en cas d'erreur lors de l'écriture sur un contrat.
  useEffect(() => {
    if (writeError) {
      toast({
        title: "Erreur lors de l'enregistrement du profil",
        description: writeError.message,
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    }
  }, [writeError, toast]);

  // useEffect pour traiter les données du profil du conducteur une fois récupérées.
  useEffect(() => {
    console.log(data); 
    if (data) {
      const profile = {
        name: '',
        location: '',
        licenseNumber: '',
        phoneNumber: '',
        birthday: '',
        ...data, 
      };

      setDriverProfile(profile);
    }
  }, [data]);

  // useEffect pour traiter les données des véhicules une fois récupérées.
  useEffect(() => {
    if (Array.isArray(vehiclesData)) {
      setVehiclesList(vehiclesData.map(vehicle => typeof vehicle === 'string' ? vehicle : JSON.stringify(vehicle)));
    }
  }, [vehiclesData]);

  // useEffect pour traiter les données des sinistres une fois récupérées.
  useEffect(() => {
    if (Array.isArray(sinistresData)) {
      const formattedSinistres: Sinistre[] = sinistresData.map(sinistreRaw => {
        const { id, date, vehicleId, description, status } = sinistreRaw;
        const sinistreFormatted: Sinistre = {
          id, 
          date,
          vehicleId: Number(vehicleId),
          description,
          status: Number(status)
        };
        return sinistreFormatted;
      });
      setSinistreList(formattedSinistres);
    }
  }, [sinistresData]);
  
  // Fonction pour convertir un statut numérique de sinistre en texte explicatif.
  const getStatusText = (status: number): string => {
    switch(status) {
      case 0:
        return 'Envoyé';
      case 1:
        return 'Pris en charge';
      case 2:
        return 'Accepté';
      case 3:
        return 'Refusé';
      default:
        return 'Inconnu'; 
    }
  };

  // Gère la soumission du formulaire pour l'enregistrement d'un conducteur.
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Empêcher le rechargement de la page
    registerDriver();
  };

  // Gère la soumission du formulaire pour l'enregistrement d'un véhicule.
  const handleSubmitVehicle = async (f: React.FormEvent<HTMLFormElement>) => {
    f.preventDefault(); // Empêcher le rechargement de la page
    registerVehicle();
  };

  // Gère la soumission du formulaire pour la déclaration d'un sinistre.
  const handleSubmitSinister = async (g: React.FormEvent<HTMLFormElement>) => {
    g.preventDefault(); // Empêcher le rechargement de la page
    registerSinistre();
  };

   // Rendu du composant
  return (

    <Container maxW="container.xl" py={5}>
      <Heading as="h1" mb={5}>Gestion Client</Heading>
      <SimpleGrid columns={3} spacing={10}>
        <VStack spacing={10}>
          <Box borderWidth="1px" borderRadius="lg" overflow="hidden" p={4}>
            <Heading as="h2" size="md" mb={4}>Profil Conducteur</Heading>
            {!driverProfile && (
              <form onSubmit={handleSubmit}>
                <VStack spacing={4} align="stretch">
                  <FormControl isRequired>
                    <FormLabel>Nom</FormLabel>
                    <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Nom" />
                  </FormControl>
                  <FormControl isRequired>
                    <FormLabel>Date de naissance</FormLabel>
                    <Input type="date" value={birthday} onChange={(e) => setBirthday(e.target.value)} />
                  </FormControl>
                  <FormControl isRequired>
                    <FormLabel>Localisation</FormLabel>
                    <Input value={location} onChange={(e) => setLocation(e.target.value)} />
                  </FormControl>
                  <FormControl isRequired>
                    <FormLabel>Numéro de licence</FormLabel>
                    <Input value={licenseNumber} onChange={(e) => setLicenseNumber(e.target.value)} />
                  </FormControl>
                  <FormControl isRequired>
                    <FormLabel>Numéro de téléphone</FormLabel>
                    <Input value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
                  </FormControl>
                  <Button colorScheme="blue" type="submit">Enregistrer le Profil</Button>
                </VStack>
              </form>
            )}
          </Box>
          {driverProfile && (
            <Box borderWidth="1px" borderRadius="lg" overflow="hidden" p={4} w="100%">
              <Heading as="h3" size="md" mb={4}>Informations du Conducteur</Heading>
              <Text>
                <div>Nom: {driverProfile.name}</div>
                <div>Date de naissance: {driverProfile.birthday}</div>
                <div>Localisation: {driverProfile.location}</div>
                <div>Numéro de licence: {driverProfile.licenseNumber}</div>
                <div>Numéro de téléphone: {driverProfile.phoneNumber}</div>
              </Text>
            </Box>
          )}
        </VStack>
        <VStack spacing={10}>
          <Box borderWidth="1px" borderRadius="lg" overflow="hidden" p={4}>
            <Heading as="h2" size="md" mb={4}>Enregistrement des Véhicules</Heading>
            <form onSubmit={handleSubmitVehicle}>
              <VStack spacing={4} align="stretch">
                <FormControl isRequired>
                  <FormLabel>Marque</FormLabel>
                  <Input value={make} onChange={(f) => setMake(f.target.value)} placeholder="Marque" />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>Modèle</FormLabel>
                  <Input value={model} onChange={(f) => setModel(f.target.value)} placeholder="Modèle" />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>Couleur</FormLabel>
                  <Input value={color} onChange={(f) => setColor(f.target.value)} placeholder="Couleur" />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>Année</FormLabel>
                  <Input value={year} onChange={(f) => setYear(f.target.value)} placeholder="Année" />
                </FormControl>
                <Button colorScheme="blue" type="submit">Enregistrer Véhicule</Button>
              </VStack>
            </form>
          </Box>
          <Box borderWidth="1px" borderRadius="lg" overflow="hidden" p={4}>
            <Heading as="h2" size="md" mb={4}>Liste des Véhicules</Heading>
            {isVehiclesLoading && <Spinner />}
            {isVehiclesError && <Text>Erreur lors du chargement des véhicules</Text>}
            {!isVehiclesLoading && vehiclesList.length > 0 && (
              <Flex wrap="wrap"> 
                {vehiclesList.map((vehicle, index) => (
                  <Box key={index} p={5} shadow="md" borderWidth="1px" m={2}> 
                    <Text>{vehicle}</Text>
                  </Box>
                ))}
              </Flex>
            )}
            {vehiclesList.length === 0 && !isVehiclesLoading && <Text>Aucun véhicule enregistré</Text>}
          </Box>
        </VStack>
        <VStack spacing={10}>
          <Box borderWidth="1px" borderRadius="lg" overflow="hidden" p={4}>
            <Heading as="h2" size="md" mb={4}>Déclaration de Sinistres</Heading>
            <form onSubmit={handleSubmitSinister}>
              <VStack spacing={4} align="stretch">
                <FormControl>
                  <FormLabel>Date du sinistre</FormLabel>
                  <Input value={date} onChange={(g) => setDate(g.target.value)} placeholder="Date" />
                </FormControl>
                <FormControl>
                  <FormLabel>ID du Véhicule</FormLabel>
                  <Input value={vehicleId} onChange={(g) => setVehiculeId(g.target.value)} placeholder="Identifiant du véhicule" />
                </FormControl>
                <FormControl>
                  <FormLabel>Description</FormLabel>
                  <Textarea value={description} onChange={(g) => setDescription(g.target.value)} placeholder="Descritpion du sinistre" />
                </FormControl>
                <Button colorScheme="blue" type="submit">Déclarer Sinistre</Button>
              </VStack>
            </form>
          </Box>
          <Box borderWidth="1px" borderRadius="lg" overflow="hidden" p={4} w="100%">
            <Heading as="h3" size="md" mb={4}>Sinistres Déclarés</Heading>
            {isSinistresLoading && <Spinner />}
            {isSinistresError && <Text>Erreur lors du chargement des sinistres</Text>}
            {!isSinistresLoading && sinistreList.length > 0 && (
              <List spacing={3}>
                {sinistreList.map((sinistre, index) => (
                  <ListItem key={index}>
                    <Box p={5} shadow="md" borderWidth="1px">
                      <Text>Date: {sinistre.date}</Text>
                      <Text>Véhicule ID: {sinistre.vehicleId}</Text>
                      <Text>Description: {sinistre.description}</Text>
                      <Text>Status: {getStatusText(sinistre.status)}</Text>
                    </Box>
                  </ListItem>
                ))}
              </List>
            )}
            {sinistreList.length === 0 && !isSinistresLoading && <Text>Aucun sinistre enregistré</Text>}
          </Box>

        </VStack>
      </SimpleGrid>
    </Container>
  );
};
export default Client;
