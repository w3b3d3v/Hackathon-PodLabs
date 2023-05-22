const path = require("path");
const { ethers, network, run } = require("hardhat")
const {
    VERIFICATION_BLOCK_CONFIRMATIONS,
    networkConfig,
    developmentChains,
} = require("../../helper-hardhat-config")

async function deployNftERC721(chainId) {
    
    // ethers is available in the global scope
    const [deployer] = await ethers.getSigners();
    const deployerAddress = await deployer.getAddress();
    const LEADER_ROLE = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("LEADER_ROLE"));
    const MEMBER_ROLE = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("MEMBER_ROLE"));

    console.log("Deploying the ERC-721 contract with the account:", deployerAddress);
    const NftERC721 = await ethers.getContractFactory("NftERC721");
    const erc721 = await NftERC721.deploy("Coleção DUH - Testnet", "DUH");
    console.log("NFT (ERC-721) contract address:", erc721.address);
    await erc721.deployed();

    console.log('DEFAULT_ADMIN_ROLE = ', deployerAddress);
    await erc721.grantRole(LEADER_ROLE, "0x289d4092FE8afdB0a9d2d7994219610D208F19d9");
    console.log('New role LEADER_ROLE to adress 0x289d4092FE8afdB0a9d2d7994219610D208F19d9', LEADER_ROLE);
    await erc721.grantRole(LEADER_ROLE, "0x608AbF4328F82Ef053EB1ee73feFA56518F73059");
    console.log('New role LEADER_ROLE to adress 0x608AbF4328F82Ef053EB1ee73feFA56518F73059', LEADER_ROLE);
    await erc721.grantRole(MEMBER_ROLE, "0xE860C991cdbcd8cF8C5e0C59C2F0B4f2e46043D5");
    console.log('New role MEMBER_ROLE to adress 0xE860C991cdbcd8cF8C5e0C59C2F0B4f2e46043D5', MEMBER_ROLE);
    await erc721.grantRole(MEMBER_ROLE, "0x553C28796D99B154Da50F3BFA8681f1bdfb8fa9e");
    console.log('New role MEMBER_ROLE to adress 0x553C28796D99B154Da50F3BFA8681f1bdfb8fa9e', MEMBER_ROLE);
    
    // We also save the contract's artifacts and address in the frontends directories
    saveFrontendFiles(erc721);
    
    if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
        await run("verify:verify", {
            address: erc721.address
        })
    }

}


function saveFrontendFiles(erc, template=0) {
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
      path.join(contractsDir, "contract-nfterc721-address.json"),
      JSON.stringify({ NftERC721: erc.address }, undefined, 2)
    );
    
    const NftERC721Artifact = artifacts.readArtifactSync("NftERC721");
    
    fs.writeFileSync(
      path.join(contractsDir, "NftERC721.json"),
      JSON.stringify(NftERC721Artifact, null, 2)
    );
        
  }

module.exports = {
  deployNftERC721,
}
