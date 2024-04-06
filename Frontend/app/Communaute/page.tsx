import React from 'react';
import { Box, Button, Image, Link, VStack, Text } from '@chakra-ui/react';

const Communaute = () => {
  return (
    <Box p={5}>
      <VStack spacing={4} align="center">
        <Link href="/">
          <Button colorScheme="red">Home</Button>
        </Link>
        <Text fontSize="2xl" fontWeight="bold">Communauté SiniChain</Text>
        <Image src="/logo.png" alt="Logo Sinichain" /> {/* Assurez-vous que le chemin d'accès au logo est correct */}
        
        <Link href="/discord.png" isExternal>
          <Button leftIcon={<Image src="/discord.png" boxSize="24px" />} colorScheme="purple">
            Rejoindre Discord
          </Button>
        </Link>
        <Link href="/x.png" isExternal>
          <Button leftIcon={<Image src="/x.png" boxSize="24px" />} colorScheme="gray">
            Rejoindre X
          </Button>
        </Link>
      </VStack>
    </Box>
  );
}

export default Communaute;
