'use client'

// Importation des composants Header et Footer pour les utiliser dans le layout.
import Header from "./Header"
import Footer from "./Footer"
// Importation des styles globaux.
import '../app/globals.css';
// Importation de Flex depuis Chakra UI pour créer un layout flexible.
import { Flex } from "@chakra-ui/react";
// Importation des styles CSS spécifiques à la page.
import styles from "../app/page.module.css";

// Déclaration du composant fonctionnel Layout.
// Ce composant prend un seul prop, `children`, qui représente le contenu enfant
// que le composant Layout va englober.
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
      <Flex mt={{ base: 50, md: 500 }} className={styles.grid} />
      <Footer />
    </Flex>
  )
}

export default Layout