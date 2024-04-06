import { AlertIcon, Alert, Flex, Image, Box, Text, VStack, SimpleGrid } from "@chakra-ui/react"
import '../app/globals.css'

const NotClient = () => {
  return (
    <Flex
    justifyContent="center" // Centre horizontalement
      alignItems="center" // Centre verticalement
      h="100%" // Prend toute la hauteur disponible
      w="100%" // Prend toute la largeur disponibl
      >
      <SimpleGrid
      columns={{ base: 1, md: 3 }}
      alignItems="start"
      maxWidth="1400px" // Une maxWidth pour la grille
      margin="auto" // Centre la grille dans le Flex
      w="100%" // Assure que la grille prend la largeur maximale
      >
        {/* Premier texte à gauche */}
        <VStack align="start" justify="flex-start">
          <Text fontSize="2xl" fontWeight="bold" mb={3}>À propos du Projet</Text>
          <Text>
          Bienvenue dans l'ère de la gestion de sinistres réinventée. SiniChain est votre passerelle vers une expérience sans précédent dans le monde de l'assurance, exploitant la puissance et l'innovation du Web3. Conçue pour simplifier et sécuriser le processus de déclaration et de suivi des sinistres, notre plateforme décentralisée met en relation directe clients et assureurs, garantissant une transparence et une efficacité optimales.

          Avec SiniChain, dites adieu aux délais de traitement interminables et aux procédures compliquées. Les clients peuvent désormais déclarer leurs sinistres en quelques clics, tandis que les assureurs reçoivent les informations en temps réel, permettant une prise en charge immédiate. Plus qu'une simple plateforme, SiniChain révolutionne votre expérience post-sinistre, offrant suivi en direct et mises à jour instantanées pour une tranquillité d'esprit inégalée.
          </Text>
        </VStack>

        {/* Logo au centre, avec marge supérieure pour le descendre */}
        <Box mt={{ base: 50, md: 300 }} alignSelf="center">
          <Image
            src="/logo.png"
            alt="SinichainLogo.js Logo"
            boxSize="600px"
            objectFit="contain"
            m="auto" // Centre l'image dans sa cellule
          />
        </Box>

        {/* Deuxième texte à droite, aligné en bas pour les grands écrans */}
        <VStack align="start" justify="flex-end" height="full" mt={{ base: 50, md: 700 }} alignSelf="center">
          <Text fontSize="2xl" fontWeight="bold" mb={3}>Comment ça marche</Text>
          <Text>
          Imaginez un monde où déclarer un sinistre et en suivre le traitement se fait avec une simplicité et une rapidité jamais vues. C'est ce monde que SiniChain vous invite à découvrir. Notre Dapp utilise la technologie blockchain pour offrir une solution de gestion de sinistres à la fois sécurisée, transparente et incroyablement efficace.

          Pour le client: Fini le temps perdu à remplir des formulaires interminables et à attendre des jours pour obtenir une réponse. Avec SiniChain, déclarez votre sinistre en un instant et suivez en temps réel les étapes de sa prise en charge. Recevez des notifications instantanées à chaque progression de votre dossier, pour un suivi clair et sans stress.

          Pour l'assureur: Obtenez les déclarations de sinistre en direct via une interface intuitive, permettant une réaction rapide et une gestion efficace des cas. SiniChain vous offre une visibilité complète sur les sinistres déclarés, simplifiant vos opérations et améliorant la satisfaction de vos clients.

          Rejoignez-nous dans cette révolution du secteur de l'assurance. SiniChain n'est pas seulement une plateforme, c'est l'avenir de la gestion de sinistres, accessible dès aujourd'hui.
          </Text>
        </VStack>
      </SimpleGrid>
    </Flex>
  )
}

export default NotClient;
