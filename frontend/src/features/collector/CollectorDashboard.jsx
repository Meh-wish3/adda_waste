import React, { useEffect, useState, useMemo } from 'react';
import {
  fetchShiftPickups,
  generateRoute,
  verifySegregation,
  completePickup,
} from './CollectorApi';
import StatusBadge from '../../components/StatusBadge';
import RouteView from './RouteView';

const CollectorDashboard = () => {
  const [pickups, setPickups] = useState([]);
  const [route, setRoute] = useState(null);
  const [loadingRoute, setLoadingRoute] = useState(false);
  const [completingId, setCompletingId] = useState(null);
  const [verifyingId, setVerifyingId] = useState(null);
  const [viewMode, setViewMode] = useState('grouped'); // 'grouped' or 'list'

  const refreshPickups = () => {
    fetchShiftPickups().then(setPickups);
  };

  useEffect(() => {
    refreshPickups();
  }, []);

  // Group pickups by area
  const groupedPickups = useMemo(() => {
    const groups = {};
    pickups.forEach((p) => {
      const area = p.area || 'Unknown';
      if (!groups[area]) {
        groups[area] = [];
      }
      groups[area].push(p);
    });
    return groups;
  }, [pickups]);

  const handleGenerateRoute = async () => {
    setLoadingRoute(true);
    try {
      const data = await generateRoute();
      setRoute(data);
    } finally {
      setLoadingRoute(false);
    }
  };

  const handleVerifySegregation = async (pickupId, verified) => {
    setVerifyingId(pickupId);
    try {
      await verifySegregation(pickupId, { verified });
      refreshPickups();
    } finally {
      setVerifyingId(null);
    }
  };

  const handleComplete = async (pickupId) => {
    if (!window.confirm('Mark this pickup as completed? Points will be awarded only if segregation was verified.')) {
      return;
    }
    setCompletingId(pickupId);
    try {
      await completePickup(pickupId);
      refreshPickups();
      if (route) {
        handleGenerateRoute();
      }
    } finally {
      setCompletingId(null);
    }
  };

  return (
    <div className="space-y-4">
      <section className="card">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between mb-4">
          <div>
            <h2 className="font-heading text-lg font-semibold text-primary">
              Ward worker shift view
            </h2>
            <p className="text-[11px] text-slate-500 max-w-md">
              All citizen pickup requests for the current shift in Ward 4. Grouped by area for efficient collection.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex rounded-lg border border-slate-200 p-1">
              <button
                type="button"
                onClick={() => setViewMode('grouped')}
                className={`px-3 py-1 text-xs font-medium rounded ${
                  viewMode === 'grouped'
                    ? 'bg-primary text-white'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                By Area
              </button>
              <button
                type="button"
                onClick={() => setViewMode('list')}
                className={`px-3 py-1 text-xs font-medium rounded ${
                  viewMode === 'list'
                    ? 'bg-primary text-white'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                List
              </button>
            </div>
            <button
              type="button"
              onClick={handleGenerateRoute}
              className="btn-secondary"
            >
              {loadingRoute ? 'Generating route…' : 'Generate Route'}
            </button>
          </div>
        </div>

        {viewMode === 'grouped' ? (
          // Grouped by Area View
          <div className="space-y-4">
            {Object.keys(groupedPickups).length === 0 ? (
              <p className="text-center text-xs text-slate-400 py-8">
                No pickup requests yet. Ask the judges to quickly schedule a few from the Citizen view.
              </p>
            ) : (
              Object.entries(groupedPickups).map(([area, areaPickups]) => (
                <div key={area} className="border border-slate-200 rounded-xl overflow-hidden">
                  <div className="bg-emerald-50 px-4 py-2 border-b border-slate-200">
                    <h3 className="font-semibold text-sm text-primary">{area}</h3>
                    <p className="text-xs text-slate-600">{areaPickups.length} pickup{areaPickups.length !== 1 ? 's' : ''}</p>
                  </div>
                  <div className="divide-y divide-slate-100">
                    {areaPickups.map((p) => (
                      <div key={p._id} className="px-4 py-3 hover:bg-slate-50 transition">
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-2 items-center">
                          <div className="md:col-span-2">
                            <p className="text-xs font-semibold text-slate-700">HH {p.householdId}</p>
                            <p className="text-[10px] text-slate-500 capitalize">{p.wasteType}</p>
                          </div>
                          <div className="md:col-span-3">
                            <p className="text-[10px] text-slate-500">Location</p>
                            {p.location?.lat && p.location?.lng ? (
                              <p className="text-xs text-slate-700">
                                {p.location.lat.toFixed(4)}, {p.location.lng.toFixed(4)}
                              </p>
                            ) : p.householdLocation?.lat && p.householdLocation?.lng ? (
                              <p className="text-xs text-slate-600">
                                {p.householdLocation.lat.toFixed(4)}, {p.householdLocation.lng.toFixed(4)}
                                <span className="text-[10px] text-slate-400 ml-1">(area)</span>
                              </p>
                            ) : (
                              <p className="text-xs text-slate-400">Not available</p>
                            )}
                          </div>
                          <div className="md:col-span-2">
                            <p className="text-[10px] text-slate-500">Time</p>
                            <p className="text-xs text-slate-700">
                              {new Date(p.pickupTime).toLocaleTimeString()}
                            </p>
                          </div>
                          <div className="md:col-span-2 flex items-center gap-2">
                            {p.overflow && (
                              <span className="rounded-full bg-red-50 px-2 py-0.5 text-[10px] font-medium text-red-700">
                                Overflow
                              </span>
                            )}
                            <StatusBadge status={p.status} />
                            {p.segregationVerified && (
                              <span className="rounded-full bg-green-50 px-2 py-0.5 text-[10px] font-medium text-green-700">
                                ✓ Verified
                              </span>
                            )}
                          </div>
                          <div className="md:col-span-3 flex items-center gap-2 justify-end">
                            {p.status !== 'completed' && (
                              <>
                                {!p.segregationVerified ? (
                                  <button
                                    type="button"
                                    disabled={verifyingId === p._id}
                                    onClick={() => handleVerifySegregation(p._id, true)}
                                    className="rounded-full bg-emerald-600 px-3 py-1.5 text-[11px] font-semibold text-white hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                  >
                                    {verifyingId === p._id ? 'Verifying…' : 'Verify Segregation'}
                                  </button>
                                ) : (
                                  <button
                                    type="button"
                                    disabled={verifyingId === p._id}
                                    onClick={() => handleVerifySegregation(p._id, false)}
                                    className="rounded-full bg-amber-600 px-3 py-1.5 text-[11px] font-semibold text-white hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                  >
                                    Unverify
                                  </button>
                                )}
                                <button
                                  type="button"
                                  disabled={completingId === p._id}
                                  onClick={() => handleComplete(p._id)}
                                  className="rounded-full bg-primary px-3 py-1.5 text-[11px] font-semibold text-white hover:bg-emerald-900 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                  {completingId === p._id ? 'Completing…' : 'Complete'}
                                </button>
                              </>
                            )}
                            {p.status === 'completed' && (
                              <span className="text-xs text-slate-400">Completed</span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        ) : (
          // List View (original table format)
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-xs">
              <thead className="border-b border-slate-100 text-[11px] uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="py-2 pr-3">HH ID</th>
                  <th className="py-2 pr-3">Area</th>
                  <th className="py-2 pr-3">Waste Type</th>
                  <th className="py-2 pr-3">Location</th>
                  <th className="py-2 pr-3">Pickup Time</th>
                  <th className="py-2 pr-3">Overflow</th>
                  <th className="py-2 pr-3">Status</th>
                  <th className="py-2 pr-3">Verified</th>
                  <th className="py-2 pr-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {pickups.map((p) => (
                  <tr key={p._id}>
                    <td className="py-2 pr-3 text-slate-700">{p.householdId}</td>
                    <td className="py-2 pr-3 text-slate-700">{p.area || '-'}</td>
                    <td className="py-2 pr-3 capitalize text-slate-700">{p.wasteType}</td>
                    <td className="py-2 pr-3 text-slate-600 text-[10px]">
                      {p.location?.lat && p.location?.lng
                        ? `${p.location.lat.toFixed(4)}, ${p.location.lng.toFixed(4)}`
                        : p.householdLocation?.lat && p.householdLocation?.lng
                        ? `${p.householdLocation.lat.toFixed(4)}, ${p.householdLocation.lng.toFixed(4)}`
                        : '-'}
                    </td>
                    <td className="py-2 pr-3 text-slate-600">
                      {new Date(p.pickupTime).toLocaleString()}
                    </td>
                    <td className="py-2 pr-3">
                      {p.overflow ? (
                        <span className="rounded-full bg-red-50 px-2 py-0.5 text-[11px] font-medium text-red-700">
                          Overflow
                        </span>
                      ) : (
                        <span className="text-[11px] text-slate-400">Normal</span>
                      )}
                    </td>
                    <td className="py-2 pr-3">
                      <StatusBadge status={p.status} />
                    </td>
                    <td className="py-2 pr-3">
                      {p.segregationVerified ? (
                        <span className="rounded-full bg-green-50 px-2 py-0.5 text-[10px] font-medium text-green-700">
                          ✓
                        </span>
                      ) : (
                        <span className="text-[10px] text-slate-400">-</span>
                      )}
                    </td>
                    <td className="py-2 pr-3 text-right">
                      <div className="flex items-center gap-1 justify-end">
                        {p.status !== 'completed' && (
                          <>
                            {!p.segregationVerified ? (
                              <button
                                type="button"
                                disabled={verifyingId === p._id}
                                onClick={() => handleVerifySegregation(p._id, true)}
                                className="rounded-full bg-emerald-600 px-2 py-1 text-[10px] font-semibold text-white hover:bg-emerald-700 disabled:opacity-50"
                                title="Verify segregation"
                              >
                                {verifyingId === p._id ? '…' : 'Verify'}
                              </button>
                            ) : null}
                            <button
                              type="button"
                              disabled={completingId === p._id}
                              onClick={() => handleComplete(p._id)}
                              className="rounded-full bg-primary px-2 py-1 text-[10px] font-semibold text-white hover:bg-emerald-900 disabled:opacity-50"
                              title="Complete pickup"
                            >
                              {completingId === p._id ? '…' : 'Complete'}
                            </button>
                          </>
                        )}
                        {p.status === 'completed' && (
                          <span className="text-xs text-slate-400">Done</span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
                {!pickups.length && (
                  <tr>
                    <td colSpan={9} className="py-4 text-center text-[11px] text-slate-400">
                      No pickup requests yet. Ask the judges to quickly schedule a few from the Citizen view.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {route && <RouteView routeData={route} />}
    </div>
  );
};

export default CollectorDashboard;

