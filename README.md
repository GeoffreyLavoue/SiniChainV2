# SINICHAIN

## Lien de la démo : 

## Concept Général

SiniCHAIN est un outil de suivi de sinistre automobile à l'aide de la blockchain. Le principe est de supprimer le papier et le processus très long que peut-être la déclaration de sinistre. Même si les e-Constats existent, il n'y a pas vraiment de suivi efficace. C'est pour ça que SiniCHAIN va répondre à ce besoin.

## Contrat Intelligent

- **Plateforme:** Ethereum.
- **Fonctionnalités Clés:**
  - Enregistrement des clients par l'assureur.
  - Création d'un profil conducteur, de voitures et de sinistres.
  - Gestion des états des sinistres (envoi, traitement, validation/refus).

## Front-End

- **Framework:** React.
- **Fonctionnalités:**
  - Pages distinctes pour les rôles d'assureur et de client.
  - Interactions avec le contrat intelligent (ajout de clients, création de conducteurs/voitures/sinistres).
  - Affichage des informations récupérées du contrat intelligent.

## Interaction avec le Contrat

- **Utilisation de wagmi** pour interagir avec le contrat intelligent depuis le front.
- **Fonctionnalités** telles que l'ajout de clients uniquement si l'adresse qui le fait est celle qui a déployé le smart contract.

## Sécurité et Gestion

- **Utilisation des modificateurs de Solidity** pour gérer l'accès aux fonctions par les clients (onlyClient) qui sont les clients uniquement enregistrés par l'assureur mais également onlyVehicled pour les conducteurs ayant un véhicule.
- **Utilisation de Ownable** pour utiliser l'accès à l'owner uniquement sur certaines fonctions (onlyOwner).

## Failles de sécurité

### Reentrancy

**ClientManagement** :  Dans ce contrat, il n'y a pas de transfert d'Ether ou d'appels à des contrats externes non fiables qui pourraient permettre une telle réentrance. Donc, votre contrat n'est pas vulnérable aux attaques de reentrancy.



### DoS par erreur inattendue

**ClientManagement** : Ce contrat n'interagit pas avec des contrats externes de manière qui dépend de leur exécution réussie pour fonctionner. Ainsi, il n'est pas sujet aux attaques DoS par erreur inattendue.


### DoS par limite de Gaz

**ClientManagement** : La fonction getAllClients() pourrait théoriquement devenir vulnérable si la liste clients devenait extrêmement grande. Cela pourrait nécessiter une quantité de gaz supérieure à la limite de bloc pour exécuter la fonction, empêchant ainsi le propriétaire de récupérer la liste des clients. Cependant, dans ce projey, seul le Owner (Assureur) peut enregistrer des clients et appeler getAllClient(). Cela limite donc l'accès. Il n'y a donc pas de vulnérabilité potentielle à une attaque DoS par limite de gaz.


### Force Feeding

**ClientManagement** : Ce contrat ne gère pas l'Ether et ne modifie pas son comportement en fonction de son solde, donc il n'est pas vulnérable à une attaque de force feeding.


## Autres points de considération

- **Vérification d'adresse :** Il faut une vérification poussée de l'assureur pour ne laisser rentrer aucun contrat malveillant qui pourrait boucler sur l'ajout de sinistres.
- **Renforcement des autorisations des rôles :** À l'avenir, un contrôle renforcé notamment avec l'utilisation d'OpenZeppelin Access Control peut rajouter une sécurité supplémentaire.
- **Limite de performance et coût de gaz :** Tester la performance et surtout le coût en gaz si des boucles ou structures devaient s'ajouter.

## Déploiement et Tests

Le déploiement se fait sur Sépolia car nous avons trouvé pertinent l'utilisation de la blockchain Ethereum. Concernant les tests, j'ai testé tous les scénarios pertinents.

## Points Notables

- **Interaction entre le front-end et le contrat intelligent** pour une expérience utilisateur dynamique.
