import React from 'react';
import { Box, Text, Link, Image, Heading, VStack, Code, Container, Button } from '@chakra-ui/react';

export default function Documentation() {
  return (
    <Box>
      <Heading as="header" textAlign="center">
        Documentation - SiniChain
      </Heading>
      <Box as="main" padding="5">
      <Link href="/">
          <Button colorScheme="cyan" mb={4}>Home</Button>
        </Link>


        <Container maxW="container.xl">
          <VStack spacing={10}>
            <Box as="header" textAlign="center">
              <Image
                src="/logo.png" // Assurez-vous que le chemin d'accès est correct
                alt="Logo Sinichain"
                boxSize="200px" // Taille de l'image
                objectFit="cover" // Ajustement de l'image
                marginBottom="4"
              />
            </Box>

            <Box as="section" p="5" shadow="md" borderWidth="1px" borderRadius="md">
              <Heading as="h2" size="md">Litepaper</Heading>
              <Text mt={4}>
                Ce litepaper présente une vue d'ensemble de SiniChain, sa vision, sa mission et ses caractéristiques clés. <Link color="blue.500" href="/path_to_litepaper.pdf" isExternal>Télécharger</Link>
              </Text>
            </Box>

            <Box as="section" p="5" shadow="md" borderWidth="1px" borderRadius="md">
              <Heading as="h2" size="md">Smart Contracts</Heading>
              <Text>clientManagement.sol</Text>
              <pre style={{ overflowX: "auto", padding: "1rem" }}> {/* Ajout du style directement pour l'exemple */}
                <Code w="full">
                  {`// SPDX-License-Identifier: MIT
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

}`}
                </Code>
                <Text>driverManagement.sol</Text>
                <Code p="4" w="full" overflowX="auto">
                  {`// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./ClientManagement.sol";

contract DriverManagement is Ownable {
    struct DriverProfile {
        bool isRegistered;
        string name;
        string birthday;
        string location;
        string licenseNumber;
        string phoneNumber;
    }

    ClientManagement public clientManagement;
    mapping(address => DriverProfile) public driverProfiles;
    address[] public drivers;

    event DriverProfileCreated(address driver);

    constructor(address _clientManagement) Ownable(msg.sender) {
        clientManagement = ClientManagement(_clientManagement);
    }

    modifier onlyClient() {
        require(clientManagement.isClient(msg.sender), "Not a client");
        _;
    }

    

    function createDriverProfile(string memory name, string memory birthday, string memory location, string memory licenseNumber, string memory phoneNumber) public onlyClient{
        require(!driverProfiles[msg.sender].isRegistered, "Driver profile already exists.");
        DriverProfile memory newProfile = DriverProfile({
        isRegistered: true, // Ou la valeur appropriée selon la logique de votre contrat
        name: name,
        birthday : birthday,
        location: location,
        licenseNumber: licenseNumber,
        phoneNumber: phoneNumber
        });

        driverProfiles[msg.sender] = newProfile;
        drivers.push(msg.sender);
        emit DriverProfileCreated(msg.sender);
    }

    function getDriverProfil(address driverAddress) public view returns (DriverProfile memory) {
    require(driverProfiles[driverAddress].isRegistered, "Driver profile does not exist.");
    return driverProfiles[driverAddress];
}

    function getAllDrivers() public view onlyOwner returns (address[] memory) {
        return drivers;
    }

    function isDriverProfileCreated(address driverAddress) public view returns (bool) {
    return driverProfiles[driverAddress].isRegistered;
}

}`}
                </Code>
                <Text>vehicleManagement.sol</Text>
                <Code p="4" w="full" overflowX="auto">
                  {`// SPDX-License-Identifier: MIT
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
`}
                </Code>
                <Text>sinistreManagement.sol</Text>
                <Code p="4" w="full" overflowX="auto">
                  {`// SPDX-License-Identifier: MIT
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
}`}
                </Code>
              </pre>
            </Box>

            <Box as="section" p="10" shadow="md" borderWidth="1px" borderRadius="md">
              <Heading as="h2" size="md">Roadmap</Heading>
              <VStack align="start" spacing={4}>
                <Text fontWeight="bold">Année 1</Text>

                <Text>Q1 - Fondation et Planification:
                  <ul>
                    <li>Lancement de la Whitepaper.</li>
                    <li>Formation de l'équipe fondatrice.</li>
                    <li>Recherche et Développement Initial.</li>
                  </ul>
                </Text>

                <Text>Q2 - Développement et Partenariats:
                  <ul>
                    <li>Prototype du Réseau Sinichain.</li>
                    <li>Partenariats Stratégiques.</li>
                    <li>Programme d'ambassadeurs.</li>
                  </ul>
                </Text>

                <Text>Q3 - Lancement de la Beta et Feedback:
                  <ul>
                    <li>Beta Publique.</li>
                    <li>Campagne de Bug Bounty.</li>
                    <li>Développement de Fonctionnalités Communautaires.</li>
                  </ul>
                </Text>

                <Text>Q4 - Amélioration et Expansion:
                  <ul>
                    <li>Lancement Officiel.</li>
                    <li>Intégration de Nouveaux Partenaires.</li>
                    <li>Programmes de Staking et Récompenses.</li>
                  </ul>
                </Text>

                <Text fontWeight="bold">Année 2</Text>

                <Text>Q1 - Consolidation et Croissance:
                  <ul>
                    <li>Améliorations du Réseau.</li>
                    <li>Expansion Internationale.</li>
                    <li>Initiatives de Formation Blockchain.</li>
                  </ul>
                </Text>

                <Text>Q2 - Innovation et Nouvelles Fonctionnalités:
                  <ul>
                    <li>Lancement de Produits d'Assurance Décentralisés.</li>
                    <li>Intégration AI & ML.</li>
                    <li>Développement Durable et ESG.</li>
                  </ul>
                </Text>

                <Text>Q3 - Renforcement de l'Écosystème:
                  <ul>
                    <li>Plateforme de Gouvernance Décisionnelle.</li>
                    <li>Fonds pour le Développement de l'Écosystème.</li>
                    <li>Événements et Hackathons.</li>
                  </ul>
                </Text>

                <Text>Q4 - Leadership et Durabilité:
                  <ul>
                    <li>Bilan et Ajustement Stratégique.</li>
                    <li>Initiatives de Résilience du Réseau.</li>
                    <li>Rapport d'Impact et Vision pour l'Avenir.</li>
                  </ul>
                </Text>
              </VStack>
            </Box>

          </VStack>
        </Container>
      </Box>
    </Box>
  );
}
