const PaymentProcessor = require('./paymentProcessor');

class VnpayPaymentProcessor extends PaymentProcessor {
    constructor(req) {
        super(req);
    }
}

module.exports = VnpayPaymentProcessor;