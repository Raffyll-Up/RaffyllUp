import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const CommunityModule = buildModule("CommunityModule", (m) => {
  const admin = m.getAccount(0);
  const factory = m.getAccount(1);

  const community = m.contract("Community", [admin, factory]);

  return { community };
});

export default CommunityModule;
