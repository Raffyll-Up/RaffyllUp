import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const TimelockVaultModule = buildModule("TimelockVaultModule", (m) => {
  const community = m.getAccount(0);
  const factory = m.getAccount(1);

  const timelockVault = m.contract("TimelockVault", [community, factory]);

  return { timelockVault };
});

export default TimelockVaultModule;
