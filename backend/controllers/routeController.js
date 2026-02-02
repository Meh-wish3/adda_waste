const { generateShiftRoute, AREA_ORDER } = require('../services/routingService');

async function generateRoute(req, res, next) {
  try {
    const route = await generateShiftRoute();
    res.json({
      meta: {
        explanation:
          'Simple greedy routing: group by area and visit areas in a fixed loop to avoid zig-zagging across the ward. Within each area, earlier pickup times are served first.',
        areaOrder: AREA_ORDER,
      },
      route,
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  generateRoute,
};

