const fs = require("fs");

// This file is only here to make interacting with the Dapp easier,
// feel free to ignore it if you don't need it.

task("faucet", "Sends ETH and tokens to an address")
  .addPositionalParam("receiver", "The address that will receive them")
  .setAction(async ({ receiver }, { ethers }) => {
    if (network.name === "hardhat") {
      console.warn(
        "You are running the faucet task with Hardhat network, which" +
          "gets automatically created and destroyed every time. Use the Hardhat" +
          " option '--network localhost'"
      );
    }

    const addressesFile =
      __dirname + "/../frontend/src/contracts/contract-address.json";

    if (!fs.existsSync(addressesFile)) {
      console.error("You need to deploy your contract first");
      return;
    }

    const addressJson = fs.readFileSync(addressesFile);
    const address = JSON.parse(addressJson);

    if ((await ethers.provider.getCode(address.Token)) === "0x") {
      console.error("You need to deploy your contract first");
      return;
    }

    const token = await ethers.getContractAt("Token", address.Token);
    const [deployer] = await ethers.getSigners();

    var balanceToken = await token.totalSupply();
    var balanceAddr1 = await token.balanceOf(await deployer.getAddress());
    var balanceAddr2 = await token.balanceOf(token.address);
    console.log(
      `=> Balance of ${token.address} is ${ethers.utils.formatEther(balanceToken)} on ${network.name} 
              => Balance of ${await deployer.getAddress()} is ${ethers.utils.formatEther(balanceAddr1)} on ${network.name}
              => Balance of ${token.address} is ${ethers.utils.formatEther(balanceAddr2)} on ${network.name}`
    )
    //const tx = await token.connect(token).transfer(receiver, ethers.utils.parseEther("100"));
    //await tx.wait();

    const tx2 = await deployer.sendTransaction({
      to: receiver,
      value: ethers.constants.WeiPerEther,
    });
    await tx2.wait();

    console.log(`Transferred 1 ETH ${receiver}`);
  })

  module.exports = {}