// scripts/addClient.js
const hre = require("hardhat");
const ownerAddress = "0x49460515940337F7bC485D4e5434808B3A152227";

async function main() {
    // Obtenir les contrats déployés
    const InsuranceSystem = await hre.ethers.getContractFactory("ClientManagement");
    const insuranceSystem = await InsuranceSystem.attach("0xc8ea7182C2a84df68D4E0f6Cdd6fe91b2c53fDE1");

    // Obtenir un Signer pour l'adresse du propriétaire
    const [ownerSigner] = await hre.ethers.getSigners();
    // Assurez-vous que l'adresse du signer correspond à ownerAddress
    // Cela est crucial si vous utilisez un environnement local ou un testnet
    if (ownerSigner.address.toLowerCase() !== ownerAddress.toLowerCase()) {
        throw new Error("Le Signer obtenu ne correspond pas à ownerAddress");
    }

    // Appel de la fonction addClient avec le Signer
    const tx = await insuranceSystem.connect(ownerSigner).registerClient("0xB9d95b069e0a9465AdE80F943074e6f2898F6356");
    await tx.wait();

    console.log("Client ajouté avec succès");

    console.log("Récupération de tous les clients...");
    const clients = await insuranceSystem.connect(ownerSigner).getAllClients();
    console.log("Clients enregistrés : ", clients);
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });
