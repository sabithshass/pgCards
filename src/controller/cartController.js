const Cart = require("../modals/cartSchema");
const CardProduct = require("../modals/cards");

module.exports.addToCart = async (req) => {
    const { userId, productId, quantity = 1 } = req.body;

    if (!userId || !productId) {
      return {
        error: true,
        msg: "Missing userId or productId",
        code: 400,
        status: false
      };
    }

    const product = await CardProduct.findById(productId);
    if (!product) {
      return {
        error: true,
        msg: "Product not found",
        code: 404,
        status: false
      };
    }

    const price = product.basePrice;

    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = new Cart({
        userId,
        items: [{ productId, quantity, price }]
      });
      await cart.save();

      return {
        msg: "Product added to new cart",
        data: cart,
        code: 200,
        status: true
      };
    }

    const existingItem = cart.items.find(
      i => i.productId.toString() === productId
    );

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({ productId, quantity, price });
    }

    await cart.save();

    return {
      msg: "Cart updated",
      data: cart,
      code: 200,
      status: true
    };

};


module.exports.updateQuantity = async (req) => {
  const { userId, productId, quantity } = req.body;

  if (!userId || !productId) {
    return { error: true, msg: "Missing userId or productId", code: 400 };
  }

  const cart = await Cart.findOne({ userId });
  if (!cart) {
    return { error: true, msg: "Cart not found", code: 404 };
  }

  const item = cart.items.find(
    (i) => i.productId.toString() === productId
  );

  if (!item) {
    return { error: true, msg: "Item not found", code: 404 };
  }

  const qtyChange = quantity || 1;

  item.quantity += qtyChange;


  if (item.quantity <= 0) {
    cart.items = cart.items.filter(
      (i) => i.productId.toString() !== productId
    );
  }

  await cart.save();

  return {
    msg: "Quantity updated",
    data: cart,
    code: 200
  };
};




module.exports.removeItem = async (req) => {
  const { userId, productId } = req.body;

  if (!userId || !productId) {
    return { error: true, msg: "userId & productId required", code: 400 };
  }

  const updatedCart = await Cart.findOneAndUpdate(
    { userId: new ObjectId(userId) },
    { $pull: { items: { productId: productId} } },
    { new: true }
  );

  if (!updatedCart) {
    return { error: true, msg: "Cart not found", code: 404 };
  }

  return {  msg: "Item deleted", data: updatedCart, code: 200 };
};


module.exports.getUserCart = async (req) => {
    const { userId } = req.body;

    const cart = await Cart.findOne({ userId }).populate("items.productId");

    return {
      error: false,
      msg: cart ? "Cart fetched" : "Cart empty",
      data: cart || { items: [] },
      code: 200
    };
};
