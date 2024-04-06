const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("SinisterManagement", function () {
  let SinisterManagement;
  let sinisterManagement;
  let owner, addr1, addr2, addr3;
  let vehicleManagement;

  beforeEach(async function () {
    [owner, addr1, addr2, addr3] = await ethers.getSigners();

    const ClientManagementFactory = await ethers.getContractFactory("ClientManagement");
    clientManagement = await ClientManagementFactory.deploy();

    const DriverManagementFactory = await ethers.getContractFactory("DriverManagement");
    driverManagement = await DriverManagementFactory.deploy(clientManagement.target);

    const VehicleManagementFactory = await ethers.getContractFactory("VehicleManagement");
    vehicleManagement = await VehicleManagementFactory.deploy(driverManagement.target);

    SinisterManagement = await ethers.getContractFactory("SinisterManagement");
    sinisterManagement = await SinisterManagement.deploy(vehicleManagement.target, driverManagement.target);

    // Supposons que addr1 possède au moins un véhicule.

    await clientManagement.connect(owner).registerClient(addr1.address);
    await driverManagement.connect(addr1).createDriverProfile("John Doe", "21/12/99", "123 Main St", "DL123456", "555-1234");
    await vehicleManagement.connect(addr1).registerVehicle("Ferrari", "Enzo", "Red", 2002);
    await sinisterManagement.connect(addr1).declareSinister("2022-01-02", 0, "Minor scratch on the left door");
    await clientManagement.connect(owner).registerClient(addr3.address);
    await driverManagement.connect(addr3).createDriverProfile("Jenna Doe", "12/12/99", "122 Main St", "DL124456", "555-1214");
    await vehicleManagement.connect(addr3).registerVehicle("Ferrari", "F40", "Black", 1987);
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await sinisterManagement.owner()).to.equal(owner.address);
    });
    it("Should have correct vehicle and driver management addresses", async function () {
      expect(await sinisterManagement.driverManagement()).to.equal(driverManagement.target);
      expect(await sinisterManagement.vehicleManagement()).to.equal(vehicleManagement.target);

    });

  });
  describe("declareSinister", function () {
    it("Should fail if the caller does not own any vehicles", async function () {
      await expect(sinisterManagement.connect(addr2).declareSinister("2024-01-01", 1, "Description"))
        .to.be.revertedWith("The caller must own at least one vehicle");
    });

    it("Should successfully declare a sinister for a vehicle owner", async function () {
      await expect(sinisterManagement.connect(addr1).declareSinister("2024-01-02", 1, "Minor scratch on the left door"))
        .to.not.be.reverted;
      const sinisters = await sinisterManagement.getMyAllSinisters(addr1.address);
      expect(sinisters.length).to.equal(2);
      expect(sinisters[1].date).to.equal("2024-01-02");
      expect(sinisters[1].description).to.equal("Minor scratch on the left door");
      // Vérifiez d'autres champs si nécessaire
    });

    it("Should handle a large number of sinisters efficiently", async function () {
      // Déclarer un grand nombre de sinistres pour tester la performance et le coût en gaz
      for (let i = 0; i < 100; i++) {
        await sinisterManagement.connect(addr1).declareSinister(`2024-01-${i + 1}`, 1, `Description ${i}`);
      }
      // Vérifier que l'ajout est réussi sans atteindre la limite de gaz
      const sinisters = await sinisterManagement.getMyAllSinisters(addr1.address);
      expect(sinisters.length).to.equal(101);
    });
    
    


  });

  describe("Accessing Sinister Details", function () {
    it("Should allow the owner to view all sinisters", async function () {
      // Supposons qu'un sinistre a déjà été déclaré par addr1
      const sinisters = await sinisterManagement.connect(owner).viewAllSinisters();
      expect(sinisters.length).to.be.greaterThan(0);
    });

    it("Should not allow non-owner to view all sinisters", async function () {
      await expect(sinisterManagement.connect(addr1).viewAllSinisters())
        .to.be.revertedWithCustomError(sinisterManagement, "OwnableUnauthorizedAccount");
    });

    it("Should allow users to retrieve their own sinisters", async function () {
      // Après avoir déclaré un sinistre pour addr1
      const sinisters = await sinisterManagement.connect(addr1).getMyAllSinisters(addr1.address);
      expect(sinisters.length).to.be.greaterThan(0);
    });

    it("Should return an empty array for users with no sinisters", async function () {
      const sinisters = await sinisterManagement.connect(addr2).getMyAllSinisters(addr2.address);
      expect(sinisters.length).to.equal(0);
    });
    
  });

  describe("Update Sinister Status", function () {
    it("Should allow the owner to update a sinister status following the valid transitions", async function () {
      // Assurez-vous d'avoir un sinistre déclaré et récupérez son index
      // Exemple de mise à jour du statut à Processing
      await expect(sinisterManagement.connect(owner).updateSinisterStatus(0, 1)) // Assumer 1 correspond à Processing
        .to.not.be.reverted;
      const sinisters = await sinisterManagement.getMyAllSinisters(addr1.address);
      expect(sinisters[0].status).to.equal(1); // Vérifiez que le statut est mis à jour
    });

    it("Should revert when trying to update a nonexistent sinister", async function () {
      await expect(sinisterManagement.connect(owner).updateSinisterStatus(999, 1)) // 999 est un index hypothétiquement inexistant
        .to.be.revertedWith("Sinister index out of bounds.");
    });

    it("Should revert when a non-owner tries to update sinister status", async function () {
      // Assumer qu'un sinistre existe à l'index 0
      await expect(sinisterManagement.connect(addr1).updateSinisterStatus(0, 1))
        .to.be.revertedWithCustomError(sinisterManagement, "OwnableUnauthorizedAccount");
    });
    
    
  });



}); 