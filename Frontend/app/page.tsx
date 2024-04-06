'use client'

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


export default function Home() {


  const { address, isConnected } = useAccount();
  const [userRole, setUserRole] = useState("NotClient"); 


  const ownerData = useReadContract({
    address: clientManagementAddress,
    abi: clientManagementABI,
    functionName: "owner",
  });

  const clientsData = useReadContract({
    address: clientManagementAddress,
    abi: clientManagementABI,
    functionName: "getAllClients",
    account: ownerAddress,
  });
  

  useEffect(() => {
    if (!isConnected || !address) {
      setUserRole("NotClient");
      return;
    }

    const ownerAddress = ownerData.data;
    const clients = clientsData.data as string[]; // Assertion de type ici

    if (ownerAddress === address) {
      setUserRole("Assureur");
    } else if (clients && clients.includes(address)) {
      setUserRole("Client");
    } else {
      setUserRole("NotClient");
    }
  }, [address, isConnected, ownerData.data, clientsData.data]);

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
