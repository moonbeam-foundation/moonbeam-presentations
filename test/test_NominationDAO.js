const { ApiPromise, WsProvider } = require("@polkadot/api");
const { typesBundle } = require("moonbeam-types-bundle");
const Web3 = require("web3");

// Example test script - Uses Mocha and Ganache
// @ts-ignore
const NominationDAO = artifacts.require("NominationDAO");

const ALITH = "0xf24FF3a9CF04c71Dbc94D0b566f7A27B94566cac";
const ALITH_PRIV_KEY = "0x5fb92d6e98884f76de468fa3f6278f8807c48bebc13595d45af5bdc4da702133";
const BALTATHAR = "0x3Cd0A705a2DC65e5b1E1205896BaA2be8A07c6e0";
const BALTATHAR_PRIV_KEY = "0x8075991ce870b93a8870eca0c0f91913d12f47948ca0fd25b49c6fa7cdbeee8b";
const CHARLETH = "0x798d4Ba9baf0064Ec19eB4F0a1a45785ae9D6DFc";
const CHARLETH_PRIV_KEY = "0x0b6e18cafb6ed99687ec547bd28139cafdd2bffe70e6b688025de6b445aa5c5b";
const DOROTHY = "0x773539d4Ac0e786233D90A233654ccEE26a613D9";
const DOROTHY_PRIV_KEY = "0x39539ab1876910bbf3a223d84a29e28f1cb4e2e456503e7e91ed39b2e7223d68";

// Change PORTS
const WS_PORT = "9944";
const HTTP_PORT = "9933";

const MIN_NOMINATOR_STAKE = 5000000000000000000;

// Alith admin
const ADMIN = CHARLETH;
// Baltathar member
const MEMBER = BALTATHAR;
// Charleth target
const COLLATOR = ALITH;

contract("NominationDAO", (accounts) => {
  let nominationDAO;
  let api;
  beforeEach(async () => {
    // Deploy token contract
    nominationDAO = await NominationDAO.new(COLLATOR, ADMIN, { from: accounts[0] });
    api = await ApiPromise.create({
      initWasm: false,
      provider: new WsProvider(`ws://localhost:${WS_PORT}`),
      typesBundle: typesBundle,
    });
  });
  // Check MinNominatorStk
  it("checks MinNominatorStk, target and admin", async () => {
    const minNominatorStk = await nominationDAO.MinNominatorStk.call();
    assert.equal(Number(minNominatorStk), MIN_NOMINATOR_STAKE, "minNominatorStk is wrong");

    const target = await nominationDAO.target.call();
    assert.equal(target, COLLATOR, "target is wrong");

    const DEFAULT_ADMIN_ROLE = await nominationDAO.DEFAULT_ADMIN_ROLE.call();
    assert.equal(
      await nominationDAO.hasRole.call(DEFAULT_ADMIN_ROLE, ADMIN),
      true,
      "admin is wrong"
    );
    assert.equal(ADMIN === accounts[0], true, "admin is wrong");

    const MEMBER = await nominationDAO.MEMBER.call();
    assert.equal(await nominationDAO.hasRole.call(MEMBER, ADMIN), true, "MEMBER is wrong");
  });

  // Check no nomination and no update possible funds avaiable
  it("Check no nomination and no update possible funds avaiable", async () => {
    const nominators = await api.query.parachainStaking.nominatorState(COLLATOR);
    expect(nominators.toHuman() === null).to.equal(true, "there should be no nominator");
    try {
      await nominationDAO.update_nomination(COLLATOR, { from: accounts[0] });
    } catch (e) {
      assert.equal(true, true, "tx didn't throw error");
    }

    const nominatorsAfter = await api.query.parachainStaking.nominatorState(COLLATOR);
    expect(nominatorsAfter.toHuman() === null).to.equal(
      true,
      "nomination shouldn't have gone through"
    );
  });

  // Add stake to the DAO ad nominate a COLLATOR
  it("should have succesfully nominated COLLATOR", async function () {

    // Add stake for account 0 (MEMBER)
    await nominationDAO.add_stake({ from: accounts[0], value: 3 * MIN_NOMINATOR_STAKE });

    // Check Stake
    const adminStake = await nominationDAO.memberStakes.call(accounts[0]);
    assert.equal(Number(adminStake), 3 * MIN_NOMINATOR_STAKE, "adminStake is wrong");

    // call update_nomination to nominate the current target
    await nominationDAO.update_nomination(COLLATOR, { from: accounts[0] });

    // Check that the DAO is a nominator
    const nominators = (await api.query.parachainStaking.collatorState2(COLLATOR)).toHuman();
    expect(nominators.nominators.includes(nominationDAO.address)).to.equal(
      true,
      "nomination didnt go through"
    );
  });
});
