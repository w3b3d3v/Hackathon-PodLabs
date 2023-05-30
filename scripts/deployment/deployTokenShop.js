const path = require("path");
const { ethers, network, run } = require("hardhat")
const {
    VERIFICATION_BLOCK_CONFIRMATIONS,
    networkConfig,
    developmentChains,
} = require("../../helper-hardhat-config")

async function deployTokenShop(chainId) {
    
    // ethers is available in the global scope
    const [deployer] = await ethers.getSigners();
    const deployerAddress = await deployer.getAddress();
    console.log("Deploying the token contract with the account:", await deployer.getAddress());
    console.log("Account balance:", (ethers.utils.formatEther(await deployer.getBalance())));
    
    const Token = await ethers.getContractFactory("Token");
    const token = await Token.deploy();
    await token.deployed();
    console.log("Token contract address:", token.address);

    console.log("Mint 1000000 tokens do address (carteira MM de teste):", "0x289d4092FE8afdB0a9d2d7994219610D208F19d9");
    await token.mint("0x289d4092FE8afdB0a9d2d7994219610D208F19d9", ethers.utils.parseEther("1000000"));
    console.log("Mint 1000000 tokens do address:", token.address);
    await token.mint(token.address, ethers.utils.parseEther("1000000"));
    
    console.log("Account balance (token):", (ethers.utils.formatEther(await token.balanceOf(token.address))));

    // We also save the contract's artifacts and address in the frontend directory
    saveFrontendFiles(token);

    console.log("Deploying the Token Shop contract with the account:", deployerAddress);

    const TokenShop = await ethers.getContractFactory("TokenShop");
    const tokenShop = await TokenShop.deploy(token.address);
    await tokenShop.deployed();
    console.log(`Token and Token Shop are deployed to ${deployerAddress} on ${network.name}`)

    //Add Token Shop to mint tokens
    await token.addMinter(tokenShop.address);
    console.log('Token Shop added as minter of Token.');   


    // We also save the contract's artifacts and address in the frontend directory
    saveFrontendFilesTokenShop(tokenShop);

    if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
        await run("verify:verify", {
            address: token.address
        })
    }
}


function saveFrontendFiles(contract, template=0) {
    const fs = require("fs");
    var contractsDir = path.join(__dirname, "../../", "frontend", "src", "contracts");
    if (template > 0){
      contractsDir = path.join(__dirname, "../../", "frontend"+template, "src", "contracts");
    }
    console.log('Saving frontend files...')
    if (!fs.existsSync(contractsDir)) {
      fs.mkdirSync(contractsDir);
    }
  
    fs.writeFileSync(
      path.join(contractsDir, "contract-address.json"),
      JSON.stringify({ Token: contract.address }, undefined, 2)
    );
  
    const TokenArtifact = artifacts.readArtifactSync("Token");
  
    fs.writeFileSync(
      path.join(contractsDir, "Token.json"),
      JSON.stringify(TokenArtifact, null, 2)
    );
  }

function saveFrontendFilesTokenShop(contract, template=0) {
    const fs = require("fs");
    var contractsDir = path.join(__dirname, "../../", "frontend", "src", "contracts");
    if (template > 0){
      contractsDir = path.join(__dirname, "../../", "frontend"+template, "src", "contracts");
    }
    console.log('Saving frontend files...')
    if (!fs.existsSync(contractsDir)) {
      fs.mkdirSync(contractsDir);
    }
  
    fs.writeFileSync(
      path.join(contractsDir, "contract-tokkenshop-address.json"),
      JSON.stringify({ TokenShop: contract.address }, undefined, 2)
    );
  
    const TokenShopArtifact = artifacts.readArtifactSync("TokenShop");
  
    fs.writeFileSync(
      path.join(contractsDir, "TokenShop.json"),
      JSON.stringify(TokenShopArtifact, null, 2)
    );
  }

module.exports = {
  deployTokenShop,
}
