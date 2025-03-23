const Code = require('../models/code');

class CodeFactory {
    static async createCode(data) {
        return await Code.create({
            code: data.code,
            discount: data.discount,
            type: data.type,
            expirationDate: new Date(data.expirationDate),
            quantity: data.quantity
        });
    }
}

module.exports = CodeFactory;