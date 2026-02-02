import React from 'react';
import routingExplanation from '../../utils/routingExplanation';

const RouteView = ({ routeData }) => {
  const { meta, route } = routeData;

  return (
    <section className="card">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between mb-3">
        <div>
          <h3 className="font-heading text-sm font-semibold text-primary">
            Optimized pickup route (single shift)
          </h3>
          <p className="text-[11px] text-slate-500 max-w-md">
            Explainable heuristic: group by area, follow a fixed ward loop, and
            within each area serve earlier time slots first.
          </p>
        </div>
        <div className="rounded-xl bg-emerald-50 px-3 py-2 text-[11px] text-emerald-900 max-w-xs">
          <p className="font-semibold mb-1">Ward loop order</p>
          <p>{meta?.areaOrder?.join(' → ')}</p>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <div className="md:col-span-2 space-y-2">
          {route.map((step) => (
            <div
              key={step.pickupId}
              className="flex items-start gap-3 rounded-2xl border border-slate-100 bg-white px-3 py-2"
            >
              <div className="mt-1 flex h-7 w-7 items-center justify-center rounded-full bg-secondary text-[11px] font-bold text-primary shadow-soft">
                {step.sequence}
              </div>
              <div className="text-[11px]">
                <p className="font-semibold text-slate-800">
                  HH {step.householdId} – {step.area}
                </p>
                <p className="text-slate-600">
                  Waste: <span className="capitalize">{step.wasteType}</span>{' '}
                  | Time: {new Date(step.pickupTime).toLocaleTimeString()}
                </p>
                {step.overflow && (
                  <p className="mt-0.5 inline-flex rounded-full bg-red-50 px-2 py-0.5 text-[10px] font-semibold text-red-700">
                    Overflow priority
                  </p>
                )}
                <p className="mt-1 text-slate-500">{step.explanation}</p>
              </div>
            </div>
          ))}
          {!route.length && (
            <p className="text-[11px] text-slate-400">
              No pending pickups. Once citizens raise requests, generate the
              route to see the ordered list here.
            </p>
          )}
        </div>
        <div className="rounded-2xl bg-emerald-50 p-3 text-[11px] text-emerald-900">
          <p className="font-semibold mb-1">Routing logic (for judges)</p>
          <p className="mb-2">{routingExplanation}</p>
          <p className="font-semibold mt-2 mb-1">Why this is ward-level</p>
          <p>
            The algorithm only uses pre-defined areas and households of Ward 4.
            There is no city-wide optimization and no ML – just simple,
            explainable rules that a ward supervisor can tweak.
          </p>
        </div>
      </div>
    </section>
  );
};

export default RouteView;

