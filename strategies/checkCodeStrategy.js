const Code = require('../models/code');

class CheckCodeStrategy {
    static async checkCode(code) {
        const coupon = await Code.findOne({ code: code });
        if (!coupon) {
            throw new Error("Mã giảm giá không tồn tại");
        }
        const currentDate = new Date();
        if (coupon.expirationDate < currentDate) {
            throw new Error("Mã giảm giá đã hết hạn");
        }
        if (coupon.quantity <= 0) {
            throw new Error("Mã giảm giá đã hết số lượng");
        }
        coupon.quantity -= 1;
        await coupon.save();
        return coupon;
    }
}

module.exports = CheckCodeStrategy;