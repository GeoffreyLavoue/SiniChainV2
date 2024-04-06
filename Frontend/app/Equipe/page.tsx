import { Box, Image, Heading, Text, VStack, HStack, Link, Button } from '@chakra-ui/react';
import Head from 'next/head';

export default function Equipe() {
  return (
    <>
      <Head>
        <title>Equipe - Sinichain</title>
      </Head>
      <Box p={5}>
      <Link href="/">
          <Button colorScheme="red">Home</Button>
        </Link>
        <VStack spacing={4} align="center">
          <Heading as="h1">L'équipe</Heading>
          <Image src="/titre.png" alt="Titre" boxSize="180px" objectFit="cover" />
        </VStack>

        <HStack spacing={8} justify="center" wrap="wrap" pt={5}>
          {/* Membre 1 */}
          <VStack>
            <Image src="/men.png" alt="Romain" boxSize="200px" borderRadius="full" objectFit="cover" />
            <Heading as="h2" size="md">Romain</Heading>
            <Text>Scrum Master</Text>
          </VStack>

          {/* Membre 2 */}
          <VStack>
            <Image src="/men.png" alt="Brice" boxSize="200px" borderRadius="full" objectFit="cover" />
            <Heading as="h2" size="md">Brice</Heading>
            <Text>Scrum Master</Text>
          </VStack>

          {/* Membre 3 */}
          <VStack>
            <Image src="/men.png" alt="Stephane" boxSize="200px" borderRadius="full" objectFit="cover" />
            <Heading as="h2" size="md">Stephane</Heading>
            <Text>Scrum Master</Text>
          </VStack>

          {/* Membre 4 */}
          <VStack>
            <Image src="/men.png" alt="Geoffrey" boxSize="200px" borderRadius="full" objectFit="cover" />
            <Heading as="h2" size="md">Geoffrey</Heading>
            <Text>Développeur</Text>
          </VStack>
        </HStack>
      </Box>
    </>
  );
}
