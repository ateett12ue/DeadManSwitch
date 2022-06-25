const { expect, assert } = require("chai");
const { ethers } = require("hardhat");

describe("DeadManSwitch", async function () {
  let DeadManSwitch;
  let deadManSwitch;
  let owner;
  let alice;
  let blockDeployed;
  let tx;
  beforeEach(async () => {
    [owner, alice] = await ethers.getSigners();
    DeadManSwitch = await ethers.getContractFactory("DeadManSwitch", owner);
    deadManSwitch = await DeadManSwitch.deploy(
      "0x350ba81398f44Bf06cd176004a275c451F0A1d91"
    );
    blockDeployed = await ethers.provider.getBlockNumber();
    await deadManSwitch.deployed();
  });

  it("should deploy correctly", async () => {
    assert.isOk(deadManSwitch, "Deployment failed");
    expect(await deadManSwitch.presetAddress()).to.equal(alice.address);
    expect(await deadManSwitch.latestBlockWhenCalled()).to.equal(blockDeployed);
  });

  it("should allow only owner to call still_alive", async () => {
    await deadManSwitch.still_alive();
    const blockWhenCalled = await ethers.provider.getBlockNumber();
    expect(await deadManSwitch.latestBlockWhenCalled()).to.equal(
      blockWhenCalled
    );
    await expect(deadManSwitch.connect(alice).still_alive()).to.be.reverted;
  });

  it("should not transfer funds when 10 idle blocks have not yet passed", async () => {
    await deadManSwitch.still_alive();
    const blockWhenCalled = await ethers.provider.getBlockNumber();
    tx = {
      to: deadManSwitch.address,
      value: ethers.utils.parseEther("1", "ether"),
    };
    await owner.sendTransaction(tx);
    const currentBlock = await ethers.provider.getBlockNumber();
    assert.isTrue(currentBlock - blockWhenCalled < 10);
    await expect(deadManSwitch.transferFunds()).to.be.reverted;
  });
});
