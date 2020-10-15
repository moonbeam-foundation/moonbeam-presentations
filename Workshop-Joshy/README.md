Building an Ethereum-Compatible Substrate Chain
===============================================
We'll start from the node template, and assume you've followed the first two tutorials at substrate.dev/tutorials.

## Add EVM pallet to runtime

Here we add the EVM pallet to the runtime. For reference, you can see this work in commit [0e6238b](https://github.com/JoshOrndorff/substrate-node-template/commit/0e6238bee8b61c7d87cbc5ecbde7ed93f80b60a4).

### Snippets

`runtime/Cargo.toml`
```toml
pallet-evm = { default-features = false, version = '2.0.0' }
```

`runtime/Cargo.toml`
```toml
'pallet-evm/std',
```

`runtime/src/lib.rs`
```rust
use pallet_evm::{
	EnsureAddressTruncated, HashedAddressMapping,
};
```

`runtime/src/lib.rs`
```rust
parameter_types! {
	pub const LeetChainId: u64 = 1337;
}

impl pallet_evm::Trait for Runtime {
	type FeeCalculator = ();
	type CallOrigin = EnsureAddressTruncated;
	type WithdrawOrigin = EnsureAddressTruncated;
	type AddressMapping = HashedAddressMapping<BlakeTwo256>;
	type Currency = Balances;
	type Event = Event;
	type Precompiles = ();
	type ChainId = LeetChainId;
}
```

`runtime/src/lib.rs`
```rust
EVM: pallet_evm::{Module, Call, Storage, Config, Event<T>}
```

### Helpful Resources

* https://substrate.dev/rustdocs/v2.0.0/pallet_evm/struct.EnsureAddressTruncated.html
* https://substrate.dev/rustdocs/v2.0.0/pallet_evm/struct.HashedAddressMapping.html

### Check Your Work

At this point your runtime should compile. Check with `cargo check -p node-template-runtime`.

The entire node, however, should not compile because the genesis config has not been updated. Confirm that the build fails by running `cargo check`.

## Pallet EVM in the Genesis Config
Here we update the genesis config that is hard-coded into the node so that it works with the updated runtime. For reference, you can see this work in commit [b5aa541](https://github.com/JoshOrndorff/substrate-node-template/commit/b5aa5417bb2ea9855338bee487f20bcd49eacf05).

### Snippets

`node/src/chain_spec.rs`
```rust
use node_template_runtime::{
	AccountId, AuraConfig, BalancesConfig, GenesisConfig, GrandpaConfig,
	SudoConfig, SystemConfig, WASM_BINARY, Signature, EVMConfig,
};
use std::collections::BTreeMap;
```

`node/src/chain_spec.rs`
```rust
pallet_evm: Some(EVMConfig {
	accounts: BTreeMap::new(),
}),
```

### Helpful Resources
* https://substrate.dev/rustdocs/v2.0.0/pallet_evm/struct.GenesisAccount.html
* Example of actually initializing accounts https://github.com/PureStake/moonbeam/blob/1308eed69a1083fd69fa3324ac4e0a93701d94f6/node/standalone/src/chain_spec.rs#L154-L164

### Check Your Work

At this point the entire node should build. Confirm that by running `cargo check`.

## Add Ethereum Pallet to Runtime

Now we will add pallet Ethereum which is responsible for storing Ethereum-formatted blocks, transaction receipts, and transaction statuses.

The biggest challenge here is that the Frontier project does not use the same, published, Substrate crates; it takes Substrate code from github. For this workshop, I've made a special branch of Frontier that uses the published dependencies.

For reference, you can see this work in commit [bbaa3f9](https://github.com/JoshOrndorff/substrate-node-template/commit/bbaa3f90080257451504aed1fed66ea3d446e3d1).

### Snippets

`runtime/Cargo.toml`
```toml
pallet-ethereum = { default-features = false, git = 'https://github.com/PureStake/frontier.git', branch = 'substrate-v2' }
```

`runtime/Cargo.toml`
```toml
'pallet-evm/std',
```

`runtime/src/lib.rs`
```rust
impl pallet_ethereum::Trait for Runtime {
	type Event = Event;
	// This means we will never record a block author in the Ethereum-formatted blocks
	type FindAuthor = ();
}
```

`runtime/src/lib.rs`
```rust
Ethereum: pallet_ethereum::{Module, Call, Storage, Event, Config, ValidateUnsigned},
```

### Helpful Resources

* Our frontier branch that uses published Substrate version https://github.com/PureStake/frontier/tree/substrate-v2

### Check Your Work

At this point your runtime should compile. Check with `cargo check -p node-template-runtime`.

As before, the entire node should not compile because the genesis config has not been updated. Confirm that the build fails by running `cargo check`.

## Pallet Ethereum in the Genesis Config
Again we update the genesis config to work with the updated runtime. For reference, you can see this work in commit [217ac4d](https://github.com/JoshOrndorff/substrate-node-template/commit/217ac4d7a63575631c65e6a2b8936b88fc4bcbca).

### Snippets

`node/src/chain_spec.rs`
```rust
use node_template_runtime::{
	AccountId, AuraConfig, BalancesConfig, GenesisConfig, GrandpaConfig,
	SudoConfig, SystemConfig, WASM_BINARY, Signature, EVMConfig, EthereumConfig,
};
```

`node/src/chain_spec.rs`
```rust
pallet_ethereum: Some(EthereumConfig {}),
```

### Helpful Resources
* https://github.com/paritytech/frontier/blob/51bd10ff209f1f19cd33715d2d75e6768eca5352/frame/ethereum/src/lib.rs#L75-L79 Definition of empty genesis config. You may wonder why we have a genesis config at all if it doesn't contain any data. Although we don't need to pass any data into the pallet, we do need the pallet to calculate the ethereum-style genesis block just like it will for every other block in the chain.

### Check Your Work

At this point the entire node should build. Confirm that by running `cargo check`.

## Wrapping Ethereum Transactions

When a user submits a raw Ethereum transaction, we need to convert it into a Substrate transaction. The conversion is simple. we just wrap the raw transaction in a call the pallet_ethereum's `transact` extrinsic. This is done in the runtime.

For reference, you can see this work in commit [b2e9b2c](https://github.com/JoshOrndorff/substrate-node-template/commit/b2e9b2ccd0e6aff267ca4eeebb0ddb373476dd79).

### Snippets

`runtime/Cargo.toml`
```toml
frontier-rpc-primitives = { default-features = false, git = 'https://github.com/PureStake/frontier.git', branch = 'substrate-v2' }
```

`runtime/Cargo.toml`
```toml
'frontier-rpc-primitives/std',
```

`runtime/src/lib.rs`
```rust
use codec::{Encode, Decode};
```


`runtime/src/lib.rs`
```rust
/// A unit struct that can can convert ethereum-formatted transactions into Substrate-formatted transactions
/// The ConvertTransaction trait is implemented twice. Once for Uncheckd Extrinsic and once for Opaque Unchecked Extrinsic
/// Essentially we wrap the raw ethereum transaction in a call to the transact extrinsic in pallet ethereum.
pub struct TransactionConverter;

impl frontier_rpc_primitives::ConvertTransaction<UncheckedExtrinsic> for TransactionConverter {
	fn convert_transaction(&self, transaction: pallet_ethereum::Transaction) -> UncheckedExtrinsic {
		UncheckedExtrinsic::new_unsigned(pallet_ethereum::Call::<Runtime>::transact(transaction).into())
	}
}

impl frontier_rpc_primitives::ConvertTransaction<opaque::UncheckedExtrinsic> for TransactionConverter {
	fn convert_transaction(&self, transaction: pallet_ethereum::Transaction) -> opaque::UncheckedExtrinsic {
		let extrinsic = UncheckedExtrinsic::new_unsigned(pallet_ethereum::Call::<Runtime>::transact(transaction).into());
		let encoded = extrinsic.encode();
		opaque::UncheckedExtrinsic::decode(&mut &encoded[..]).expect("Encoded extrinsic is always valid")
	}
}
```

### Helpful Resources

### Check Your Work

At this point the entire node should build with `cargo check`.
