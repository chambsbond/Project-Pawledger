import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("PetModule", (m) => {
  const orgRegistry = m.contract("OrgRegistry");
  const pet = m.contract("Pet", [orgRegistry]);

  return { pet };
});
