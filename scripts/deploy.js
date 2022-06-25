const hre = require("hardhat");

async function main() {
  const DeadManSwitch = await hre.ethers.getContractFactory("DeadManSwitch");
  const deadManSwitch = await DeadManSwitch.deploy(
    "0x350ba81398f44Bf06cd176004a275c451F0A1d91"
  );

  await deadManSwitch.deployed();

  console.log("deadManSwitch deployed to:", deadManSwitch.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
