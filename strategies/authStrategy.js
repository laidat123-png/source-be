const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user');

class AuthStrategy {
    static async authenticate(email, password) {
        const user = await User.findOne({ email }).populate("cart.product");
        if (!user) {
            throw new Error('Email không hợp lệ');
        }
        if (user.status === 'không hoạt động' || user.status === 'bị khóa') {
            throw new Error('Tài khoản của bạn đã bị khóa. Vui lòng liên hệ hỗ trợ để được mở khóa.');
        }
        if (!bcrypt.compareSync(password, user.password)) {
            throw new Error('Sai email hoặc mật khẩu');
        }
        const token = jwt.sign({ userID: user.id }, process.env.APP_SECERT);
        return { user, token };
    }
}

module.exports = AuthStrategy;