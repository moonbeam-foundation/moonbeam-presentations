Building an Ethereum-Compatible Substrate Chain
===============================================
We'll start from the node template, and assume you've followed the first two tutorials at substrate.dev/tutorials.

Add EVM pallet to runtime
---------------------

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

Update the Genesis Config
-------------------------
Here we update the genesis config that is hard-coded into the node so that it works with the updated runtime.

### Snippets

### Check Your Work

At this point the entire node should build. Confirm that by running `cargo check`.
