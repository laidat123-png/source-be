// RevenueService.js (Subsystem)
const Revenue = require('../models/revenue');
const User = require('../models/user');
const Product = require('../models/product');
const Order = require('../models/orders');

class RevenueService {
  // Lấy tổng doanh thu
  async getTotalRevenue() {
    try {
      const allRevenues = await Revenue.find({});
      const totalRevenue = allRevenues.reduce((total, record) => total + record.totalAmount, 0);
      return { totalRevenue, totalRecords: allRevenues.length, orders: allRevenues };
    } catch (err) {
      throw new Error('Error fetching total revenue: ' + err.message);
    }
  }

  // Đếm số lượng người dùng, sản phẩm và đơn hàng
  async getCountDashboard() {
    try {
      const countUser = await User.countDocuments({});
      const countProduct = await Product.countDocuments({});
      const countOrder = await Order.countDocuments({});
      return { countUser, countProduct, countOrder };
    } catch (err) {
      throw new Error('Error fetching dashboard counts: ' + err.message);
    }
  }
}

module.exports = new RevenueService();
