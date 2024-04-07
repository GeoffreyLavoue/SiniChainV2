// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

// Importation des contrats Ownable pour la gestion des permissions et Strings pour les opérations sur les chaînes de caractères.
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

// Importation des contrats externes pour l'intégration avec la gestion des clients et des conducteurs.
import "./ClientManagement.sol";
import "./DriverManagement.sol";

// Déclaration du contrat VehicleManagement pour gérer les véhicules associés aux conducteurs.
contract VehicleManagement is Ownable {

    // Structure définissant les attributs d'un véhicule.
    struct Vehicle {
        string make;
        string model;
        string color;
        uint256 year;
    }

    // Référence au contrat DriverManagement pour vérifier l'enregistrement des conducteurs.
    DriverManagement public driverManagement;

    // Mapping associant chaque conducteur (adresse) à une liste de ses véhicules.
    mapping(address => Vehicle[]) public driverVehicles;

    // Événement émis lors de l'enregistrement d'un nouveau véhicule.
    event VehicleRegistered(address driver, string make, string model, uint256 year);

    // Constructeur initialisant le contrat avec une adresse de DriverManagement.
    constructor(address _driverManagement) Ownable(msg.sender){
        driverManagement = DriverManagement(_driverManagement);
    }

    // Modificateur pour restreindre certaines fonctions aux conducteurs enregistrés uniquement.
    modifier onlyDriver() {
        require(driverManagement.isDriverProfileCreated(msg.sender), "Not a driver");
        _;
    }

    // Fonction permettant à un conducteur d'enregistrer un nouveau véhicule, limité à 3 par conducteur.
    function registerVehicle(string memory make, string memory model, string memory color, uint256 year) public onlyDriver{
        require(driverVehicles[msg.sender].length < 3, "Maximum of 3 vehicles per driver.");

        Vehicle memory newVehicle = Vehicle(make, model, color, year);
        driverVehicles[msg.sender].push(newVehicle);

        emit VehicleRegistered(msg.sender, make, model, year);
    }

    // Fonction retournant le nombre de véhicules enregistrés pour un conducteur donné.
    function getVehicleCount(address driver) public view returns (uint) {
        return driverVehicles[driver].length;
    }

    // Fonction pour obtenir les détails d'un véhicule spécifique d'un conducteur
    function getVehicleDetails(address driver, uint256 index) public view returns (Vehicle memory) {
        require(index < driverVehicles[driver].length, "Vehicle index out of bounds.");
        Vehicle memory vehicle = driverVehicles[driver][index];
        return vehicle;
    }

    // Fonction retournant les détails de tous les véhicules d'un conducteur sous forme de chaînes de caractères.
    function getAllVehicles(address driver) public view returns (string[] memory) {
        require(driverVehicles[driver].length > 0, "No vehicles.");

        uint256 vehicleCount = driverVehicles[driver].length;
        string[] memory vehiclesDetails = new string[](vehicleCount);

        for (uint256 i = 0; i < vehicleCount; i++) {
            Vehicle memory vehicle = driverVehicles[driver][i];
            vehiclesDetails[i] = string(abi.encodePacked(
                "Marque: ", vehicle.make,
                ", Modele: ", vehicle.model,
                ", Couleur: ", vehicle.color,
                "... Annee: ", Strings.toString(vehicle.year)

            ));

         }

        return vehiclesDetails;
    }
}
