// revenueController.js (Client)
const RevenueFacade = require('../facade/revenueFacade');

exports.getTotalRevenue = async (req, res) => {
  try {
    const { totalRevenue, totalRecords, orders } = await RevenueFacade.getTotalRevenue();
    res.status(200).json({
      status: 'success',
      totalRevenue,
      totalRecords,
      orders,
    });
  } catch (err) {
    res.status(500).json({
      status: 'failed',
      message: err.message,
    });
  }
};

exports.getCountDashboard = async (req, res) => {
  try {
    const { countUser, countProduct, countOrder } = await RevenueFacade.getCountDashboard();
    res.status(200).json({
      countUser,
      countProduct,
      countOrder,
    });
  } catch (err) {
    res.status(500).json({
      status: 'failed',
      message: err.message,
    });
  }
};
