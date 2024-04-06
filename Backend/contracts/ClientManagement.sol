// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";

// Erreur personnalisé 
error handlingError(string message);

contract ClientManagement is Ownable {
    // Déclaration du mapping en dehors du constructeur
    mapping(address => bool) public isClient;
    address[] private clients;


    // Événement pour signaler l'enregistrement d'un conducteur
    event ClientRegistered(address client);

    // Constructeur qui définit le propriétaire initial du contrat
     constructor() Ownable(msg.sender) {
        // Pas besoin de passer initialOwner si vous utilisez la version standard d'Ownable
        // Le propriétaire sera automatiquement l'adresse qui déploie le contrat
    }

    // Fonction pour enregistrer un conducteur, accessible uniquement par l'assureur
    function registerClient(address _client) public onlyOwner {
        require(!isClient[_client], "Client already registered");
        isClient[_client] = true;
        clients.push(_client); // Stocker l'adresse du client enregistré
        emit ClientRegistered(_client);
    }

    function getAllClients() public view onlyOwner returns (address[] memory) {
    return clients;
    }

}