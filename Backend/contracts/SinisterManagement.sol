// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

// Importation des contrats et librairies nécessaires.
import "@openzeppelin/contracts/access/Ownable.sol";
import "./VehicleManagement.sol";
import "./DriverManagement.sol";

// Déclaration du contrat principal pour la gestion des sinistres.
contract SinisterManagement is Ownable {

    // Références à d'autres contrats pour intégration et vérification.
    VehicleManagement public vehicleManagement;
    DriverManagement public driverManagement;

    // Structure définissant un sinistre avec plusieurs attributs dont l'état du sinistre.
    struct Sinister {
        address driver;
        string date;
        uint256 vehicleId;
        string description;
        SinisterStatus status; 
    }

    // Structure pour les sinistres avec détails supplémentaires, utilisée dans viewAllSinisters.
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

    // Énumération représentant les différents états possibles d'un sinistre.
    enum SinisterStatus {
        Created, // Dossier créé
        Processing, // Dossier en cours de traitement
        Approved, // Dossier validé
        Denied // Dossier refusé
    }

    // Liste pour stocker tous les sinistres déclarés.
    Sinister[] public sinisters;

    // Constructeur initialisant les références aux contrats VehicleManagement et DriverManagement.
    constructor(
        address _vehicleManagementAddress,
        address _driverManagementAddress
    ) Ownable(msg.sender) {
        vehicleManagement = VehicleManagement(_vehicleManagementAddress);
        driverManagement = DriverManagement(_driverManagementAddress);
    }

    // Modificateur pour restreindre l'accès aux fonctions aux utilisateurs possédant au moins un véhicule.
    modifier onlyVehicled() {
        require(
            vehicleManagement.getVehicleCount(msg.sender) > 0,
            "The caller must own at least one vehicle"
        );
        _;
    }

    // Fonction permettant à un conducteur de déclarer un sinistre.
    function declareSinister(
        string memory date,
        uint256 vehicleId,
        string memory description
    ) public onlyVehicled {
        sinisters.push(
            Sinister({
                driver: msg.sender,
                date: date,
                vehicleId: vehicleId,
                description: description,
                status: SinisterStatus.Created // Initialisation de l'état
            })
        );
    }

    // Fonction permettant au propriétaire du contrat (assureur) de voir tous les sinistres déclarés.
    function viewAllSinisters()
        public
        view
        onlyOwner
        returns (DetailedSinister[] memory)
    {
        DetailedSinister[] memory detailedSinisters = new DetailedSinister[](
            sinisters.length
        );

        for (uint256 i = 0; i < sinisters.length; i++) {
            // Récupération des informations détaillées sur le conducteur et le véhicule concerné par le sinistre.
            DriverManagement.DriverProfile memory profile = driverManagement
                .getDriverProfil(sinisters[i].driver);
            VehicleManagement.Vehicle memory vehicle = vehicleManagement
                .getVehicleDetails(sinisters[i].driver, sinisters[i].vehicleId);

            // Construction du sinistre détaillé.
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

    // Fonction pour mettre à jour l'état d'un sinistre, réservée au propriétaire du contrat.
    function updateSinisterStatus(
        uint256 sinisterIndex,
        SinisterStatus newStatus
    ) public onlyOwner {
        require(
            sinisterIndex < sinisters.length,
            "Sinister index out of bounds."
        );
        // Mise à jour de l'état avec validation des transitions d'état valides.
        Sinister storage sinister = sinisters[sinisterIndex];

        // Vérification des transitions d'état valides
        if (newStatus == SinisterStatus.Processing) {
            require(
                sinister.status == SinisterStatus.Created,
                "Can only set to Processing from Created status."
            );
        } else if (newStatus == SinisterStatus.Approved) {
            require(
                sinister.status == SinisterStatus.Processing,
                "Can only set to Approved from Processing status."
            );
        } else if (newStatus == SinisterStatus.Denied) {
            require(
                sinister.status == SinisterStatus.Processing,
                "Can only set to Denied from Processing status."
            );
        } else {
            revert("Invalid status transition.");
        }

        sinister.status = newStatus;
    }

    // Fonction pour obtenir tous les sinistres déclarés par un conducteur spécifique.
    function getMyAllSinisters(
        address driverAddress
    ) public view returns (Sinister[] memory) {
        uint256 totalSinisters = 0;
        // Comptage des sinistres du conducteur.
        for (uint256 i = 0; i < sinisters.length; i++) {
            if (sinisters[i].driver == driverAddress) {
                totalSinisters++;
            }
        }

        // Comptage des sinistres du conducteur.
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
