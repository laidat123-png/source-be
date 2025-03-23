const OrderHandler = require('./orderHandler');
const Product = require('../models/product');

class ProductStockHandler extends OrderHandler {
    async handle(request) {
        const { productDetail } = request.body;
        for (const item of productDetail) {
            const product = await Product.findById(item.productID);
            if (product.inStock < item.quantity) {
                throw new Error(`Sản phẩm ${product.title} không đủ số lượng`);
            }
            product.inStock -= item.quantity;
            await product.save();
        }
        return await super.handle(request);
    }
}

module.exports = ProductStockHandler;