'use client'

// Importation des composants nécessaires de Chakra UI pour la mise en page et l'affichage.
import { Flex, Image } from '@chakra-ui/react';
// Importation du composant ConnectButton de RainbowKit pour gérer la connexion au portefeuille.
import { ConnectButton } from '@rainbow-me/rainbowkit';
// Importation des styles globaux.
import '../app/globals.css';

// Définition du composant fonctionnel Header.
const Header = () => {
  // Rendu du composant
    return (
        <Flex
            justifyContent="space-between"
            alignItems="center"
            p="4rem"
        >
            <Image
                src="/titre.png"
                alt="Sinichain.js Logo"
                htmlWidth="250px"
                htmlHeight="250px"
                objectFit="cover"
                flexGrow={0}
                flexShrink={0}
            />

            <ConnectButton />
        </Flex>
    )
}

export default Header;