const hre = require("hardhat");
const fs = require('fs');
const path = require('path');
const envFilePath = path.join(__dirname, '../../Frontend/.env');

async function main() {
  const Web3DevMarketplace = await hre.ethers.getContractFactory("Web3DevMarketplace");
  const web3DevMarketplace = await Web3DevMarketplace.deploy();
  await web3DevMarketplace.deployed();
  fs.writeFileSync(envFilePath, `REACT_APP_CONTRACT_ADDRESS="${web3DevMarketplace.address}"`);

  const contractArtifactsPath = path.join(__dirname, '../artifacts/contracts/Web3DevMarketplace.sol/Web3DevMarketplace.json');
  const contractDestPath = path.join(__dirname, '../../Frontend/src/utils/Contract.json');

  fs.copyFileSync(contractArtifactsPath, contractDestPath);

  console.log("Web3DevMarketplace deployed to:", web3DevMarketplace.address);
  console.log("Contract artifacts copied to:", contractDestPath);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });