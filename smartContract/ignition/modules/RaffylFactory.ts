import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const RaffylFactoryModule = buildModule("RaffylFactoryModule", (m) => {
  const raffylFactory = m.contract("RaffylFactory");

  return { raffylFactory };
});

export default RaffylFactoryModule;
