const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Test Client Management", function () {
  let owner, addr1, addr2, addr3;
  let clientManagement;

  beforeEach(async function () {
    [owner, addr1, addr2, addr3] = await ethers.getSigners();

    const ClientManagementFactory = await ethers.getContractFactory("ClientManagement");
    clientManagement = await ClientManagementFactory.deploy();

  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await clientManagement.owner()).to.equal(owner.address);
    });
  });

  describe("registerClient", function () {
    it("Should register a new client and emit an event", async function () {
      await expect(clientManagement.registerClient(addr1.address))
        .to.emit(clientManagement, "ClientRegistered")
        .withArgs(addr1.address);
      expect(await clientManagement.isClient(addr1.address)).to.equal(true);
    });

    it("Should fail if non-owner tries to register a client", async function () {
      await expect(clientManagement.connect(addr1).registerClient(addr2.address))
        .to.be.revertedWithCustomError(clientManagement,"OwnableUnauthorizedAccount");
    });

    it("Should fail if client is already registered", async function () {
      await clientManagement.registerClient(addr1.address);
      await expect(clientManagement.registerClient(addr1.address))
        .to.be.revertedWith("Client already registered");
    });
  });

  describe("getAllClients", function () {
    it("Should allow owner to retrieve all clients", async function () {
      await clientManagement.registerClient(addr1.address);
      await clientManagement.registerClient(addr2.address);
      expect(await clientManagement.getAllClients()).to.deep.equal([addr1.address, addr2.address]);
    });

    it("Should fail if non-owner tries to retrieve all clients", async function () {
      await expect(clientManagement.connect(addr1).getAllClients())
        .to.be.revertedWithCustomError(clientManagement,"OwnableUnauthorizedAccount");
    });
  });

  describe("isClient", function () {
    it("Should return true if address is a registered client", async function () {
      await clientManagement.registerClient(addr1.address);
      expect(await clientManagement.isClient(addr1.address)).to.equal(true);
    });

    it("Should return false if address is not a registered client", async function () {
      expect(await clientManagement.isClient(addr2.address)).to.equal(false);
    });
  });
});
  