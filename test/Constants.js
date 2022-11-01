const COMMON =
  "VM Exception while processing transaction: reverted with reason string ";
const constants = {
  NON_OWNER_ERROR: COMMON + "'Only contract owner has access.'",
  INVALID_RETURN_PRODUCT:
    COMMON + "'You didn't buy this product or it was already returned'",
  UNSUFICIENT_QUANTITY: COMMON + "'Not enough product quantity.'",
  PRODUCT_ALREADY_EXIST: COMMON + "'Product already exist.'",
  PRODUCT_DOESNT_EXIST: COMMON + "'Product doesn't exist.'",
  INVALID_PAYMENT_VALUE:
    COMMON + "'Payment not enough, please check the price.'",
};

module.exports = constants;
