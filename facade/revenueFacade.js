// RevenueFacade.js (Facade)
const RevenueService = require('./revenueService');

class RevenueFacade {
  // Lấy tổng doanh thu
  async getTotalRevenue() {
    return await RevenueService.getTotalRevenue();
  }

  // Lấy thống kê số lượng người dùng, sản phẩm, đơn hàng
  async getCountDashboard() {
    return await RevenueService.getCountDashboard();
  }
}

module.exports = new RevenueFacade();
