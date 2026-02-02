const Household = require('../models/Household');
const PickupRequest = require('../models/PickupRequest');

// Static area traversal order to keep routing explainable.
// This is a simple heuristic: collector starts near the ward office
// and moves area-by-area in a fixed loop.
const AREA_ORDER = [
  'Bhetapara - Lane 1',
  'Bhetapara - Lane 2',
  'Bhetapara - Lane 3',
  'Bhangagarh - Block A',
  'Bhangagarh - Block B',
  'GS Road - Point 1',
  'GS Road - Point 2',
  'GS Road - Point 3',
  'Beltola - Market Side',
  'Beltola - Residential Cluster',
];

function getAreaRank(area) {
  const idx = AREA_ORDER.indexOf(area);
  if (idx === -1) return AREA_ORDER.length + 1;
  return idx;
}

async function generateShiftRoute() {
  // 1. Fetch all pending pickup requests for the current shift (simplified: all pending).
  const pendingPickups = await PickupRequest.find({ status: 'pending' }).lean();
  if (!pendingPickups.length) return [];

  // 2. Get all involved households to know their areas.
  const householdIds = [...new Set(pendingPickups.map((p) => p.householdId))];
  const households = await Household.find({
    householdId: { $in: householdIds },
  }).lean();

  const householdById = households.reduce((acc, h) => {
    acc[h.householdId] = h;
    return acc;
  }, {});

  // 3. Enrich pickup requests with area info.
  // Prefer location from pickup request (citizen's geolocation), fallback to household location
  const enriched = pendingPickups.map((p) => {
    const h = householdById[p.householdId];
    return {
      ...p,
      area: h ? h.area : 'Unknown',
      location: p.location && p.location.lat && p.location.lng 
        ? p.location  // Use citizen's geolocation if available
        : (h && h.location ? h.location : null), // Fallback to household area location
    };
  });

  // 4. Sort by (area rank, pickupTime asc) – greedy, explainable heuristic.
  enriched.sort((a, b) => {
    const areaDiff = getAreaRank(a.area) - getAreaRank(b.area);
    if (areaDiff !== 0) return areaDiff;
    return new Date(a.pickupTime) - new Date(b.pickupTime);
  });

  // 5. Prepare ordered route steps with simple explanation.
  const route = enriched.map((p, index) => ({
    sequence: index + 1,
    pickupId: p._id,
    householdId: p.householdId,
    area: p.area,
    wasteType: p.wasteType,
    pickupTime: p.pickupTime,
    overflow: p.overflow,
    location: p.location,
    explanation: `Visit ${p.area} (household ${p.householdId}) as stop #${
      index + 1
    } to reduce back-and-forth between areas.`,
  }));

  return route;
}

module.exports = {
  generateShiftRoute,
  AREA_ORDER,
};

