const { expect } = require("chai");
const { ethers } = require("hardhat");
const constants = require("./Constants.js");

describe("Store", function () {
  describe("Deployment", function () {
    let storeContract, owner, buyer;

    before(async function () {
      const Store = await ethers.getContractFactory("Store");
      [owner, buyer] = await ethers.getSigners();
      storeContract = await Store.deploy();
      await storeContract.deployed();
    });

    it("Check Owner", async function () {
      expect(await storeContract.getOwner()).to.equal(owner.address);
    });

    it("Add Product", async function () {
      await storeContract.addProduct("Test", 5, 1);

      const list = await storeContract.getProducts();

      expect(list.length).to.equal(1);
    });

    it("Duplicate product throws error", async function () {
      try {
        await storeContract.addProduct("Test", 5, 1);
      } catch (error) {
        expect(error.message).to.equal(constants.PRODUCT_ALREADY_EXIST);
      }
    });

    it("Update Product", async function () {
      await storeContract.updateProduct("Test", 5);

      const product = await storeContract.getProductById(0);

      expect(product.quantity).to.equal(10);
    });

    it("Update Invalid Product", async function () {
      try {
        await storeContract.updateProduct("Test333", 5);
      } catch (error) {
        expect(error.message).to.equal(constants.PRODUCT_DOESNT_EXIST);
      }
    });

    it("Update Product with NON owner account throws error", async function () {
      try {
        await storeContract.connect(buyer).updateProduct("Test", 5);
      } catch (error) {
        expect(error.message).to.equal(constants.NON_OWNER_ERROR);
      }
    });

    it("Buy Product", async function () {
      await storeContract.connect(buyer).buyProduct(0, { value: 1 });

      const product = await storeContract.getProductById(0);

      expect(product.quantity).to.equal(9);
    });

    it("Not enough product quantity throws error", async function () {
      await storeContract.addProduct("Test2", 0, 2);

      try {
        await storeContract.connect(buyer).buyProduct(1, { value: 2 });
      } catch (error) {
        expect(error.message).to.equal(constants.UNSUFICIENT_QUANTITY);
      }
    });

    it("Payment value invalid throws error", async function () {
      try {
        await storeContract.connect(buyer).buyProduct(0, { value: 0 });
      } catch (error) {
        expect(error.message).to.equal(constants.INVALID_PAYMENT_VALUE);
      }
    });

    it("Return Product", async function () {
      await storeContract.connect(buyer).returnProduct(0);

      const product = await storeContract.getProductById(0);

      expect(product.quantity).to.equal(10);
    });

    it("Product is invalid or already returned throws error", async function () {
      try {
        await storeContract.connect(buyer).returnProduct(0);
      } catch (error) {
        expect(error.message).to.equal(constants.INVALID_RETURN_PRODUCT);
      }
    });

    it("Get Product by Id", async function () {
      const product = await storeContract.getProductById(0);

      expect(product.name).to.equal("Test");
    });

    it("Get Products", async function () {
      await storeContract.addProduct("Test3", 2, 2);
      const product = await storeContract.getProducts();

      expect(product.length).to.equal(3);
    });

    it("Get Buyers from product", async function () {
      const buyers = await storeContract.getBuyerAddressesPerProduct(0);

      expect(buyers.length).to.equal(1);
    });
  });
});
