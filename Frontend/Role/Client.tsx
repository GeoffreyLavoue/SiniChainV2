import React from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Textarea,
  Heading,
  Container,
  SimpleGrid,
  GridItem,
  Spinner,
  Td,
  Flex
} from '@chakra-ui/react';

import { useState } from 'react';
import { useToast, Toast, Text, Tbody } from '@chakra-ui/react';
import { useAccount } from 'wagmi';
import { useWriteContract } from 'wagmi';
import { driverManagementABI, driverManagementAddress, vehicleManagementABI, vehicleManagementAddress, sinisterManagementABI, sinisterManagementAddress } from '@/constant';
import { useReadContract } from 'wagmi';
import { useEffect } from 'react';
import '../app/globals.css'

const Client = () => {

  interface DriverProfile {
    name: string;
    location: string;
    licenseNumber: string;
    phoneNumber: string;
    birthday: string;
  }

  const { address } = useAccount();
  const toast = useToast();

  const [name, setName] = useState('');
  const [birthday, setBirthday] = useState('');
  const [location, setLocation] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [color, setColor] = useState('');
  const [year, setYear] = useState('');
  const [date, setDate] = useState('');
  const [vehicleId, setVehiculeId] = useState('');
  const [description, setDescription] = useState('');
  const [sinistres, setSinistres] = useState([]);
  const { writeContract, error: writeError, isPending: isWriteLoading } = useWriteContract();
  const [driverProfile, setDriverProfile] = useState<DriverProfile | null>(null);
  const [vehiclesList, setVehiclesList] = useState<string[]>([]);
  const [sinistreList, setSinistreList] = useState<string[]>([]);

  const registerDriver = async () => {
    writeContract({
      address: driverManagementAddress,
      abi: driverManagementABI,
      functionName: 'createDriverProfile',
      args: [name, birthday, location, licenseNumber, phoneNumber],
    });
  }
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

  const registerVehicle = async () => {
    writeContract({
      address: vehicleManagementAddress,
      abi: vehicleManagementABI,
      functionName: 'registerVehicle',
      args: [make, model, color, year],
    });
  }
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

  const registerSinistre = async () => {
    writeContract({
      address: sinisterManagementAddress,
      abi: sinisterManagementABI,
      functionName: 'declareSinister',
      args: [date, vehicleId, description],
    });
  }

  const { data, isError, isLoading } = useReadContract({
    address: driverManagementAddress,
    abi: driverManagementABI,
    functionName: 'getDriverProfil',
    args: [address],
  });

  useEffect(() => {
    console.log(data); // Pour voir la structure des données retournées
    if (data) {
      const profile = {
        name: '',
        location: '',
        licenseNumber: '',
        phoneNumber: '',
        birthday: '',
        ...data, // Fusion avec les valeurs par défaut pour garantir la structure
      };

      // Vous pouvez ici ajouter des vérifications supplémentaires pour chaque champ si nécessaire
      setDriverProfile(profile);
    }
  }, [data]);

  const { data: vehiclesData, isError: isVehiclesError, isLoading: isVehiclesLoading } = useReadContract({
    address: vehicleManagementAddress, // L'adresse de votre contrat de gestion des véhicules
    abi: vehicleManagementABI, // ABI de votre contrat de gestion des véhicules
    functionName: 'getAllVehicles',
    args: [address], // L'adresse du conducteur courant
  });

  useEffect(() => {
    if (Array.isArray(vehiclesData)) {
      setVehiclesList(vehiclesData.map(vehicle => typeof vehicle === 'string' ? vehicle : JSON.stringify(vehicle)));
    }
  }, [vehiclesData]);

  const { data: sinistresData, isError: isSinistresError, isLoading: isSinistresLoading } = useReadContract({
    address: sinisterManagementAddress,
    abi: sinisterManagementABI,
    functionName: 'getMyAllSinisters',
    args: [address],
  });

  useEffect(() => {
    if (Array.isArray(sinistresData)) {
      setSinistreList(sinistresData.map(sinistres => 
        typeof sinistres === 'string' ? sinistres : JSON.stringify(sinistres, (key, value) =>
          typeof value === 'bigint' ? value.toString() : value // convertit BigInt en String
        )
      ));
    }
  }, [sinistresData]);
  



  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Empêcher le rechargement de la page
    registerDriver();
  };

  const handleSubmitVehicle = async (f: React.FormEvent<HTMLFormElement>) => {
    f.preventDefault(); // Empêcher le rechargement de la page
    registerVehicle();
  };

  const handleSubmitSinister = async (g: React.FormEvent<HTMLFormElement>) => {
    g.preventDefault(); // Empêcher le rechargement de la page
    registerSinistre();
  };


  return (

    <Container maxW="container.xl" py={5}>
      <Heading as="h1" mb={5}>Gestion Client</Heading>

      <SimpleGrid columns={3} spacing={10}>
        {/* Colonne pour le profil du conducteur et sa liste */}
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

        {/* Colonne pour l'enregistrement des véhicules et leur liste */}
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
    <Flex wrap="wrap"> {/* Ajoutez wrap="wrap" pour permettre aux éléments de passer à la ligne si l'espace horizontal est insuffisant. */}
      {vehiclesList.map((vehicle, index) => (
        <Box key={index} p={5} shadow="md" borderWidth="1px" m={2}> {/* Ajoutez une marge autour de chaque Box pour de l'espace entre eux. */}
          <Text>{vehicle}</Text>
        </Box>
      ))}
    </Flex>
  )}
  {vehiclesList.length === 0 && !isVehiclesLoading && <Text>Aucun véhicule enregistré</Text>}
</Box>
        </VStack>

        {/* Colonne pour la déclaration de sinistres et leur liste */}
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
              <VStack>
                {sinistreList.map((sinistres, index) => (
                  <Box key={index} p={5} shadow="md" borderWidth="1px">
                    <Text>{sinistres}</Text>
                  </Box>
                ))}
              </VStack>
            )}
            {sinistreList.length === 0 && !isSinistresLoading && <Text>Aucun sinistre enregistré</Text>}
          </Box>
        </VStack>
      </SimpleGrid>
    </Container>
  );
};
export default Client;
