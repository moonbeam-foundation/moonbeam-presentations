var NominationDAO = artifacts.require("NominationDAO");

module.exports = function (deployer) {
  deployer.deploy(
    NominationDAO,
    "0xf24FF3a9CF04c71Dbc94D0b566f7A27B94566cac",
    "0x798d4Ba9baf0064Ec19eB4F0a1a45785ae9D6DFc"
  ); //Alith collator, Charleth admin
};
