// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through node <script>.
//
// You can also run a script with npx hardhat run <script>. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
// deploy.js
const { ethers } = require("hardhat");

async function deployContracts() {
  const PublicBlockchain = await ethers.getContractFactory("PublicBlockchain");
  const publicBlockchain = await PublicBlockchain.deploy();
  await publicBlockchain.deployed();
  console.log("Public Blockchain Contract Address:", publicBlockchain.address);
  const CollegeBlockchain = await ethers.getContractFactory(
    "CollegeBlockchain"
  );
  const collegeBlockchain = await CollegeBlockchain.deploy();
  await collegeBlockchain.deployed();
  console.log(
    "Private Blockchain Contract Address:",
    collegeBlockchain.address
  );
}

deployContracts().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
