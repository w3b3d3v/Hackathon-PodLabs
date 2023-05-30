const { network, ethers } = require("hardhat")
const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers")
const { developmentChains } = require("../../helper-hardhat-config")
const { expect } = require("chai");
const { BigNumber } = require("ethers");

const ether = (amount) => {
  const weiString = ethers.utils.parseEther(amount.toString());
  return BigNumber.from(weiString);
};

!developmentChains.includes(network.name)
    ? describe.skip
    : describe("NftERC721 contract", function () {
      // We define a fixture to reuse the same setup in every test. We use
      // loadFixture to run this setup once, snapshot that state, and reset Hardhat
      // Network to that snapshot in every test.
      async function deployNftERC721Fixture() {
        // Get the ContractFactory and Signers here.
        const NftERC721 = await ethers.getContractFactory("NftERC721");
        const [owner, addr1, admin, leader, member] = await ethers.getSigners();
    
        // To deploy our contract, we just have to call Token.deploy() and await
        // for it to be deployed(), which happens onces its transaction has been
        // mined.        
        const hardhatNftERC721 = await NftERC721.deploy("Collection Test", "TST");
    
        await hardhatNftERC721.deployed();
    
        // Fixtures can return anything you consider useful for your tests
        return { NftERC721, hardhatNftERC721, owner, addr1, admin, leader, member};
      }

      async function deployNftERC721WithGrantsFixture() {
        // Get the ContractFactory and Signers here.
        const NftERC721 = await ethers.getContractFactory("NftERC721");
        const [owner, addr1, admin, leader1, leader2, member] = await ethers.getSigners();
    
        // To deploy our contract, we just have to call Token.deploy() and await
        // for it to be deployed(), which happens onces its transaction has been
        // mined.        
        const hardhatNftERC721 = await NftERC721.deploy("Collection Test", "TST");

        const LEADER_WALLET = leader1.address;
        const LEADER_ROLE = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("LEADER_ROLE"));
        const MEMBER_WALLET = member.address;
        const MEMBER_ROLE = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("MEMBER_ROLE"));
          
        await hardhatNftERC721.grantRole(MEMBER_ROLE, MEMBER_WALLET);
        await hardhatNftERC721.grantRole(LEADER_ROLE, LEADER_WALLET);
    
        await hardhatNftERC721.deployed();
    
        // Fixtures can return anything you consider useful for your tests
        return { NftERC721, hardhatNftERC721, owner, admin, leader1, leader2, member};
      }

      async function deployNftERC721WithGrantsAndMintFixture() {
        // Get the ContractFactory and Signers here.
        const NftERC721 = await ethers.getContractFactory("NftERC721");
        const [owner, leader, member] = await ethers.getSigners();
    
        // To deploy our contract, we just have to call Token.deploy() and await
        // for it to be deployed(), which happens onces its transaction has been
        // mined.        
        const hardhatNftERC721 = await NftERC721.deploy("Collection Test", "TST");

        await hardhatNftERC721.deployed();

        const LEADER_WALLET = leader.address;
        const LEADER_ROLE = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("LEADER_ROLE"));
        const MEMBER_WALLET = member.address;
        const MEMBER_ROLE = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("MEMBER_ROLE"));
          
        await hardhatNftERC721.grantRole(MEMBER_ROLE, MEMBER_WALLET);
        await hardhatNftERC721.grantRole(LEADER_ROLE, LEADER_WALLET);
        console.log(
          `=> MEMBER ${MEMBER_WALLET}  
            => LEADER  ${LEADER_WALLET}`
        )
    
        const tokenUri = "{\"name\":\"Atividade 4\",\"description\":\"Descrição da atividade 4\",\"image\":\"https://gateway.pinata.cloud/ipfs/QmW78MP2JunDmEEnVuVcAzqamm2vZj8rfEq3FFXU6qo1qB\",\"external_url\":\"https://github.com/durdsvianna/\",\"background_color\":\"\",\"animation_url\":\"\",\"youtube_url\":\"\",\"attributes\":[{\"trait_type\":\"Status\",\"value\":\"2\"},{\"trait_type\":\"Dificulty\",\"value\":\"2\"},{\"trait_type\":\"Expire Date\",\"value\":\"2023-04-30T03:00:00.000Z\"},{\"trait_type\":\"Rewards\",\"value\":\"230\"}]}";        
        let amount = ether(1);
        //mint nfts
        await hardhatNftERC721.connect(leader).safeMint(hardhatNftERC721.address, JSON.parse(tokenUri), {value: amount});
        var counterTokenId = (await hardhatNftERC721.tokenIdCounter())-1;
    
        // Fixtures can return anything you consider useful for your tests
        return { NftERC721, hardhatNftERC721, owner, leader, member, counterTokenId};
      }
    
      // You can nest describe calls to create subsections.
      describe("Deployment", function () {
        // `it` is another Mocha function. This is the one you use to define your
        // tests. It receives the test name, and a callback function.
    
        // If the callback function is async, Mocha will `await` it.
        it("Should set the right owner", async function () {
          // We use loadFixture to setup our environment, and then assert that
          // things went well
          const { hardhatNftERC721, owner } = await loadFixture(deployNftERC721Fixture);
    
          // Expect receives a value and wraps it in an assertion object. These
          // objects have a lot of utility methods to assert values.
    
          // This test expects the owner variable stored in the contract to be
          // equal to our Signer's owner.
          expect(await hardhatNftERC721.signer.getAddress()).to.equal(owner.address);
        });
    
        it("Should assign the total supply of NFTs to the owner", async function () {
          const { hardhatNftERC721, owner } = await loadFixture(deployNftERC721Fixture);
          const ownerBalance = await hardhatNftERC721.balanceOf(owner.address);
          expect(await hardhatNftERC721.tokenIdCounter()).to.equal(ownerBalance);
        });
      });
    
      describe("Access Control", function () {
        it("Should set LEADER role to a wallet and check if the wallet is granted", async function () {
          const { hardhatNftERC721, owner, leader, member } = await loadFixture(deployNftERC721Fixture);
          const LEADER_WALLET = leader.address;
          const LEADER_ROLE = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("LEADER_ROLE"));
          
          await hardhatNftERC721.grantRole(LEADER_ROLE, LEADER_WALLET);
          expect(await hardhatNftERC721.checkAddressLeader(LEADER_WALLET)).to.equal(true);
        });

        it("Should set MEMBER role to a wallet and check if the wallet is granted", async function () {
          const { hardhatNftERC721, owner, leader, member } = await loadFixture(deployNftERC721Fixture);
          const MEMBER_WALLET = member.address;
          const MEMBER_ROLE = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("MEMBER_ROLE"));
          
          await hardhatNftERC721.grantRole(MEMBER_ROLE, MEMBER_WALLET);
          expect(await hardhatNftERC721.checkAddressMember(MEMBER_WALLET)).to.equal(true);
        });
      });

      describe("Transactions (with role grants)", function () {
        it("Should mint a NFT to the contract", async function () {
          const { hardhatNftERC721, owner, leader1, member } = await loadFixture(deployNftERC721WithGrantsFixture);
          const tokenUri = "{\"name\":\"Atividade 4\",\"description\":\"Descrição da atividade 4\",\"image\":\"https://gateway.pinata.cloud/ipfs/QmW78MP2JunDmEEnVuVcAzqamm2vZj8rfEq3FFXU6qo1qB\",\"external_url\":\"https://github.com/durdsvianna/\",\"background_color\":\"\",\"animation_url\":\"\",\"youtube_url\":\"\",\"attributes\":[{\"trait_type\":\"Status\",\"value\":\"2\"},{\"trait_type\":\"Dificulty\",\"value\":\"2\"},{\"trait_type\":\"Expire Date\",\"value\":\"2023-04-30T03:00:00.000Z\"},{\"trait_type\":\"Rewards\",\"value\":\"230\"}]}";          
          let amount = ether(1);
          //mint nfts          
          var balanceBefore = await hardhatNftERC721.balanceOf(hardhatNftERC721.address);
          console.log(`Mintando!`);
          await hardhatNftERC721.connect(leader1).safeMint(hardhatNftERC721.address, JSON.parse(tokenUri), {value: amount});
          var counterTokenId = (await hardhatNftERC721.tokenIdCounter())-1;
          console.log(`Minted to the contract! -> tokenId=`+counterTokenId);

          var balanceAfter = await hardhatNftERC721.balanceOf(hardhatNftERC721.address);
          console.log(
            `=> Balance of contract ${hardhatNftERC721.address} is ${balanceBefore} on ${network.name} 
              => Balance of contract ${hardhatNftERC721.address} is ${balanceAfter} on ${network.name}`
          )
                   
          await expect(balanceBefore).to.not.equals(balanceAfter);                  
        });

        it("Should mint a NFT to the contract and add the activity (struct) into available activities and activities mapping", async function () {
          const { hardhatNftERC721, owner, leader1, member } = await loadFixture(deployNftERC721WithGrantsFixture);
          const tokenUri = "{\"name\":\"Atividade 4\",\"description\":\"Descrição da atividade 4\",\"image\":\"https://gateway.pinata.cloud/ipfs/QmW78MP2JunDmEEnVuVcAzqamm2vZj8rfEq3FFXU6qo1qB\",\"external_url\":\"https://github.com/durdsvianna/\",\"background_color\":\"\",\"animation_url\":\"\",\"youtube_url\":\"\",\"attributes\":[{\"trait_type\":\"Status\",\"value\":\"2\"},{\"trait_type\":\"Dificulty\",\"value\":\"2\"},{\"trait_type\":\"Expire Date\",\"value\":\"2023-04-30T03:00:00.000Z\"},{\"trait_type\":\"Rewards\",\"value\":\"230\"}]}";          
          let amount = ether(1);
          //mint nfts
          var balanceBefore = await hardhatNftERC721.balanceOf(hardhatNftERC721.address);
          console.log(`Mintando!`);
          await hardhatNftERC721.connect(leader1).safeMint(hardhatNftERC721.address, JSON.parse(tokenUri), {value: amount});
          var counterTokenId = (await hardhatNftERC721.tokenIdCounter())-1;
          console.log(`Minted to the contract! -> tokenId=`+counterTokenId);

          var balanceAfter = await hardhatNftERC721.balanceOf(hardhatNftERC721.address);
          console.log(
            `=> Balance of contract ${hardhatNftERC721.address} is ${balanceBefore} on ${network.name} 
              => Balance of contract ${hardhatNftERC721.address} is ${balanceAfter} on ${network.name}`
          )

          var isAvilable = await hardhatNftERC721.isAvailableActivity(counterTokenId);
          var activity = await hardhatNftERC721.getActivity(counterTokenId);
          //await expect(addressOfOwner).to.equals(hardhatNftERC721.address); 
          console.log(
            `=> Activity Token ID in mappinng: ${activity.tokenId}`
          )
          await expect(isAvilable).to.equals(true); 
          await expect(activity.tokenId).to.equals(counterTokenId);                  
        });

        it("Should mint a NFT to the contract and transfer NFTs between accounts", async function () {
          const { hardhatNftERC721, owner, leader1, member } = await loadFixture(deployNftERC721WithGrantsFixture);
          const tokenUri = "{\"name\":\"Atividade 4\",\"description\":\"Descrição da atividade 4\",\"image\":\"https://gateway.pinata.cloud/ipfs/QmW78MP2JunDmEEnVuVcAzqamm2vZj8rfEq3FFXU6qo1qB\",\"external_url\":\"https://github.com/durdsvianna/\",\"background_color\":\"\",\"animation_url\":\"\",\"youtube_url\":\"\",\"attributes\":[{\"trait_type\":\"Status\",\"value\":\"2\"},{\"trait_type\":\"Dificulty\",\"value\":\"2\"},{\"trait_type\":\"Expire Date\",\"value\":\"2023-04-30T03:00:00.000Z\"},{\"trait_type\":\"Rewards\",\"value\":\"230\"}]}";          
          let amount = ether(1);
          //mint nfts
          console.log(`Minting!`);
          await hardhatNftERC721.connect(leader1).safeMint(hardhatNftERC721.address, JSON.parse(tokenUri), {value: amount});
          var counterTokenId = (await hardhatNftERC721.tokenIdCounter())-1;
          console.log(`Minted to the contract! -> tokenId=`+counterTokenId);

          var balanceContract = await hardhatNftERC721.balanceOf(hardhatNftERC721.address);
          var balanceMember = await hardhatNftERC721.balanceOf(member.address);
          console.log(
            `=> Balance of contract ${hardhatNftERC721.address} is ${balanceContract} on ${network.name} 
              => Balance of member  ${member.address} is ${balanceMember} on ${network.name}`
          )
          
          // Aprove member
          console.log(`Approve of owner of token..`);
          await hardhatNftERC721.setApprovalForAll(hardhatNftERC721.address, counterTokenId);
          console.log(`Approved!`);  

          // Transfer 1 NFT from owner to addr1
          console.log(`Transfer the NFT..`);
          await hardhatNftERC721.transferFrom(hardhatNftERC721.address, member.address, counterTokenId);
          console.log(`Transferred!`);  
          
          var balanceMember = await hardhatNftERC721.balanceOf(member.address);
          var balanceContract = await hardhatNftERC721.balanceOf(hardhatNftERC721.address);
          console.log(
            `=> Balance of contract ${hardhatNftERC721.address} is ${balanceContract} on ${network.name} 
              => Balance of member  ${member.address} is ${balanceMember} on ${network.name}`
          )
          await expect(await hardhatNftERC721.balanceOf(member.address))
            .to.equals(1);   
          await expect(await hardhatNftERC721.balanceOf(hardhatNftERC721.address))
            .to.equals(0);                    
        });
      });  
      
      describe("Transactions (with role grants, mints e structs)", function () {
        it ("Should set activity to the member,delete it of available activities mapping and update the activity status to 'In Progress'", async function (){
          const { hardhatNftERC721, owner, leader, member, counterTokenId } = await loadFixture(deployNftERC721WithGrantsAndMintFixture);
          console.log(
            `=> MEMBER: ${member.address}`
          )
          await hardhatNftERC721.setActivityOwner(counterTokenId, member.address);
          console.log(
            `=> Activity Token ID in mappinng: ${counterTokenId}`
          )
          var activity = await hardhatNftERC721.getActivity(counterTokenId);
          var isAvailable = await hardhatNftERC721.isAvailableActivity(counterTokenId);
          var activityOwner = await hardhatNftERC721.activityOwnerOf(counterTokenId);
          console.log(
            `=> Activity Token ID in mappinng: ${activity.tokenId}`
          )
          await expect(isAvailable).to.equals(false); 
          await expect(activity.status).to.equals("In Progress");  
          await expect(activityOwner).to.equals(member.address);  
        });

        it("Should mint nft by leader to contract and send amount of rewards of activity minted to the contract", async function () {
          const { hardhatNftERC721, leader1, leader2, member } = await loadFixture(deployNftERC721WithGrantsFixture);

          let amount = ether(2);

          const tokenUri = "{\"name\":\"Atividade 4\",\"description\":\"Descrição da atividade 4\",\"image\":\"https://gateway.pinata.cloud/ipfs/QmW78MP2JunDmEEnVuVcAzqamm2vZj8rfEq3FFXU6qo1qB\",\"external_url\":\"https://github.com/durdsvianna/\",\"background_color\":\"\",\"animation_url\":\"\",\"youtube_url\":\"\",\"attributes\":[{\"trait_type\":\"Status\",\"value\":\"2\"},{\"trait_type\":\"Dificulty\",\"value\":\"2\"},{\"trait_type\":\"Expire Date\",\"value\":\"2023-04-30T03:00:00.000Z\"},{\"trait_type\":\"Rewards\",\"value\":\"230\"}]}"
          //mint nfts
          var balanceContractBefore = await hardhatNftERC721.balanceOf(hardhatNftERC721.address);
          console.log(
            `=> Before, balance of NFTs on contract ${hardhatNftERC721.address} is ${balanceContractBefore} on ${network.name}`
          )
          console.log(`Minting!`);
          await hardhatNftERC721.connect(leader1).safeMint(hardhatNftERC721.address, JSON.parse(tokenUri), {value: amount});
          var counterTokenId = (await hardhatNftERC721.tokenIdCounter())-1;
          console.log(`Minted to the contract! -> tokenId=`+counterTokenId);
  
          var balanceContractAfter = await hardhatNftERC721.balanceOf(hardhatNftERC721.address);
          console.log(
            `=> After, balance of NFTs on contract ${hardhatNftERC721.address} is ${balanceContractAfter} on ${network.name}`
          )
          
          let initLeader1ETHBalance = await ethers.provider.getBalance(hardhatNftERC721.address);
          console.log(
            `=> Before, balance of ETH on contract ${hardhatNftERC721.address} is ${initLeader1ETHBalance} on ${network.name}`
          )
          await leader1.sendTransaction({value: amount, to: hardhatNftERC721.address});
    
          let finalLeader1ETHBalance = await ethers.provider.getBalance(hardhatNftERC721.address);
          console.log(
            `=> After, balance of ETH on contract ${hardhatNftERC721.address} is ${finalLeader1ETHBalance} on ${network.name}`
          )
          expect(finalLeader1ETHBalance.sub(initLeader1ETHBalance)).to.be.equal(amount);
      });
      });
      
      



      describe("NftERC721 contract & Multi Sig Vault Rewards", function () {
        let subjectMethod = async (contract, signer, nonce, amount, tokenId, to, signatures) => {
          let txn = {tokenId, amount, to};
          await contract.connect(signer).approveActivity(contract.address, txn, nonce, signatures, {gasPrice: 8});
        }
        
        let getNextNonce = async (contract) => (await contract.nonce()).add(1);
        
        let getDigest = async (nonce, amount, to) => {
          let txn = {tokenId, amount, to};
          let encoded = ethers.utils.defaultAbiCoder.encode(["tuple(uint256,address)"],  [[txn.tokenId, txn.amount, txn.to]]);
          let encodedWithNonce = ethers.utils.solidityPack(["bytes", "uint256"], [encoded, nonce]);
      
          let digest= ethers.utils.keccak256(encodedWithNonce);
          return digest;
        }
        
        async function deployNftERC721withMintPayed() {
          const NftERC721 = await ethers.getContractFactory("NftERC721");
          const [owner, leader1, leader2, member] = await ethers.getSigners();
          // To deploy our contract, we just have to call Token.deploy() and await
          // for it to be deployed(), which happens onces its transaction has been
          // mined.        
          const hardhatNftERC721 = await NftERC721.deploy("Collection Test", "TST");
          await hardhatNftERC721.deployed();

          const LEADER_WALLET = leader1.address;
          const LEADER_ROLE = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("LEADER_ROLE"));
          const LEADER2_WALLET = leader2.address;
          const MEMBER_WALLET = member.address;
          const MEMBER_ROLE = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("MEMBER_ROLE"));            
          await hardhatNftERC721.grantRole(MEMBER_ROLE, MEMBER_WALLET);
          await hardhatNftERC721.grantRole(LEADER_ROLE, LEADER_WALLET);
          await hardhatNftERC721.grantRole(LEADER_ROLE, LEADER2_WALLET);
          let amount = ether(2);

          const tokenUri = "{\"name\":\"Atividade 4\",\"description\":\"Descrição da atividade 4\",\"image\":\"https://gateway.pinata.cloud/ipfs/QmW78MP2JunDmEEnVuVcAzqamm2vZj8rfEq3FFXU6qo1qB\",\"external_url\":\"https://github.com/durdsvianna/\",\"background_color\":\"\",\"animation_url\":\"\",\"youtube_url\":\"\",\"attributes\":[{\"trait_type\":\"Status\",\"value\":\"2\"},{\"trait_type\":\"Dificulty\",\"value\":\"2\"},{\"trait_type\":\"Expire Date\",\"value\":\"2023-04-30T03:00:00.000Z\"},{\"trait_type\":\"Rewards\",\"value\":\"230\"}]}"
          //mint nfts
          await hardhatNftERC721.connect(leader1).safeMint(hardhatNftERC721.address, JSON.parse(tokenUri), {value: amount});
          var counterTokenId = (await hardhatNftERC721.tokenIdCounter())-1;
          await leader1.sendTransaction({value: amount, to: hardhatNftERC721.address});
          // Fixtures can return anything you consider useful for your tests
          return { NftERC721, hardhatNftERC721, owner, leader1, leader2, member, counterTokenId}; 
        }
      
        it("Should be start MultiSign, validate signatures, transfer NFT to member, send reward to Member and set activity status 'Finished'. ", async function () {
            const { hardhatNftERC721, leader1, leader2, member, counterTokenId } = await loadFixture(deployNftERC721withMintPayed);

            let amount = ether(2);
            let nonce = await getNextNonce(hardhatNftERC721);
            let digest = await getDigest(nonce, amount, member.address);
      
            let signers = [ leader1, leader2];
            signers.sort((x, y) => x.address > y.address? 1: -1);
            let signatures = [];
            for (let signer of signers) {
                let sign = await signer.signMessage (ethers.utils.arrayify(digest)) ;
                signatures.push(sign);
            }
                  
            // Transfer 1 NFT from contract to member
            console.log(`Transfer the bounty and NFT..`);
            let initMemberETHBalance = await ethers.provider.getBalance(member.address);
            var initMemberNftBalance = await hardhatNftERC721.balanceOf(member.address);                        
            await subjectMethod(hardhatNftERC721, member, nonce, amount, counterTokenId, member.address, signatures);
            let finalMemberETHBalance = await ethers.provider.getBalance(member.address);
            console.log(`Transferred!`);              
            var finalMemberNftBalance = await hardhatNftERC721.balanceOf(member.address);
            console.log(
              `=> Balance on init of member ${member.address} is ${initMemberNftBalance} on ${network.name} 
                => Balance on final of member   ${member.address} is ${finalMemberNftBalance} on ${network.name}`
            )
            
            expect(finalMemberNftBalance.sub(initMemberNftBalance)).to.be.eq(1);
            expect(finalMemberETHBalance.sub(initMemberETHBalance)).to.be.eq(amount);
        });

        // it("Normal expected operation of contract", async function () {
        //   let amount = ether(1);
        //   await funder.sendTransaction({value: amount, to: subjectContract.address});
        //   let nonce = await getNextNonce();
        //   let digest = await getDigest(nonce, amount, bob.address);
    
        //   let signers = [ bob, alice, carol];
        //   signers.sort((x, y) => x.address > y.address? 1: -1);
        //   let signatures = [];
        //   for (let signer of signers) {
        //       let sign = await signer.signMessage (ethers.utils.arrayify(digest)) ;
        //       signatures.push(sign);
        //   }
    
        //   let initBobETHBalance = await ethers.provider.getBalance(bob.address);
        //   await subjectMethod(bob, nonce, amount, bob.address, signatures);
        //   let finalBobETHBalance = await ethers.provider.getBalance(bob.address);
    
        //   expect(finalBobETHBalance.sub(initBobETHBalance)).to.be.eq(amount);
        // });
    
      // describe("Alternative Flows - Not Success", async function(){
      //   it("Normal expected operation of contract", async function () {
      //       let amount = ether(1);
      //       await funder.sendTransaction({value: amount, to: subjectContract.address});
      //       let nonce = await getNextNonce();
      //       let digest = await getDigest(nonce, amount, bob.address);
    
      //       let signers = [ bob, bob, bob];
      //       let signatures = [];
      //       for (let signer of signers) {
      //           let sign = await signer.signMessage (ethers.utils.arrayify(digest)) ;
      //           signatures.push(sign);
      //       }
    
      //       await expect(subjectMethod(bob, nonce, amount, bob.address, signatures)).to.be.revertedWith("possible duplicate");
      //   });
    
      //   it("revert - not enough singers", async function () {
      //       let amount = ether(1);
      //       await funder.sendTransaction({value: amount, to: subjectContract.address});
      //       let nonce = await getNextNonce();
      //       let digest = await getDigest(nonce, amount, bob.address);
    
      //       let signers = [ bob, alice];
      //       signers.sort((x, y) => x.address > y.address? 1: -1);
      //       let signatures = [];
      //       for (let signer of signers) {
      //           let sign = await signer.signMessage (ethers.utils.arrayify(digest)) ;
      //           signatures.push(sign);
      //       }
    
      //       await expect(subjectMethod(bob, nonce, amount, bob.address, signatures)).to.be.revertedWith("not enough signers");
      //   });
    
      //   it("revert - signer is not registered", async function () {
      //       let amount = ether(1);
      //       await funder.sendTransaction({value: amount, to: subjectContract.address});
      //       let nonce = await getNextNonce();
      //       let digest = await getDigest(nonce, amount, bob.address);
    
      //       let signers = [ bob, funder, alice];   // funder is not part of consortium
      //       signers.sort((x, y) => x.address > y.address? 1: -1);
      //       let signatures = [];
      //       for (let signer of signers) {
      //           let sign = await signer.signMessage (ethers.utils.arrayify(digest)) ;
      //           signatures.push(sign);
      //       }
    
      //       await expect(subjectMethod(bob, nonce, amount, bob.address, signatures)).to.be.revertedWith("not part of consortium");
      //   });
    
      //   it("revert - unordered signers", async function () {
      //       let amount = ether(1);
      //       await funder.sendTransaction({value: amount, to: subjectContract.address});
      //       let nonce = await getNextNonce();
      //       let digest = await getDigest(nonce, amount, bob.address);
    
      //       let signers = [ bob, carol, alice];   
      //       signers.sort((x, y) => x.address > y.address? 1: -1);
      //       // swap last 2 to ensure unordered list
      //       let tmp = signers[2];   signers[2] = signers[1];
      //       signers[1] = tmp;
    
    
      //       let signatures = [];
      //       for (let signer of signers) {
      //           let sign = await signer.signMessage (ethers.utils.arrayify(digest)) ;
      //           signatures.push(sign);
      //       }
    
      //       await expect(subjectMethod(bob, nonce, amount, bob.address, signatures)).to.be.revertedWith("possible duplicate");
      //   });
    
      //   it("revert - not enough balance ", async function () {
      //       let amount = ether(1);
      //       await funder.sendTransaction({value: amount.sub(1), to: subjectContract.address});
      //       let nonce = await getNextNonce();
      //       let digest = await getDigest(nonce, amount, bob.address);
    
      //       let signers = [ bob, carol, alice ];   
      //       signers.sort((x, y) => x.address > y.address? 1: -1);
    
      //       let signatures = [];
      //       for (let signer of signers) {
      //           let sign = await signer.signMessage (ethers.utils.arrayify(digest)) ;
      //           signatures.push(sign);
      //       }
    
      //       await expect(subjectMethod(bob, nonce, amount,  bob.address, signatures)).to.be.revertedWith("Transfer not fulfilled");
      //   });
    
      //   it("revert - nonce not incremented ", async function () {
      //       let amount = ether(1);
      //       await funder.sendTransaction({value: amount.mul(2), to: subjectContract.address});
      //       let nonce = await getNextNonce();
      //       let digest = await getDigest(nonce, amount, bob.address);
    
      //       let signers = [ bob, carol, alice ];   
      //       signers.sort((x, y) => x.address > y.address? 1: -1);
    
      //       let signatures = [];
      //       for (let signer of signers) {
      //           let sign = await signer.signMessage (ethers.utils.arrayify(digest)) ;
      //           signatures.push(sign);
      //       }
      //       await subjectMethod(bob, nonce, amount,  bob.address, signatures);
    
    
      //       digest = await getDigest(nonce, amount, bob.address);
      //       signatures = [];
      //       for (let signer of signers) {
      //           let sign = await signer.signMessage (ethers.utils.arrayify(digest)) ;
      //           signatures.push(sign);
      //       }
      //       await expect(subjectMethod(bob, nonce, amount,  bob.address, signatures)).to.be.revertedWith("nonce already used");
    
      //   });
      // });
      // TODO verify nonReentrant
    });

    }); 