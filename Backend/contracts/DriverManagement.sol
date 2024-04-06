// SPDX-License-Identifier: MIT
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

}