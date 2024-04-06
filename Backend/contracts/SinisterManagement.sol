// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./VehicleManagement.sol";
import "./DriverManagement.sol";

contract SinisterManagement is Ownable {
    VehicleManagement public vehicleManagement;
    DriverManagement public driverManagement;

    struct Sinister {
        address driver;
        string date;
        uint256 vehicleId;
        string description;
        SinisterStatus status; // Ajout de l'état du sinistre
    }

    struct DetailedSinister {
    uint256 sinisterId;
    string driverName;
    string driverLocation;
    string driverLicenseNumber;
    string driverPhoneNumber;
    string date;
    string vehicleMake;
    string vehicleModel;
    string vehicleColor;
    uint256 vehicleYear;
    string description;
    SinisterStatus status;
}

    enum SinisterStatus {
    Created, // Dossier créé
    Processing, // Dossier en cours de traitement
    Approved, // Dossier validé
    Denied // Dossier refusé
    }


    // Liste de tous les sinistres
    Sinister[] public sinisters;

    constructor(address _vehicleManagementAddress, address _driverManagementAddress) Ownable(msg.sender){
        vehicleManagement = VehicleManagement(_vehicleManagementAddress);
        driverManagement = DriverManagement(_driverManagementAddress);
    }

    modifier onlyVehicled() {
    require(vehicleManagement.getVehicleCount(msg.sender) > 0, "The caller must own at least one vehicle");
    _;
}


    // Fonction pour déclarer un sinistre
    function declareSinister(string memory date, uint256 vehicleId, string memory description) public onlyVehicled {
        
        sinisters.push(Sinister({
            driver: msg.sender,
            date: date,
            vehicleId: vehicleId,
            description: description,
            status : SinisterStatus.Created // Initialisation de l'état
        }));
    }

    // Fonction que l'assureur peut appeler pour voir tous les sinistres
    function viewAllSinisters() public view onlyOwner returns (DetailedSinister[] memory) {
    DetailedSinister[] memory detailedSinisters = new DetailedSinister[](sinisters.length);

    for (uint256 i = 0; i < sinisters.length; i++) {
        // Appel à getDriverProfile pour obtenir le struct DriverProfile
        DriverManagement.DriverProfile memory profile = driverManagement.getDriverProfil(sinisters[i].driver);
        VehicleManagement.Vehicle memory vehicle = vehicleManagement.getVehicleDetails(sinisters[i].driver, sinisters[i].vehicleId);

        detailedSinisters[i] = DetailedSinister({
            sinisterId: i,
            driverName: profile.name,
            driverLocation: profile.location,
            driverLicenseNumber: profile.licenseNumber,
            driverPhoneNumber: profile.phoneNumber,
            date: sinisters[i].date,
            vehicleMake: vehicle.make,
            vehicleModel: vehicle.model,
            vehicleColor: vehicle.color,
            vehicleYear: vehicle.year,
            description: sinisters[i].description,
            status: sinisters[i].status
        });
    }

    return detailedSinisters;
}

    function updateSinisterStatus(uint256 sinisterIndex, SinisterStatus newStatus) public onlyOwner {
        require(sinisterIndex < sinisters.length, "Sinister index out of bounds.");
        Sinister storage sinister = sinisters[sinisterIndex];
        
        // Vérification des transitions d'état valides
        if (newStatus == SinisterStatus.Processing) {
            require(sinister.status == SinisterStatus.Created, "Can only set to Processing from Created status.");
        } else if (newStatus == SinisterStatus.Approved) {
            require(sinister.status == SinisterStatus.Processing, "Can only set to Approved from Processing status.");
        } else if (newStatus == SinisterStatus.Denied) {
            require(sinister.status == SinisterStatus.Processing, "Can only set to Denied from Processing status.");
        } else {
            revert("Invalid status transition.");
        }

        sinister.status = newStatus;
    }

    function getMyAllSinisters(address driverAddress) public view returns (Sinister[] memory) {
        uint256 totalSinisters = 0;
        for (uint256 i = 0; i < sinisters.length; i++) {
            if (sinisters[i].driver == driverAddress) {
                totalSinisters++;
            }
        }

        Sinister[] memory driverSinisters = new Sinister[](totalSinisters);
        uint256 counter = 0;
        for (uint256 i = 0; i < sinisters.length; i++) {
            if (sinisters[i].driver == driverAddress) {
                driverSinisters[counter] = sinisters[i];
                counter++;
            }
        }

        return driverSinisters;
    }
}




