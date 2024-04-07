import React from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Text,
  VStack,
  Image,
  Link,
} from '@chakra-ui/react';

const Contact = () => {


  return (
    <Box p={8}>
      <Box textAlign="center" mb={5}>
        <Link href="/">
          <Button colorScheme="cyan" mb={4}>Home</Button>
        </Link>
      </Box>
      <VStack spacing={8} align="stretch">
        <Box textAlign="center">
        <Text fontSize="3xl" fontWeight="bold">Contactez-nous</Text>
          <Image src="logo.png" alt="Sinichain Logo" mx="auto" /> {/* Remplacez `path_to_your_logo.png` par le chemin réel du logo */}
          <Text fontSize="lg">Numéro : 01 23 45 67 89</Text> {/* Faux numéro */}
        </Box>
        <form>
          <VStack spacing={5}>
            <FormControl id="email" isRequired>
              <FormLabel>Email</FormLabel>
              <Input type="email" size="lg" />
            </FormControl>
            <FormControl id="message" isRequired>
              <FormLabel>Message</FormLabel>
              <Textarea size="lg" />
            </FormControl>
            <Button type="submit" colorScheme="cyan" size="lg" width="full">Envoyer</Button>
          </VStack>
        </form>
      </VStack>
    </Box>
  );
};

export default Contact;
