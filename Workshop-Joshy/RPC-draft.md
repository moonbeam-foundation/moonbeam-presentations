
## Install the RPC

Now that we are able to query the runtime for ethereum-style data, let's expose that capability to users over the RPC. There are actually several different apis, each of which can be added. For the sake of this tutorial, we'll just add the core `EthApi`.

For reference, you can see this work in commit []().

### Snippets



### Helpful Resources

* Recipe about Custom RPCs https://substrate.dev/recipes/custom-rpc.html
* Definition of the `EthAPI` RPC interface https://github.com/paritytech/frontier/blob/51bd10ff209f1f19cd33715d2d75e6768eca5352/rpc/core/src/eth.rs
* All RPC interfaces that come with Frontier https://github.com/paritytech/frontier/tree/51bd10ff209f1f19cd33715d2d75e6768eca5352/rpc/core/src

### Check Your Work

At this point the entire node should build with `cargo check`.
