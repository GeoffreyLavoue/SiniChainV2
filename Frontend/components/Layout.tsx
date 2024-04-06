'use client'

import Header from "./Header"
import Footer from "./Footer"
import '../app/globals.css';
import { Flex } from "@chakra-ui/react";
import styles from "../app/page.module.css";



const Layout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <Flex direction="column" minHeight="100vh" width="100vw" justifyContent="center">
      <Header />
      <Flex grow="1" p="2rem" justifyContent="center" alignItems="center" width="100%" height="100%" mt={{ base: 50, md: 50 }}>
        {children}
      </Flex>
      <Flex mt={{ base: 50, md: 500 }} className={styles.grid}/>
      <Footer />
    </Flex>
  )
}

export default Layout