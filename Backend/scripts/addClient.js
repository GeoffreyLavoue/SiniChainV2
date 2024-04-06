// scripts/addClient.js
const hre = require("hardhat");
const ownerAddress = "0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266";

async function main() {
    // Obtenir les contrats déployés
    const InsuranceSystem = await hre.ethers.getContractFactory("ClientManagement");
    const insuranceSystem = await InsuranceSystem.attach("0x5fbdb2315678afecb367f032d93f642f64180aa3");

    // Obtenir un Signer pour l'adresse du propriétaire
    const [ownerSigner] = await hre.ethers.getSigners();
    // Assurez-vous que l'adresse du signer correspond à ownerAddress
    // Cela est crucial si vous utilisez un environnement local ou un testnet
    if (ownerSigner.address.toLowerCase() !== ownerAddress.toLowerCase()) {
        throw new Error("Le Signer obtenu ne correspond pas à ownerAddress");
    }

    // Appel de la fonction addClient avec le Signer
    const tx = await insuranceSystem.connect(ownerSigner).registerClient("0x23618e81E3f5cdF7f54C3d65f7FBc0aBf5B21E8f");
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
