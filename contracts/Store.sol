// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;
import "hardhat/console.sol";

contract Store {
    string public storeName;
    address payable owner;
    uint public productCount;
    address payable private wallet;

    struct Product {
        string name;
        uint quantity;
        uint price;
    }

    mapping(string => uint) public productNames;
    mapping(uint => mapping(address => uint)) public timeOfPurchase;
    mapping(uint => address[]) public buyersAddressesPerProduct;
    Product[] public products;

    constructor() {
        storeName = "TechnoLimeStore";
        owner = payable(msg.sender);
        wallet = payable(owner);
    }

    function addProduct(
        string calldata _name,
        uint _quantity,
        uint _price
    ) public onlyOwner {
        require(productNames[_name] == 0, "Product already exist.");
        products.push(
            Product({name: _name, quantity: _quantity, price: _price})
        );
        productCount++;
        productNames[_name] = productCount;
    }

    function updateProduct(string calldata _name, uint _addQuantity)
        public
        onlyOwner
    {
        require(productNames[_name] != 0, "Product doesn't exist.");
        products[productNames[_name] - 1].quantity += _addQuantity;
    }

    function buyProduct(uint _id) public payable {
        Product storage product = products[_id];
        require(
            msg.value >= product.price,
            "Payment not enough, please check the price."
        );
        require(product.quantity > 0, "Not enough product quantity.");
        require(
            timeOfPurchase[_id][msg.sender] == 0,
            "You already bought this product."
        );
        timeOfPurchase[_id][msg.sender] = block.timestamp;
        wallet.transfer(msg.value - product.price);
        buyersAddressesPerProduct[_id].push(msg.sender);
        product.quantity -= 1;
    }

    function returnProduct(uint _id) public payable {
        string memory productName = products[_id].name;
        uint top = timeOfPurchase[_id][msg.sender];
        require(
            top != 0,
            "You didn't buy this product or it was already returned"
        );
        require(
            top + 24 hours > block.timestamp,
            "24 hours passed, you cannot return the product."
        );
        wallet.transfer(products[_id].price);
        delete timeOfPurchase[_id][msg.sender];
        products[productNames[productName] - 1].quantity += 1;
    }

    function getProductById(uint _id) public view returns (Product memory) {
        return products[_id];
    }

    function getProducts() public view returns (Product[] memory) {
        return products;
    }

    function getBuyerAddressesPerProduct(uint _id)
        public
        view
        returns (address[] memory)
    {
        return buyersAddressesPerProduct[_id];
    }

    function transfer(address payable _to, uint _amount) private onlyOwner {
        _to.transfer(_amount);
    }

    function getOwner() public view returns (address) {
        return owner;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only contract owner has access.");
        _;
    }
}
