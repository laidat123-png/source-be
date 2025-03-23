const VnpayPaymentProcessor = require('../processors/vnpayPaymentProcessor');

exports.banking = (req, res, next) => {
    try {
        const paymentProcessor = new VnpayPaymentProcessor(req);
        const paymentUrl = paymentProcessor.processPayment();
        res.json(paymentUrl);
    } catch (err) {
        console.log("Err", err);
        res.status(500).json({
            status: 'error',
            messenger: 'Đã xảy ra lỗi'
        });
    }
}