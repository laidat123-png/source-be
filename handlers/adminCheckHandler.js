const OrderHandler = require('./orderHandler');
const User = require('../models/user');

class AdminCheckHandler extends OrderHandler {
    async handle(request) {
        const { userID } = request.user;
        const admin = await User.findById(userID);
        if (admin.role !== 'admin') {
            throw new Error('Bạn không phải admin');
        }
        return await super.handle(request);
    }
}

module.exports = AdminCheckHandler;