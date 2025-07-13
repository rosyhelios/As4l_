const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);

  const TestUSDC = await ethers.getContractFactory("TestUSDC");
  const testUSDC = await TestUSDC.deploy();
  await testUSDC.deployed();
  console.log("TestUSDC deployed to:", testUSDC.address);

  const SecureUSDCTransfer = await ethers.getContractFactory("SecureUSDCTransfer");
  const secureTransfer = await SecureUSDCTransfer.deploy(testUSDC.address);
  await secureTransfer.deployed();
  console.log("SecureUSDCTransfer deployed to:", secureTransfer.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
