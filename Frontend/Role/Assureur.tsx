'use client'

// Importe les hooks et composants nécessaires de React et Chakra UI pour l'UI,
// ainsi que les hooks de wagmi pour l'interaction avec les contrats Ethereum.
import { useState, useEffect } from "react"
import { Text, Button, Box, Input, Table, Thead, Tbody, Tr, Th, Td, TableContainer, Heading } from "@chakra-ui/react"
import { useAccount, useReadContract, useWriteContract } from "wagmi"
import { clientManagementABI, clientManagementAddress, sinisterManagementABI, sinisterManagementAddress } from "@/constant"
import '../app/globals.css'

// Définit le composant fonctionnel Assureur.
const Assureur = () => {

  // Définit une interface pour structurer les données d'un sinistre.
  interface Sinister {
    sinisterId: number;
    driverName: string;
    driverLocation: string;
    driverLicenseNumber: string;
    driverPhoneNumber: string;
    date: string;
    vehicleMake: string;
    vehicleModel: string;
    vehicleColor: string;
    vehicleYear: number;
    description: string;
    status: number;
  }

  // Utilise useAccount pour récupérer l'adresse du compte connecté.
  const { address } = useAccount();

  // Déclare les états pour stocker les informations des clients et des sinistres.
  const [allClients, setGetAllClients] = useState<string[]>([]);
  const [clientAddress, setClientAddressToRegister] = useState('');
  const { writeContract } = useWriteContract();
  const [sinisters, setSinisters] = useState<Sinister[]>([]);

  // Fonction pour enregistrer un nouveau client via le contrat intelligent.
  const registerClients = async () => {
    writeContract({
      address: clientManagementAddress,
      abi: clientManagementABI,
      functionName: 'registerClient',
      account: address,
      args: [clientAddress],
    });
  }

  // Fonction pour mettre à jour le statut d'un sinistre.
  const updateSinisterStatus = async (sinisterId: number, newStatus: number) => {
    writeContract({
      address: sinisterManagementAddress,
      abi: sinisterManagementABI,
      functionName: 'updateSinisterStatus',
      args: [sinisterId, newStatus],
    });
  }

  // Récupère la liste des clients à partir des contrats intelligents.
  const { data: clientsFromContract, error } = useReadContract({
    address: clientManagementAddress,
    abi: clientManagementABI,
    functionName: 'getAllClients',
    account: address
  })

  // Récupère la liste des sinistres à partir des contrats intelligents.
  const { data: sinistersData, isError } = useReadContract({
    address: sinisterManagementAddress,
    abi: sinisterManagementABI,
    functionName: 'viewAllSinisters',
    account: address
  });

  // Mise à jour des états à partir des données récupérées.
  useEffect(() => {
    if (Array.isArray(clientsFromContract) && clientsFromContract.length > 0) {
      setGetAllClients(clientsFromContract);
    } else {
      console.error("Erreur :", error);
    }
  }, [clientsFromContract]);

  useEffect(() => {
    console.log("Sinisters data:", sinistersData);
    if (sinistersData && Array.isArray(sinistersData) && !isError) {
      const formattedSinisters = sinistersData.map(sinister => ({
        ...sinister,
        vehicleId: typeof sinister.vehicleId === 'bigint' ? sinister.vehicleId.toString() : sinister.vehicleId,
        vehicleYear: sinister.vehicleYear.toString(),
      }));
      setSinisters(formattedSinisters as Sinister[]);
    }
  }, [sinistersData, isError]);

  // Rendu du composant, incluant un formulaire d'enregistrement des clients et la liste des sinistres.
  return (
    <Box p={5}>
      <Heading as="h2" size="lg" mb={5}>
        Gestion des Clients et Sinistres
      </Heading>
      <Box mb={5}>
        <Input
          placeholder="Adresse du client à enregistrer"
          value={clientAddress}
          onChange={(e) => setClientAddressToRegister(e.target.value)}
          mr={2}
        />
        <Button colorScheme="blue" onClick={registerClients}>
          Enregistrer Client
        </Button>
      </Box>
      <TableContainer>
        <Heading as="h3" size="md" mb={2}>
          Clients Enregistrés
        </Heading>
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th color="white">Client Address</Th>
            </Tr>
          </Thead>
          <Tbody>
            {allClients.map((client, index) => (
              <Tr key={index}>
                <Td>{client}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
      <TableContainer mt={5}>
        <Heading as="h3" size="md" mb={2}>
          Sinistres Reçus
        </Heading>
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th color="white">ID</Th>
              <Th color="white">Conducteur</Th>
              <Th color="white">Date</Th>
              <Th color="white">ID du Véhicule</Th>
              <Th color="white">Description</Th>
              <Th color="white">Status</Th>
              <Th color="white">Bouton Status</Th>
            </Tr>
          </Thead>
          <Tbody>
            {sinisters.map((sinister, index) => (
              <Tr key={index}>
                <Td>{index + 1}</Td>
                <Td>
                  <div>{sinister.driverName}</div>
                  <div>{sinister.driverLocation}</div>
                  <div>{sinister.driverLicenseNumber}</div>
                  <div>{sinister.driverPhoneNumber}</div>
                </Td>
                <Td>{sinister.date}</Td>
                <Td>
                  <div>{sinister.vehicleMake}</div>
                  <div>{sinister.vehicleModel}</div>
                  <div>{sinister.vehicleColor}</div>
                  <div>{sinister.vehicleYear}</div>
                </Td>
                <Td>{sinister.description}</Td>
                <Td>{sinister.status}</Td>
                <Td>
                  {sinister.status === 0 && (
                    <Button colorScheme="blue" onClick={() => updateSinisterStatus(sinister.sinisterId, 1)}>
                      Prise en charge
                    </Button>
                  )}
                  {sinister.status === 1 && (
                    <>
                      <Button colorScheme="green" onClick={() => updateSinisterStatus(sinister.sinisterId, 2)}>
                        Approuver
                      </Button>
                      <Button ml={2} colorScheme="red" onClick={() => updateSinisterStatus(sinister.sinisterId, 3)}>
                        Refuser
                      </Button>
                    </>
                  )}
                  {sinister.status === 2 && (
                    <>
                      <Text>Accepté</Text>
                    </>
                  )}
                  {sinister.status === 3 && (
                    <>
                      <Text>Refusé</Text>
                    </>
                  )}
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </Box>
  );
};


export default Assureur;