'use client'

// Importation des dépendances et composants nécessaires.
import { clientManagementABI, clientManagementAddress, ownerAddress } from "@/constant";
import { useAccount, useReadContract } from "wagmi";
import { useEffect, useState } from "react";
import { Box } from "@chakra-ui/react";
import Layout from "@/components/Layout";
import NotClient from "@/Role/NotClient";
import Assureur from "@/Role/Assureur";
import Client from "@/Role/Client";
import styles from './page.module.css';
import './globals.css'

// Définition du composant fonctionnel Home.
export default function Home() {

  // Utilisation du hook useAccount de wagmi pour obtenir l'adresse et l'état de connexion de l'utilisateur.
  const { address, isConnected } = useAccount();
  // État local pour stocker le rôle de l'utilisateur.
  const [userRole, setUserRole] = useState("NotClient"); 

  // Lecture des données du contrat clientManagement pour obtenir l'adresse du propriétaire.
  const ownerData = useReadContract({
    address: clientManagementAddress,
    abi: clientManagementABI,
    functionName: "owner",
  });

  // Lecture des données du contrat clientManagement pour obtenir la liste de tous les clients.
  const clientsData = useReadContract({
    address: clientManagementAddress,
    abi: clientManagementABI,
    functionName: "getAllClients",
    account: ownerAddress,
  });
  
  // Utilisation de useEffect pour réagir aux changements d'état, comme la connexion ou la déconnexion de l'utilisateur, 
  // et pour déterminer le rôle de l'utilisateur en fonction des données lues du contrat.
  useEffect(() => {
    if (!isConnected || !address) {
      setUserRole("NotClient");
      return;
    }

    const ownerAddress = ownerData.data;
    const clients = clientsData.data as string[]; // Assertion de type ici

    // Attribution du rôle en fonction de l'adresse de l'utilisateur et des données lues du contrat.
    if (ownerAddress === address) {
      setUserRole("Assureur");
    } else if (clients && clients.includes(address)) {
      setUserRole("Client");
    } else {
      setUserRole("NotClient");
    }
  }, [address, isConnected, ownerData.data, clientsData.data]);

  // Rendu conditionnel du composant en fonction du rôle de l'utilisateur.
  return (
    <Layout>
      <Box className={styles.center}>
        {userRole === "Assureur" ? (
          <Assureur />
        ) : userRole === "Client" ? (
          <Client />
        ) : (
          <NotClient />
        )}
      </Box>
    </Layout>
  );
}
