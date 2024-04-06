const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  const clientManagement = await hre.ethers.deployContract("ClientManagement");
  await clientManagement.waitForDeployment();

  const driverManagement = await hre.ethers.deployContract("DriverManagement", [clientManagement.target]);
  await driverManagement.waitForDeployment();

  const vehicleManagement = await hre.ethers.deployContract("VehicleManagement", [driverManagement.target]);
  await vehicleManagement.waitForDeployment();

  const sinisterManagement = await hre.ethers.deployContract("SinisterManagement", [vehicleManagement.target, driverManagement.target]);
  await sinisterManagement.waitForDeployment();

  console.log("ClientManagement deployed to:", clientManagement.target);
  console.log("DriverManagement deployed to:", driverManagement.target);
  console.log("VehicleManagement deployed to:", vehicleManagement.target);
  console.log("SinisterManagement deployed to:", sinisterManagement.target);
  console.log("All contracts deployed successfully");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
