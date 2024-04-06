'use client'

import { Flex, Text, Image, Box } from "@chakra-ui/react";
import Link from "next/link";
import styles from "../app/page.module.css";
import '../app/globals.css';

const Footer = () => {
  return (
    <Flex
      direction={{ base: "column", md: "row" }}
      justify="space-around" // Répartit l'espace uniformément autour des éléments
      align="stretch" // Étire les éléments pour qu'ils aient la même hauteur
      wrap="wrap"
      w="full"
      gap={6} // Ajustez selon l'espacement désiré entre les éléments
      p={5}
    >
      <Box className={styles.card} rel="noopener noreferrer" flex="1" minWidth="250px" minHeight="100px">
        <Link href="/Contact">
            <Text fontSize="xl" fontWeight="bold">Contact</Text>
            <Text>Tél ou mail.</Text>
        </Link>
      </Box>

      <Box className={styles.card} rel="noopener noreferrer" flex="1" minWidth="250px" minHeight="100px">
        <Link href="/Documentation">
            <Text fontSize="xl" fontWeight="bold">Documentation</Text>
            <Text>Smart contract, Litepaper, roadmap, etc..</Text>
        </Link>
      </Box>

      <Box className={styles.card} rel="noopener noreferrer" flex="1" minWidth="250px" minHeight="100px">
        <Link href="/Communaute">
            <Text fontSize="xl" fontWeight="bold">Rejoins la communauté</Text>
            <Box display="flex" alignItems="center">
              <Image src="/discord.png" alt="discord.js Logo" boxSize="30px"/>
              <Image src="/x.png" alt="x.js Logo" boxSize="30px" ml={5}/>
            </Box>
        </Link>
      </Box>

      <Box className={styles.card} rel="noopener noreferrer" flex="1" minWidth="250px" minHeight="100px">
        <Link href="/Equipe">
            <Text fontSize="xl" fontWeight="bold">Equipe</Text>
            <Text>Découvrez l'équipe derrière SiniChain!</Text>
        </Link>
      </Box>
    </Flex>
  )
}

export default Footer;
