'use client'

// Importation des composants et hooks nécessaires depuis les bibliothèques utilisées.
import { getDefaultConfig, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { VStack, Container } from '@chakra-ui/react';
import { ChakraProvider } from "@chakra-ui/react";
import { hardhat, sepolia } from 'wagmi/chains';
import '@rainbow-me/rainbowkit/styles.css';
import { walletConnect } from "@/constant";
import { WagmiProvider } from 'wagmi';
import './globals.css';

// Importation de la police Inter depuis Google Fonts via Next.js.
import { Inter } from 'next/font/google';

// Configuration de RainbowKit pour l'authentification et la connexion au portefeuille.
const config = getDefaultConfig({
  appName: 'My RainbowKit App', // Nom de votre application.
  projectId: walletConnect, // L'ID de projet pour WalletConnect, généralement trouvé dans vos constantes.
  chains: [hardhat, sepolia], // Les chaînes sur lesquelles votre application est déployée ou testée.
  ssr: true, // Activation du rendu côté serveur.
});

// Instanciation d'un client pour React Query.
const queryClient = new QueryClient();

// Application de la police Inter à l'ensemble de l'application.
const inter = Inter({ subsets: ['latin'] });

// Définition du layout racine de votre application.
export default function RootLayout({

  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    // Utilisation de tags html et body dans un composant React n'est pas recommandée.
    <html lang="en">
      <body className={inter.className}> 
        <WagmiProvider config={config}> 
          <QueryClientProvider client={queryClient}> 
            <RainbowKitProvider> 
              <ChakraProvider> 
                <Container maxW="container.xl" py={8}> 
                  <VStack spacing={8}> 
                    {children} 
                  </VStack>
                </Container>
              </ChakraProvider>
            </RainbowKitProvider>
          </QueryClientProvider>
        </WagmiProvider>
      </body>
    </html>
  );
}
