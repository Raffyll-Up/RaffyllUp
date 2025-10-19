const { ethers, run } = require("hardhat");

async function main() {
  // Deploy RaffylFactory
  const RaffylFactory = await ethers.getContractFactory("RaffylFactory");
  const raffylFactory = await RaffylFactory.deploy();
  await raffylFactory.waitForDeployment();
  const raffylFactoryAddress = await raffylFactory.getAddress();
  console.log(`RaffylFactory deployed to: ${raffylFactoryAddress}`);

  // Verify RaffylFactory
  await run("verify:verify", {
    address: raffylFactoryAddress,
    constructorArguments: [],
  });
  console.log("RaffylFactory verified.");

  // Deploy Community
  // The admin for Community will be the deployer of this script (msg.sender)
  // The factory for Community will be the deployed RaffylFactory
  const [deployer] = await ethers.getSigners();
  const Community = await ethers.getContractFactory("Community");
  const community = await Community.deploy(deployer.address, raffylFactoryAddress);
  await community.waitForDeployment();
  const communityAddress = await community.getAddress();
  console.log(`Community deployed to: ${communityAddress}`);

  // Verify Community
  await run("verify:verify", {
    address: communityAddress,
    constructorArguments: [deployer.address, raffylFactoryAddress],
  });
  console.log("Community verified.");

  // At this point, TimelockVault is deployed by the Community contract.
  // We can get its address from the Community contract if needed.
  const timelockVaultAddress = await community.vault();
  console.log(`TimelockVault deployed by Community to: ${timelockVaultAddress}`);

  // Verify TimelockVault
  // TimelockVault constructor arguments are (_community, _factory)
  await run("verify:verify", {
    address: timelockVaultAddress,
    constructorArguments: [communityAddress, raffylFactoryAddress],
  });
  console.log("TimelockVault verified.");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
