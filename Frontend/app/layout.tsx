'use client'

import { getDefaultConfig, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { VStack,Container } from '@chakra-ui/react';
import { ChakraProvider } from "@chakra-ui/react";
import { hardhat, sepolia } from 'wagmi/chains';
import '@rainbow-me/rainbowkit/styles.css';
import { walletConnect } from "@/constant";
import { Inter } from 'next/font/google';
import { WagmiProvider } from 'wagmi';
import './globals.css';



const config = getDefaultConfig({
  appName: 'My RainbowKit App',
  projectId: walletConnect,
  chains: [hardhat, sepolia],
  ssr: true, 
});

const queryClient = new QueryClient();

const inter = Inter({ subsets: ['latin'] })


export default function RootLayout({

  children,
}: Readonly<{
  children: React.ReactNode;
}>) {


  return (            
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
