const moment = require('moment');
const querystring = require('qs');
const crypto = require("crypto");

class PaymentProcessor {
    constructor(req) {
        this.req = req;
        this.vnp_Params = {};
        this.secretKey = "CTEWJNFLYXGAINUFNKOMJQESGDOLSXXF";
        this.vnpUrl = "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html";
    }

    processPayment() {
        this.setEnvironment();
        this.setParams();
        this.signParams();
        return this.buildUrl();
    }

    setEnvironment() {
        process.env.TZ = 'Asia/Ho_Chi_Minh';
    }

    setParams() {
        let date = new Date();
        let createDate = moment(date).format('YYYYMMDDHHmmss');
        let ipAddr = this.req.headers['x-forwarded-for'] ||
            this.req.connection.remoteAddress ||
            this.req.socket.remoteAddress ||
            this.req.connection.socket.remoteAddress;

        let tmnCode = "MSR07BZ1";
        let returnUrl = "http://localhost:3006/Checkout";
        let orderId = moment(date).format('DDHHmmss');
        let amount = this.req.body.total;
        let bankCode = '';
        let locale = this.req.body.language || 'vn';
        if (locale === null || locale === '') {
            locale = 'vn';
        }
        let currCode = 'VND';
        const data = this.req.body;
        delete data.productDetail;

        this.vnp_Params['vnp_Version'] = '2.1.0';
        this.vnp_Params['vnp_Command'] = 'pay';
        this.vnp_Params['vnp_TmnCode'] = tmnCode;
        this.vnp_Params['vnp_Locale'] = locale;
        this.vnp_Params['vnp_CurrCode'] = currCode;
        this.vnp_Params['vnp_TxnRef'] = orderId;
        this.vnp_Params['vnp_OrderInfo'] = JSON.stringify(data);
        this.vnp_Params['vnp_OrderType'] = "other";
        this.vnp_Params['vnp_Amount'] = amount * 100;
        this.vnp_Params['vnp_ReturnUrl'] = returnUrl;
        this.vnp_Params['vnp_IpAddr'] = ipAddr;
        this.vnp_Params['vnp_CreateDate'] = createDate;
        if (bankCode !== null && bankCode !== '') {
            this.vnp_Params['vnp_BankCode'] = bankCode;
        }
    }

    signParams() {
        this.vnp_Params = this.sortObject(this.vnp_Params);
        let signData = querystring.stringify(this.vnp_Params, { encode: false });
        let hmac = crypto.createHmac("sha512", this.secretKey);
        let signed = hmac.update(Buffer.from(signData, 'utf-8')).digest("hex");
        this.vnp_Params['vnp_SecureHash'] = signed;
    }

    buildUrl() {
        return this.vnpUrl + '?' + querystring.stringify(this.vnp_Params, { encode: false });
    }

    sortObject(obj) {
        let sorted = {};
        let str = [];
        let key;
        for (key in obj) {
            if (obj.hasOwnProperty(key)) {
                str.push(encodeURIComponent(key));
            }
        }
        str.sort();
        for (key = 0; key < str.length; key++) {
            sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
        }
        return sorted;
    }
}

module.exports = PaymentProcessor;