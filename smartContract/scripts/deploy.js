const { ethers, run } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log(`Deploying contracts with the account: ${deployer.address}`);

  // 1. Deploy RaffylFactory
  const RaffylFactory = await ethers.getContractFactory("RaffylFactory");
  const raffylFactory = await RaffylFactory.deploy();
  await raffylFactory.waitForDeployment();
  const raffylFactoryAddress = await raffylFactory.getAddress();
  console.log(`RaffylFactory deployed to: ${raffylFactoryAddress}`);

  // 2. Set Treasury on RaffylFactory
  console.log("Setting treasury to deployer address...");
  const tx = await raffylFactory.setTreasury(deployer.address);
  await tx.wait();
  console.log(`Treasury set to: ${deployer.address}`);

  // 3. Verify RaffylFactory (optional, may require waiting for block propagation)
  console.log("Waiting for 30 seconds before verification...");
  await new Promise(resolve => setTimeout(resolve, 30000));
  try {
    await run("verify:verify", {
      address: raffylFactoryAddress,
      constructorArguments: [],
    });
    console.log("RaffylFactory verified.");
  } catch (error) {
    console.error("RaffylFactory verification failed:", error.message);
  }

  // 4. Deploy Community via the Factory
  console.log("Deploying Community via RaffylFactory...");
  const communityName = "My Test Community";
  const createCommunityTx = await raffylFactory.createCommunity(communityName);
  const receipt = await createCommunityTx.wait();
  
  const event = receipt.logs.find(log => log.eventName === 'CommunityCreated');
  if (!event) {
    throw new Error("CommunityCreated event not found in transaction receipt");
  }
  const communityAddress = event.args.community;
  const communityAdmin = event.args.admin;
  console.log(`Community '${communityName}' deployed to: ${communityAddress}`);

  // 5. Verify Community
  console.log("Waiting for 30 seconds before verification...");
  await new Promise(resolve => setTimeout(resolve, 30000));
  try {
    await run("verify:verify", {
      address: communityAddress,
      constructorArguments: [communityAdmin, raffylFactoryAddress],
    });
    console.log("Community verified.");
  } catch (error) {
    console.error("Community verification failed:", error.message);
  }

  // 6. Get TimelockVault address and verify
  const community = await ethers.getContractAt("Community", communityAddress);
  const timelockVaultAddress = await community.vault();
  console.log(`TimelockVault for Community found at: ${timelockVaultAddress}`);

  // 7. Verify TimelockVault
  console.log("Waiting for 30 seconds before verification...");
  await new Promise(resolve => setTimeout(resolve, 30000));
  try {
    await run("verify:verify", {
      address: timelockVaultAddress,
      constructorArguments: [communityAddress, raffylFactoryAddress],
    });
    console.log("TimelockVault verified.");
  } catch (error) {
    console.error("TimelockVault verification failed:", error.message);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
