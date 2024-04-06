const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Test Driver Management", function() {
  let owner, addr1, addr2, addr3;
  let clientManagement, driverManagement;

  beforeEach(async function () {
    [owner, addr1, addr2, addr3] = await ethers.getSigners();

    const ClientManagementFactory = await ethers.getContractFactory("ClientManagement");
    clientManagement = await ClientManagementFactory.deploy();

    const DriverManagementFactory = await ethers.getContractFactory("DriverManagement");
    driverManagement = await DriverManagementFactory.deploy(clientManagement.target);

    await clientManagement.connect(owner).registerClient(addr1.address);
    await clientManagement.connect(owner).registerClient(addr2.address);

  });

    describe("Deployment", function () {
        it("Should set the right owner", async function () {
        expect(await driverManagement.owner()).to.equal(owner.address);
        });
    });

    describe("Creating Driver Profiles", function () {
        it("Allows a registered client to create a driver profile", async function () {
            await expect(driverManagement.connect(addr1).createDriverProfile(
              "John Doe", "1980-01-01", "123 Main St", "DL12345", "555-1234"
            )).to.emit(driverManagement, "DriverProfileCreated").withArgs(addr1.address);
            
            const isProfileCreated = await driverManagement.isDriverProfileCreated(addr1.address);
            expect(isProfileCreated).to.equal(true);
          });
        
          it("Prevents a non-registered client from creating a driver profile", async function () {
            await expect(driverManagement.connect(addr3).createDriverProfile(
              "Jane Doe", "1985-02-02", "456 Elm St", "DL54321", "555-5678"
            )).to.be.revertedWith("Not a client");
          });
        
          it("Prevents creating multiple profiles for the same client", async function () {
            await driverManagement.connect(addr1).createDriverProfile(
              "John Doe", "1980-01-01", "123 Main St", "DL12345", "555-1234"
            );
            
            await expect(driverManagement.connect(addr1).createDriverProfile(
              "John Doe", "1980-01-01", "124 Main St", "DL12346", "555-1235"
            )).to.be.revertedWith("Driver profile already exists.");
          });
        
          it("Verifies driver profile details after creation", async function () {
            await driverManagement.connect(addr1).createDriverProfile(
              "John Doe", "1980-01-01", "123 Main St", "DL12345", "555-1234"
            );
            
            const profile = await driverManagement.driverProfiles(addr1.address);
            expect(profile.name).to.equal("John Doe");
            expect(profile.birthday).to.equal("1980-01-01");
            expect(profile.location).to.equal("123 Main St");
            expect(profile.licenseNumber).to.equal("DL12345");
            expect(profile.phoneNumber).to.equal("555-1234");
          });
        
    });

    describe("Get All Drivers", function () {
        it("Should return empty array initially", async function () {
            const drivers = await driverManagement.getAllDrivers();
            expect(drivers).to.be.empty;
        });

        it("Should return a list of drivers after registration", async function () {
            // Simuler l'ajout de drivers ici, nécessite que clientManagement soit mocké ou interagi directement
            // Exemple: await driverManagement.createDriverProfile(...);
            const driversBefore = await driverManagement.getAllDrivers();
            expect(driversBefore.length).to.equal(0);

            await driverManagement.connect(addr1).createDriverProfile(
                "John Doe", "1980-01-01", "123 Main St", "DL12345", "555-1234"
              );
            await driverManagement.connect(addr2).createDriverProfile(
                "Janette Doe", "1980-02-01", "113 Main St", "DL12145", "555-1134"
            );

            const driversAfter = await driverManagement.getAllDrivers();
            expect(driversAfter.length).to.be.greaterThan(0);
        });

        it("Should only allow the owner to access the list of drivers", async function () {
            await expect(driverManagement.connect(addr1).getAllDrivers())
                .to.be.revertedWithCustomError(driverManagement, "OwnableUnauthorizedAccount");
        });

        it("Should correctly list the addresses of registered drivers", async function () {
            await driverManagement.connect(addr1).createDriverProfile(
                "John Doe", "1980-01-01", "123 Main St", "DL12345", "555-1234"
              );
            await driverManagement.connect(addr2).createDriverProfile(
                "Janette Doe", "1980-02-01", "113 Main St", "DL12145", "555-1134"
            );

            const drivers = await driverManagement.getAllDrivers();
            expect(drivers).to.include(addr1.address);
            expect(drivers).to.include(addr2.address);
        });
    });
});
