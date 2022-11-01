# Sample Store Project

This project demonstrates a basic Hardhat use case. It comes with a contract, and tests for that contract.

Try running some of the following tasks:

```
npx hardhat compile - compiles the project
npx hardhat test - runs all tests
```
- Hardhat Documentation: https://hardhat.org/hardhat-runner/docs/guides/project-setup

Using Remix develop a contract for a Product Store.
- The administrator (owner) of the store should be able to add new products and the quantity of them.
- The administrator should not be able to add the same product twice, just quantity.
- Buyers (clients) should be able to see the available products and buy them by their id.
- Buyers should be able to return products if they are not satisfied (within a certain period).
- A client cannot buy the same product more than one time.
- The clients should not be able to buy a product more times than the quantity in the store unless a product is returned or added by the administrator (owner)
- Everyone should be able to see the addresses of all clients that have ever bought a given product.
