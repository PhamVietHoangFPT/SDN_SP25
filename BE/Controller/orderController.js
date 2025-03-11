const Order = require("../Models/Order");

const getAllOrder = async (req, res) => {};

const addOrder = async (req, res) => {};

const deleteOrder = async (req, res) => {};

const getDashboardStats = async (req, res) => {
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfYear = new Date(now.getFullYear(), 0, 1);

    // Aggregation pipeline để tính toán thống kê
    const stats = await Order.aggregate([
      {
        $facet: {
          // Thống kê trong tháng
          monthStats: [
            { $match: { createdAt: { $gte: startOfMonth } } },
            {
              $group: {
                _id: null,
                totalOrdersMonth: { $sum: 1 },
                totalRevenueMonth: { $sum: "$total" },
                cancelledOrdersMonth: {
                  $sum: { $cond: [{ $eq: ["$status", "Cancelled"] }, 1, 0] },
                },
                completedOrdersMonth: {
                  $sum: { $cond: [{ $eq: ["$status", "Completed"] }, 1, 0] },
                },
              },
            },
          ],
          // Thống kê trong năm
          yearStats: [
            { $match: { createdAt: { $gte: startOfYear } } },
            {
              $group: {
                _id: null,
                totalOrdersYear: { $sum: 1 },
                totalRevenueYear: { $sum: "$total" },
                cancelledOrdersYear: {
                  $sum: { $cond: [{ $eq: ["$status", "Cancelled"] }, 1, 0] },
                },
                completedOrdersYear: {
                  $sum: { $cond: [{ $eq: ["$status", "Completed"] }, 1, 0] },
                },
              },
            },
          ],
          // Thống kê tổng quát (tất cả thời gian)
          overallStats: [
            {
              $group: {
                _id: null,
                totalRevenue: { $sum: "$total" },
              },
            },
          ],
        },
      },
      {
        $project: {
          monthStats: { $arrayElemAt: ["$monthStats", 0] },
          yearStats: { $arrayElemAt: ["$yearStats", 0] },
          overallStats: { $arrayElemAt: ["$overallStats", 0] },
        },
      },
    ]);

    // Xử lý kết quả
    const result = {
      month: {
        totalOrders: stats[0].monthStats?.totalOrdersMonth || 0,
        totalRevenue: stats[0].monthStats?.totalRevenueMonth || 0,
        cancelledOrders: stats[0].monthStats?.cancelledOrdersMonth || 0,
        completedOrders: stats[0].monthStats?.completedOrdersMonth || 0,
      },
      year: {
        totalOrders: stats[0].yearStats?.totalOrdersYear || 0,
        totalRevenue: stats[0].yearStats?.totalRevenueYear || 0,
        cancelledOrders: stats[0].yearStats?.cancelledOrdersYear || 0,
        completedOrders: stats[0].yearStats?.completedOrdersYear || 0,
      },
      overall: {
        totalRevenue: stats[0].overallStats?.totalRevenue || 0,
      },
    };

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({
      message: "Server error when retrieving dashboard stats",
      error: error.message,
    });
  }
};

module.exports = { getAllOrder, addOrder, deleteOrder, getDashboardStats };
