'use client'

import { Flex, Text, Image } from '@chakra-ui/react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import '../app/globals.css'

const Header = () => {

    return (
        <Flex
            justifyContent="space-between"
            alignItems="center"
            p="4rem"
        >
            <Image
                src="/titre.png"
                alt="Sinichain.js Logo"
                htmlWidth="250px" // Utilisez htmlWidth et htmlHeight pour définir la taille de l'image
                htmlHeight="250px"
                objectFit="cover" // Assure que l'image couvre l'espace disponible sans être déformée
                flexGrow={0} // Empêche l'image de grandir mais permet de réduire
                flexShrink={0}
            />

            <ConnectButton />
        </Flex>
    )
}

export default Header;