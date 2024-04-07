// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

// Importation du contrat Ownable d'OpenZeppelin pour la gestion des permissions
import "@openzeppelin/contracts/access/Ownable.sol";

// Contrat de gestion des clients, permettant d'enregistrer et de lister des clients
contract ClientManagement is Ownable {
    // Mapping pour suivre si une adresse est enregistrée en tant que client
    mapping(address => bool) public isClient;
    // Liste privée des adresses des clients enregistrés
    address[] private clients;

    // Événement émis lors de l'enregistrement d'un nouveau client
    event ClientRegistered(address client);

    // Constructeur pour initialiser le contrat avec le déploiement par le propriétaire
    constructor() Ownable(msg.sender) {
        // Le propriétaire est automatiquement défini comme l'adresse déployant le contrat
    }

    // Fonction permettant au propriétaire du contrat d'enregistrer un nouveau client
    // L'enregistrement échoue si le client est déjà enregistré
    function registerClient(address _client) public onlyOwner {
        require(!isClient[_client], "Client already registered");
        isClient[_client] = true;
        clients.push(_client); // Stocker l'adresse du client enregistré
        emit ClientRegistered(_client);
    }
    // Fonction pour obtenir la liste de tous les clients enregistrés, accessible uniquement par le propriétaire
    function getAllClients() public view onlyOwner returns (address[] memory) {
        // Retourner la liste des adresses des clients
        return clients;
    }
}
