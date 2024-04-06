// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "./ClientManagement.sol";
import "./DriverManagement.sol";

contract VehicleManagement is Ownable {
    struct Vehicle {
        string make;
        string model;
        string color;
        uint256 year;
    }

    // Référence aux contrats ClientManagement et DriverManagement
    DriverManagement public driverManagement;

    // Mapping d'un conducteur à ses véhicules
    mapping(address => Vehicle[]) public driverVehicles;

    // Événements
    event VehicleRegistered(address driver, string make, string model, uint256 year);

    // Constructeur
    constructor(address _driverManagement) Ownable(msg.sender){
        driverManagement = DriverManagement(_driverManagement);
    }

    modifier onlyDriver() {
        require(driverManagement.isDriverProfileCreated(msg.sender), "Not a driver");
        _;
    }

    // Fonction pour enregistrer un véhicule
    function registerVehicle(string memory make, string memory model, string memory color, uint256 year) public onlyDriver{
        require(driverVehicles[msg.sender].length < 3, "Maximum of 3 vehicles per driver.");

        Vehicle memory newVehicle = Vehicle(make, model, color, year);
        driverVehicles[msg.sender].push(newVehicle);

        emit VehicleRegistered(msg.sender, make, model, year);
    }

    // Fonction pour obtenir le nombre de véhicules d'un conducteur
    function getVehicleCount(address driver) public view returns (uint) {
        return driverVehicles[driver].length;
    }

    // Fonction pour obtenir les détails d'un véhicule spécifique d'un conducteur
    function getVehicleDetails(address driver, uint256 index) public view returns (Vehicle memory) {
        require(index < driverVehicles[driver].length, "Vehicle index out of bounds.");
        Vehicle memory vehicle = driverVehicles[driver][index];
        return vehicle;
    }

    function getAllVehicles(address driver) public view returns (string[] memory) {
        require(driverVehicles[driver].length > 0, "Not vehicles.");

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
