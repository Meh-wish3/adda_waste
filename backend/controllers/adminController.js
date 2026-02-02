const PickupRequest = require('../models/PickupRequest');
const Incentive = require('../models/Incentive');

// Get dashboard overview stats
async function getOverview(req, res, next) {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Total pickups today
        const totalToday = await PickupRequest.countDocuments({
            createdAt: { $gte: today },
        });

        // Completed pickups
        const completed = await PickupRequest.countDocuments({
            status: 'completed',
        });

        // Pending pickups
        const pending = await PickupRequest.countDocuments({
            status: 'pending',
        });

        // Total points distributed
        const incentives = await Incentive.find();
        const totalPoints = incentives.reduce((sum, inc) => sum + inc.points, 0);

        res.json({
            totalPickupsToday: totalToday,
            completedPickups: completed,
            pendingPickups: pending,
            totalPointsDistributed: totalPoints,
        });
    } catch (err) {
        next(err);
    }
}

// Get waste type breakdown
async function getWasteStats(req, res, next) {
    try {
        const wasteStats = await PickupRequest.aggregate([
            {
                $group: {
                    _id: '$wasteType',
                    count: { $sum: 1 },
                },
            },
        ]);

        const formatted = wasteStats.map((stat) => ({
            wasteType: stat._id,
            count: stat.count,
        }));

        res.json(formatted);
    } catch (err) {
        next(err);
    }
}

// Get collector performance
async function getCollectorPerformance(req, res, next) {
    try {
        // For now, we'll show pickups by verification status
        // In a full implementation, this would group by collector
        const verified = await PickupRequest.countDocuments({
            segregationVerified: true,
        });

        const notVerified = await PickupRequest.countDocuments({
            segregationVerified: false,
        });

        const completedPickups = await PickupRequest.countDocuments({
            status: 'completed',
        });

        res.json({
            totalCompleted: completedPickups,
            verified,
            notVerified,
            verificationRate: completedPickups > 0
                ? ((verified / completedPickups) * 100).toFixed(1)
                : 0,
        });
    } catch (err) {
        next(err);
    }
}

module.exports = {
    getOverview,
    getWasteStats,
    getCollectorPerformance,
};
