const OrderHandler = require('./orderHandler');
const Orders = require('../models/orders');

class CreateOrderHandler extends OrderHandler {
    async handle(request) {
        const newOrder = await Orders.create(request.body);
        return newOrder;
    }
}

module.exports = CreateOrderHandler;