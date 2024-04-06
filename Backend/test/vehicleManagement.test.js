const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("VehicleManagement Tests", function () {
  let clientManagement, driverManagement, vehicleManagement;
  let owner, addr1, addr2, addr3, addr4;

  before(async function () {
    [owner, addr1, addr2, addr3, addr4] = await ethers.getSigners();

    const ClientManagementFactory = await ethers.getContractFactory("ClientManagement");
    clientManagement = await ClientManagementFactory.deploy();

    const DriverManagementFactory = await ethers.getContractFactory("DriverManagement");
    driverManagement = await DriverManagementFactory.deploy(clientManagement.target);

    const VehicleManagementFactory = await ethers.getContractFactory("VehicleManagement");
    vehicleManagement = await VehicleManagementFactory.deploy(driverManagement.target);

    // Enregistrez addr1 comme client et créez un profil de conducteur pour les tests suivants
    await clientManagement.connect(owner).registerClient(addr1.address);
    await driverManagement.connect(addr1).createDriverProfile("John Doe", "21/12/99", "123 Main St", "DL123456", "555-1234");
    await clientManagement.connect(owner).registerClient(addr3.address);
    await driverManagement.connect(addr3).createDriverProfile("Janne Doe", "21/12/2000", "1 Saint St", "DL121156", "555-1634");
    await clientManagement.connect(owner).registerClient(addr4.address);
    await driverManagement.connect(addr4).createDriverProfile("Robert Doe", "21/12/1998", "1 Mark St", "DL121156", "555-3334");
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await vehicleManagement.owner()).to.equal(owner.address);
    });
  });

  describe("Registering Vehicles", function () {
    it("allows a driver to register a vehicle", async function () {
      await expect(vehicleManagement.connect(addr1).registerVehicle("Tesla", "Model S", "Red", 2021))
        .to.emit(vehicleManagement, "VehicleRegistered")
        .withArgs(addr1.address, "Tesla", "Model S", 2021);

      const vehicleCount = await vehicleManagement.getVehicleCount(addr1.address);
      expect(vehicleCount).to.equal(1);
    });

    it("does not allow non-driver to register a vehicle", async function () {
      await expect(vehicleManagement.connect(addr2).registerVehicle("Ford", "Mustang", "Blue", 1967))
        .to.be.revertedWith("Not a driver");
    });

    it("limits the number of vehicles a driver can register", async function () {
      await vehicleManagement.connect(addr1).registerVehicle("Tesla", "Model 3", "White", 2020);
      await vehicleManagement.connect(addr1).registerVehicle("Tesla", "Model X", "Black", 2019);
      await expect(vehicleManagement.connect(addr1).registerVehicle("Tesla", "Model Y", "Silver", 2022))
        .to.be.revertedWith("Maximum of 3 vehicles per driver.");
    });

    it("Should not allow a non-driver to register a vehicle", async function () {
      await expect(vehicleManagement.connect(addr2).registerVehicle("Porsche", "911", "Silver", 2023))
        .to.be.revertedWith("Not a driver");
    });

    it("Should emit VehicleRegistered event on vehicle registration", async function () {
      await expect(vehicleManagement.connect(addr4).registerVehicle("Lexus", "RX", "Gold", 2021))
        .to.emit(vehicleManagement, "VehicleRegistered")
        .withArgs(addr4.address, "Lexus", "RX", 2021);
    });


  });

  describe("Accessing Vehicle Details", function () {
    it("allows accessing vehicle details", async function () {
      const [make, model, color, year] = await vehicleManagement.getVehicleDetails(addr1.address, 0);
      expect(make).to.equal("Tesla");
      expect(model).to.equal("Model S");
      expect(color).to.equal("Red");
      expect(year).to.equal(2021);
    });

    it("prevents accessing vehicle details out of bounds", async function () {
      await expect(vehicleManagement.getVehicleDetails(addr1.address, 5))
        .to.be.revertedWith("Vehicle index out of bounds.");
    });

    it("Should return the correct number of vehicles for a driver", async function () {
      await vehicleManagement.connect(addr3).registerVehicle("Audi", "A4", "White", 2018);
      expect(await vehicleManagement.getVehicleCount(addr3.address)).to.equal(1);
    });
    it("should return all registered vehicles for a driver", async function () {
      // Assurez-vous que addr3 a déjà enregistré un véhicule dans les tests précédents
      const vehicles = await vehicleManagement.getAllVehicles(addr3.address);
      expect(vehicles.length).to.equal(1);
      // Vous pourriez vouloir vérifier plus de détails sur le véhicule retourné
  });
  
  });

  describe("Vehicle Registration Across Multiple Drivers", function () {
    it("should allow multiple drivers to register vehicles independently", async function () {
      await vehicleManagement.connect(addr4).registerVehicle("Nissan", "Leaf", "Green", 2018);
      await vehicleManagement.connect(addr3).registerVehicle("Chevrolet", "Bolt", "Blue", 2019);
  
      const vehicleCountAddr1 = await vehicleManagement.getVehicleCount(addr4.address);
      const vehicleCountAddr3 = await vehicleManagement.getVehicleCount(addr3.address);
  
      expect(vehicleCountAddr1).to.equal(2); // En supposant qu'addr1 a déjà 3 véhicules
      expect(vehicleCountAddr3).to.equal(2); // En supposant qu'addr3 a déjà 1 véhicule
    });
  });
  


});
