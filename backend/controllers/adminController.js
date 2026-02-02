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

const User = require('../models/User');

// Get collector performance
async function getCollectorPerformance(req, res, next) {
    try {
        const stats = await PickupRequest.aggregate([
            { $match: { status: 'completed', completedBy: { $exists: true } } },
            {
                $group: {
                    _id: '$completedBy',
                    completedCount: { $sum: 1 },
                    verifiedCount: {
                        $sum: { $cond: [{ $eq: ['$segregationVerified', true] }, 1, 0] }
                    }
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'collector'
                }
            },
            { $unwind: '$collector' },
            {
                $project: {
                    name: '$collector.name',
                    completed: '$completedCount',
                    verified: '$verifiedCount',
                    rate: {
                        $multiply: [
                            { $divide: ['$verifiedCount', '$completedCount'] },
                            100
                        ]
                    }
                }
            }
        ]);

        const totalVerified = await PickupRequest.countDocuments({ segregationVerified: true, status: 'completed' });
        const totalCompleted = await PickupRequest.countDocuments({ status: 'completed' });

        res.json({
            totalCompleted,
            verified: totalVerified,
            notVerified: totalCompleted - totalVerified,
            verificationRate: totalCompleted > 0
                ? ((totalVerified / totalCompleted) * 100).toFixed(1)
                : 0,
            collectorBreakdown: stats
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
