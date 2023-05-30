const { expect } = require("chai");
const { ethers } = require("hardhat");
const { parseEther } = ethers.utils;

describe("Web3DevMarketplace", function () {
  let Web3DevMarketplace, web3DevMarketplace;
  let leader, member1, member2, nonMember;
  const activityTitle = "New Activity";
  const activityDescription = "Description for the new activity";
  const activityReward = parseEther("1");
  const activityTokenURI = "ipfs://Qm...";

  beforeEach(async function () {
    Web3DevMarketplace = await ethers.getContractFactory("Web3DevMarketplace");
    web3DevMarketplace = await Web3DevMarketplace.deploy();

    [leader, member1, member2, nonMember] = await ethers.getSigners();
    await web3DevMarketplace.grantRole(web3DevMarketplace.LEADER_ROLE(), leader.address);
    await web3DevMarketplace.grantRole(web3DevMarketplace.MEMBER_ROLE(), member1.address);
    await web3DevMarketplace.grantRole(web3DevMarketplace.MEMBER_ROLE(), member2.address);
  });

  it("should create a new activity", async function () {
    await web3DevMarketplace.connect(leader).createActivity(activityTitle, activityDescription, activityReward, 1, activityTokenURI, { value: activityReward });
    const activity = await web3DevMarketplace.activities(1);
    expect(activity.title).to.equal("New Activity");
    expect(activity.description).to.equal("Description for the new activity");
    expect(activity.reward).to.equal(parseEther("1"));
    expect(activity.status).to.equal(0);
  });

  it("should fail to create a new activity for non-leaders", async function () {
    await expect(web3DevMarketplace.connect(member1).createActivity(activityTitle, activityDescription, activityReward, 1, activityTokenURI, { value: activityReward })).to.be.revertedWith("Caller is not a leader");
  });

  it("should assign an activity to a member", async function () {
    await web3DevMarketplace.connect(leader).createActivity(activityTitle, activityDescription, activityReward, 1, activityTokenURI, { value: activityReward });
    await web3DevMarketplace.connect(member1).assignActivity(1);
    const activity = await web3DevMarketplace.activities(1);
    expect(activity.assignedTo).to.equal(member1.address);
    expect(activity.status).to.equal(1);
  });

  it("should fail to assign an activity for non-members", async function () {
    await web3DevMarketplace.connect(leader).createActivity(activityTitle, activityDescription, activityReward, 1, activityTokenURI, { value: activityReward });
    await expect(web3DevMarketplace.connect(nonMember).assignActivity(0)).to.be.revertedWith("Caller is not a member");
  });

  it("should complete an activity", async function () {
    await web3DevMarketplace.connect(leader).createActivity(activityTitle, activityDescription, activityReward, 1, activityTokenURI, { value: activityReward });
    await web3DevMarketplace.connect(member1).assignActivity(0);
    await web3DevMarketplace.connect(member1).completeActivity(0);
    const activity = await web3DevMarketplace.activities(0);
    expect(activity.status).to.equal(2);
  });

  it("should fail to complete an activity for non-members", async function () {
    await web3DevMarketplace.connect(leader).createActivity(activityTitle, activityDescription, activityReward, 1, activityTokenURI, { value: activityReward });
    await web3DevMarketplace.connect(member1).assignActivity(0);
    await expect(web3DevMarketplace.connect(nonMember).completeActivity(0)).to.be.revertedWith("Caller is not a member");
  });

  it("should fail to complete an activity not in progress", async function () {
    await web3DevMarketplace.connect(leader).createActivity(activityTitle, activityDescription, activityReward, 1, activityTokenURI, { value: activityReward });
    await expect(web3DevMarketplace.connect(member1).completeActivity(0)).to.be.revertedWith("Activity not in progress");
  });

  it("should fail to complete an activity not claimed by the caller", async function () {
    await web3DevMarketplace.connect(leader).createActivity(activityTitle, activityDescription, activityReward, 1, activityTokenURI, { value: activityReward });
    await web3DevMarketplace.connect(member1).assignActivity(0);
    await expect(web3DevMarketplace.connect(member2).completeActivity(0)).to.be.revertedWith("Caller did not claim this activity");
  });

  it("should approve an activity", async function () {
    await web3DevMarketplace.connect(leader).createActivity(activityTitle, activityDescription, activityReward, 1, activityTokenURI, { value: activityReward });
    await web3DevMarketplace.connect(member1).assignActivity(1);
    await web3DevMarketplace.connect(member1).completeActivity(1);
    await web3DevMarketplace.connect(leader).approveActivity(1);
    const activity = await web3DevMarketplace.activities(1);
    expect(activity.status).to.equal(3);
  });

  it("should fail to approve an activity for non-leaders", async function () {
    await web3DevMarketplace.connect(leader).createActivity(activityTitle, activityDescription, activityReward, 1, activityTokenURI, { value: activityReward });
    await web3DevMarketplace.connect(member1).assignActivity(0);
    await web3DevMarketplace.connect(member1).completeActivity(0);
    await expect(web3DevMarketplace.connect(nonMember).approveActivity(0)).to.be.revertedWith("Caller is not a leader");
  });

  it("should reject an activity", async function () {
    await web3DevMarketplace.connect(leader).createActivity(activityTitle, activityDescription, activityReward, 1, activityTokenURI, { value: activityReward });
    await web3DevMarketplace.connect(member1).assignActivity(0);
    await web3DevMarketplace.connect(member1).completeActivity(0);
    await web3DevMarketplace.connect(leader).rejectActivity(0);
    const activity = await web3DevMarketplace.activities(0);
    expect(activity.status).to.equal(4);
  });

  it("should fail to reject an activity for non-leaders", async function () {
    await web3DevMarketplace.connect(leader).createActivity(activityTitle, activityDescription, activityReward, 1, activityTokenURI, { value: activityReward });
    await web3DevMarketplace.connect(member1).assignActivity(0);
    await web3DevMarketplace.connect(member1).completeActivity(0);
    await expect(web3DevMarketplace.connect(nonMember).rejectActivity(0)).to.be.revertedWith("Caller is not a leader");
  });

  it("should delete an activity", async function () {
    await web3DevMarketplace.connect(leader).createActivity(activityTitle, activityDescription, activityReward, 1, activityTokenURI, { value: activityReward });
    await web3DevMarketplace.connect(leader).deleteActivity(1);
    const activity = await web3DevMarketplace.activities(1);
    expect(activity.status).to.equal(5);
  });

  it("should fail to delete an activity for non-leaders", async function () {
    await web3DevMarketplace.connect(leader).createActivity(activityTitle, activityDescription, activityReward, 1, activityTokenURI, { value: activityReward });
    await expect(web3DevMarketplace.connect(nonMember).deleteActivity(0)).to.be.revertedWith("Caller is not a leader");
  });
});