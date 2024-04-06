'use client'

// ReactJS
import { useState, useEffect } from "react"

// ChakraUI
import {
  Text, Button, useToast,
  Box, Input, Table, Thead, Tbody, Tr, Th, Td, TableContainer, Heading
} from "@chakra-ui/react"

// Wagmi
import {
  useAccount,
  useReadContract,
  useWriteContract,
} from "wagmi"
// Contract Informations
import { clientManagementABI, clientManagementAddress, sinisterManagementABI, sinisterManagementAddress, vehicleManagementABI, vehicleManagementAddress } from "@/constant"
import '../app/globals.css'





const Assureur = () => {

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


  const { address } = useAccount();
  const toast = useToast();

  const [allClients, setGetAllClients] = useState<string[]>([]);
  const [clientAddress, setClientAddressToRegister] = useState('');
  const { writeContract } = useWriteContract();
  const [sinisters, setSinisters] = useState<Sinister[]>([]);


  const registerClients = async () => {
    writeContract({
      address: clientManagementAddress,
      abi: clientManagementABI,
      functionName: 'registerClient',
      account: address,
      args: [clientAddress],
    });
  }

  const updateSinisterStatus = async (sinisterId: number, newStatus: number) => {
    writeContract({
      address: sinisterManagementAddress,
      abi: sinisterManagementABI,
      functionName: 'updateSinisterStatus',
      args: [sinisterId, newStatus],
    });
  }

  // Get the total amount of the BBK tokens airdroppped
  const { data: clientsFromContract, error } = useReadContract({
    address: clientManagementAddress,
    abi: clientManagementABI,
    functionName: 'getAllClients',
    account: address
  })

  // Effectuer la mise à jour de l'état avec les données récupérées
  useEffect(() => {
    // Vérifie si clientsFromContract est un tableau et contient des éléments
    if (Array.isArray(clientsFromContract) && clientsFromContract.length > 0) {
      // Supposons que clientsFromContract est déjà un tableau de chaînes
      setGetAllClients(clientsFromContract);
    } else {
      console.error("Erreur :", error);
    }
  }, [clientsFromContract]);

  const { data: sinistersData, isError, isLoading } = useReadContract({
    address: sinisterManagementAddress,
    abi: sinisterManagementABI,
    functionName: 'viewAllSinisters',
    account: address
  });

  // Mise à jour de l'état avec les sinistres récupérés
  useEffect(() => {
    console.log("Sinisters data:", sinistersData);
    if (sinistersData && Array.isArray(sinistersData) && !isError) {
      const formattedSinisters = sinistersData.map(sinister => ({
        ...sinister,
        // Convertissez ici chaque propriété qui pourrait être un bigint ou nécessiter une transformation
        vehicleId: typeof sinister.vehicleId === 'bigint' ? sinister.vehicleId.toString() : sinister.vehicleId,
        vehicleYear: sinister.vehicleYear.toString(),
        // Appliquez la même logique de transformation à d'autres propriétés si nécessaire
      }));
      setSinisters(formattedSinisters as Sinister[]);
    }
  }, [sinistersData, isError]);


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