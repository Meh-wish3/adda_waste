import React, { useEffect, useState } from 'react';
import {
  fetchShiftPickups,
  generateRoute,
  completePickup,
} from './CollectorApi';
import StatusBadge from '../../components/StatusBadge';
import RouteView from './RouteView';

const CollectorDashboard = () => {
  const [pickups, setPickups] = useState([]);
  const [route, setRoute] = useState(null);
  const [loadingRoute, setLoadingRoute] = useState(false);
  const [completingId, setCompletingId] = useState(null);

  const refreshPickups = () => {
    fetchShiftPickups().then(setPickups);
  };

  useEffect(() => {
    refreshPickups();
  }, []);

  const handleGenerateRoute = async () => {
    setLoadingRoute(true);
    try {
      const data = await generateRoute();
      setRoute(data);
    } finally {
      setLoadingRoute(false);
    }
  };

  const handleComplete = async (pickupId) => {
    if (!window.confirm('Mark pickup as completed with correct segregation?')) {
      return;
    }
    setCompletingId(pickupId);
    try {
      await completePickup(pickupId, { correctSegregation: true });
      refreshPickups();
      handleGenerateRoute();
    } finally {
      setCompletingId(null);
    }
  };

  return (
    <div className="space-y-4">
      <section className="card">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between mb-3">
          <div>
            <h2 className="font-heading text-lg font-semibold text-primary">
              Ward worker shift view
            </h2>
            <p className="text-[11px] text-slate-500 max-w-md">
              All citizen pickup requests for the current shift in Ward 4. The
              route generator groups requests by area so you don&apos;t zig-zag across
              the ward.
            </p>
          </div>
          <button
            type="button"
            onClick={handleGenerateRoute}
            className="btn-secondary"
          >
            {loadingRoute ? 'Generating route…' : 'Generate Route'}
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-xs">
            <thead className="border-b border-slate-100 text-[11px] uppercase tracking-wide text-slate-500">
              <tr>
                <th className="py-2 pr-3">HH ID</th>
                <th className="py-2 pr-3">Area</th>
                <th className="py-2 pr-3">Waste Type</th>
                <th className="py-2 pr-3">Pickup Time</th>
                <th className="py-2 pr-3">Overflow</th>
                <th className="py-2 pr-3">Status</th>
                <th className="py-2 pr-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {pickups.map((p) => (
                <tr key={p._id}>
                  <td className="py-2 pr-3 text-slate-700">{p.householdId}</td>
                  <td className="py-2 pr-3 text-slate-700">
                    {p.area || '-'}
                  </td>
                  <td className="py-2 pr-3 capitalize text-slate-700">
                    {p.wasteType}
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
                      <span className="text-[11px] text-slate-400">
                        Normal
                      </span>
                    )}
                  </td>
                  <td className="py-2 pr-3">
                    <StatusBadge status={p.status} />
                  </td>
                  <td className="py-2 pr-3 text-right">
                    <button
                      type="button"
                      disabled={p.status === 'completed' || completingId === p._id}
                      onClick={() => handleComplete(p._id)}
                      className="rounded-full bg-primary px-3 py-1 text-[11px] font-semibold text-white disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {p.status === 'completed'
                        ? 'Completed'
                        : completingId === p._id
                        ? 'Saving…'
                        : 'Mark Completed + Points'}
                    </button>
                  </td>
                </tr>
              ))}
              {!pickups.length && (
                <tr>
                  <td
                    colSpan={7}
                    className="py-4 text-center text-[11px] text-slate-400"
                  >
                    No pickup requests yet. Ask the judges to quickly schedule a
                    few from the Citizen view.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {route && <RouteView routeData={route} />}
    </div>
  );
};

export default CollectorDashboard;

