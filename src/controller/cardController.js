const CardProduct = require("../modals/cards");

module.exports.createProduct = async (req,res) => {
    const { title, description, category, basePrice, currency, material, features, variants } = req.body;

    if (!title || !category || !basePrice || !variants?.length) {
      return {
        error: true,
        msg: "Missing required fields: title, category, basePrice, or variants",
        code: 400,
      };
    }

    const newProduct = new CardProduct({
      title,
      description,
      category,
      basePrice,
      currency,
      material,
      features,
      variants,
    });

    const savedProduct = await newProduct.save();

    return {
      data: savedProduct,
      msg: "Product created successfully",
      code: 201,
      status: "SUCCESS",
    };
};


module.exports.updateProduct = async (req, res) => {

    const { id,updatedData } = req.body;


    const updatedProduct = await CardProduct.findByIdAndUpdate(id, updatedData, {
      new: true, 
      runValidators: true,
    });

    if (!updatedProduct) {
      return {
        msg: "Product not found",
        code: 404,
      };
    }

    return {
      data: updatedProduct,
      msg: "Product updated successfully",
      code: 200,
      status: "SUCCESS",
    };
};


module.exports.getProducts = async (req, res) => {
    const { id } = req.body || {};

    let products;

    if (id) {
      products = await CardProduct.findById(id);
      if (!products) {
        return {
          msg: "Product not found",
          code: 404,
        };
      }
    } else {
      products = await CardProduct.find().sort({ createdAt: -1 });
    }

    return {
      data: products,
      msg: id ? "Product fetched successfully" : "Products fetched successfully",
      code: 200,
      status: "SUCCESS",
    };
};

module.exports.deleteProduct = async (req, res) => {
  const { id } = req.body;

  if (!id) {
    return {
      msg: "Product id is required",
      code: 400,
      error: true,
    };
  }

  const deletedProduct = await CardProduct.findByIdAndDelete(id);

  if (!deletedProduct) {
    return {
      msg: "Product not found",
      code: 404,
    };
  }

  return {
    data: deletedProduct,
    msg: "Product deleted successfully",
    code: 200,
    status: "SUCCESS",
  };
};