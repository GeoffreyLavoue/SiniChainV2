// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

// Importation du contrat Ownable pour la gestion des permissions et du contrat ClientManagement pour l'intégration.
import "@openzeppelin/contracts/access/Ownable.sol";
import "./ClientManagement.sol";

// Déclaration du contrat DriverManagement, qui hérite d'Ownable pour utiliser ses mécanismes de contrôle d'accès.
contract DriverManagement is Ownable {
    // Structure de données représentant le profil d'un conducteur.
    struct DriverProfile {
        bool isRegistered; // Indique si le profil a été enregistré pour éviter les doublons.
        string name;
        string birthday;
        string location;
        string licenseNumber;
        string phoneNumber;
    }

    // Référence au contrat ClientManagement pour vérifier les clients.
    ClientManagement public clientManagement;

    // Mapping associant l'adresse d'un conducteur à son profil.
    mapping(address => DriverProfile) public driverProfiles;

    // Tableau contenant les adresses de tous les conducteurs enregistrés.
    address[] public drivers;

    // Événement émis lors de la création d'un nouveau profil de conducteur.
    event DriverProfileCreated(address driver);

    // Constructeur initialisant le contrat avec une référence à ClientManagement.
    constructor(address _clientManagement) Ownable(msg.sender) {
        clientManagement = ClientManagement(_clientManagement);
    }

    // Modificateur personnalisé pour restreindre certaines actions aux clients uniquement.
    modifier onlyClient() {
        require(clientManagement.isClient(msg.sender), "Not a client");
        _;
    }

    // Fonction pour créer un nouveau profil de conducteur, accessible uniquement aux clients.
    function createDriverProfile(
        string memory name,
        string memory birthday,
        string memory location,
        string memory licenseNumber,
        string memory phoneNumber
    ) public onlyClient {
        require(
            !driverProfiles[msg.sender].isRegistered,
            "Driver profile already exists."
        );
        DriverProfile memory newProfile = DriverProfile({
            isRegistered: true,
            name: name,
            birthday: birthday,
            location: location,
            licenseNumber: licenseNumber,
            phoneNumber: phoneNumber
        });

        driverProfiles[msg.sender] = newProfile;
        drivers.push(msg.sender); // Ajout de l'adresse du conducteur au tableau des conducteurs.
        emit DriverProfileCreated(msg.sender); // Émission de l'événement pour notifier la création.
    }

    // Fonction pour obtenir le profil d'un conducteur, accessible publiquement.
    function getDriverProfil(
        address driverAddress
    ) public view returns (DriverProfile memory) {
        require(
            driverProfiles[driverAddress].isRegistered,
            "Driver profile does not exist."
        );
        return driverProfiles[driverAddress];
    }

    // Fonction pour obtenir la liste de tous les conducteurs, accessible uniquement par le propriétaire du contrat.
    function getAllDrivers() public view onlyOwner returns (address[] memory) {
        return drivers;
    }

    // Fonction pour vérifier si un profil de conducteur a été créé pour une adresse donnée, accessible publiquement.
    function isDriverProfileCreated(
        address driverAddress
    ) public view returns (bool) {
        return driverProfiles[driverAddress].isRegistered;
    }
}
