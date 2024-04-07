// Importation du module Hardhat Runtime Environment (HRE). 
// Cela fournit les fonctionnalités nécessaires pour interagir avec Ethereum, telles que les signataires et les contrats.
const hre = require("hardhat");

// Déclaration de la fonction principale asynchrone qui contiendra toute la logique de déploiement.
async function main() {
  // Obtention des signataires (comptes) disponibles à partir de Hardhat. 
  // Le premier compte dans la liste est généralement utilisé comme le compte de déploiement par défaut.
  const [deployer] = await hre.ethers.getSigners();

  // Affichage de l'adresse du compte de déploiement pour information.
  console.log("Deploying contracts with the account:", deployer.address);

  // Déploiement du contrat ClientManagement sans arguments de constructeur.
  const clientManagement = await hre.ethers.deployContract("ClientManagement");
  // Attente que le déploiement soit confirmé.
  await clientManagement.waitForDeployment();

  // Déploiement du contrat DriverManagement avec l'adresse de ClientManagement comme argument de constructeur.
  const driverManagement = await hre.ethers.deployContract("DriverManagement", [clientManagement.target]);
  // Attente que le déploiement soit confirmé.
  await driverManagement.waitForDeployment();

  // Déploiement du contrat VehicleManagement avec l'adresse de DriverManagement comme argument de constructeur.
  const vehicleManagement = await hre.ethers.deployContract("VehicleManagement", [driverManagement.target]);
  // Attente que le déploiement soit confirmé.
  await vehicleManagement.waitForDeployment();

  // Déploiement du contrat SinisterManagement avec les adresses de VehicleManagement et DriverManagement comme arguments de constructeur.
  const sinisterManagement = await hre.ethers.deployContract("SinisterManagement", [vehicleManagement.target, driverManagement.target]);
  // Attente que le déploiement soit confirmé.
  await sinisterManagement.waitForDeployment();

  // Affichage des adresses de déploiement de chaque contrat pour référence.
  console.log("ClientManagement deployed to:", clientManagement.target);
  console.log("DriverManagement deployed to:", driverManagement.target);
  console.log("VehicleManagement deployed to:", vehicleManagement.target);
  console.log("SinisterManagement deployed to:", sinisterManagement.target);
  console.log("All contracts deployed successfully");
}

// Exécution de la fonction principale et gestion des promesses.
// En cas de succès, le processus se termine avec un code de sortie 0 (succès).
// En cas d'erreur, elle affiche l'erreur et termine le processus avec un code de sortie 1 (erreur).
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
