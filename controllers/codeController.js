const CodeFactory = require('../factories/codeFactory');
const CheckCodeStrategy = require('../strategies/checkCodeStrategy');
const Code = require('../models/code');
const User = require('../models/user');
const Order = require("../models/orders");

exports.getAllCode = async (req, res) => {
    try {
        const code = await Code.find({});
        res.json({
            status: 'success',
            code
        });
    } catch (err) {
        res.json({
            status: 'failed',
            errors: err
        });
    }
};

exports.createCode = async (req, res) => {
    try {
        const { userID } = req.user;
        const admin = await User.findById(userID);
        if (admin.role === 'admin') {
            const codeExisted = await Code.countDocuments({ code: req.body.code });
            if (codeExisted > 0) {
                return res.status(400).json({status: "failed", messenger: "Mã giảm giá đã tồn tại"});
            }
            const code = await CodeFactory.createCode(req.body);
            res.json({
                status: 'success',
                code
            });
        } else {
            res.json({
                messenger: "Không đủ quyền"
            });
        }
    } catch (err) {
        res.json({
            status: 'failed',
            errors: err
        });
    }
};

exports.deleteOneCode = async (req, res) => {
    try {
        const { userID } = req.user;
        const admin = await User.findById(userID);
        if (admin.role === 'admin') {
            const count = await Order.countDocuments({ saleCode: req.params.id });

            if (count > 0) {
                return res.status(400).json({
                    messenger: "Voucher đã được đặt nên không xóa được"
                });
            }
            await Code.findByIdAndDelete(req.params.id);
            res.json({
                status: "success"
            });
        } else {
            res.json({
                messenger: "Không đủ quyền"
            });
        }
    } catch (err) {
        res.json({
            status: 'failed',
            errors: err
        });
    }
};

exports.getOneCode = async (req, res) => {
    try {
        const { id } = req.params; // Lấy giá trị 'id' từ tham số của yêu cầu HTTP
        const code = await Code.findById(id);
        res.json({
            status: "success",
            code
        });
    } catch (err) {
        res.json({
            status: "failed",
            errors: err
        });
    }
};

exports.editOneCode = async (req, res) => {
    try {
        const { id } = req.params;
        const { code } = req.body;

        // Kiểm tra xem mã giảm giá mới có trùng với mã giảm giá đã tồn tại hay không
        const existingCode = await Code.findOne({ code: code, _id: { $ne: id } });
        if (existingCode) {
            return res.status(400).json({
                status: 'failed',
                message: 'Mã giảm giá đã tồn tại'
            });
        }

        // Cập nhật mã giảm giá
        await Code.findByIdAndUpdate(id, { ...req.body }, { runValidators: true, new: true });
        res.json({
            status: "success"
        });
    } catch (err) {
        res.json({
            status: 'failed',
            errors: err
        });
    }
};

exports.checkCode = async (req, res) => {
    try {
        const { code } = req.body;
        const coupon = await CheckCodeStrategy.checkCode(code);
        res.json({
            status: "success",
            coupon
        });
    } catch (err) {
        res.json({
            status: 'failed',
            errors: err.message
        });
    }
};