import React, { useEffect, useState } from 'react';
import {
  fetchCitizenPickups,
  fetchHouseholds,
  fetchIncentives,
} from './CitizenApi';
import StatusBadge from '../../components/StatusBadge';
import { Calendar, Droplets, Trash2, Battery, AlertTriangle, MapPin, ChevronDown, ChevronUp, Clock, FileText, Ban } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const wasteIcons = {
  wet: <Droplets size={16} className="text-emerald-500" />,
  dry: <Trash2 size={16} className="text-blue-500" />,
  'e-waste': <Battery size={16} className="text-amber-500" />,
};

const CitizenStatusView = () => {
  const [households, setHouseholds] = useState([]);
  const [selectedHousehold, setSelectedHousehold] = useState('');
  const [pickups, setPickups] = useState([]);
  const [points, setPoints] = useState(0);
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    fetchHouseholds().then((data) => {
      setHouseholds(data);
      if (data.length) {
        setSelectedHousehold(data[0].householdId);
      }
    });
  }, []);

  useEffect(() => {
    if (!selectedHousehold) return;
    const loadData = () => {
      fetchCitizenPickups(selectedHousehold).then(setPickups);
      fetchIncentives(selectedHousehold).then((data) =>
        setPoints(data.points || 0)
      );
    };

    loadData();
    // Refresh every 10s for demo feel
    const interval = setInterval(loadData, 10000);
    return () => clearInterval(interval);
  }, [selectedHousehold]);

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <section className="mt-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
        <div>
          <h3 className="font-heading text-lg font-bold text-slate-800">
            Recent Activity
          </h3>
          <p className="text-sm text-slate-500">
            Your pickup history and request status.
          </p>
        </div>

        <div className="flex items-center gap-3 bg-white p-2 rounded-xl border border-gray-100 shadow-sm">
          <div className="flex items-center gap-2 px-2">
            <MapPin size={16} className="text-slate-400" />
            <select
              value={selectedHousehold}
              onChange={(e) => setSelectedHousehold(e.target.value)}
              className="text-sm font-medium text-slate-700 bg-transparent outline-none cursor-pointer"
            >
              {households.map((h) => (
                <option key={h.householdId} value={h.householdId}>
                  {h.headName}
                </option>
              ))}
            </select>
          </div>
          <div className="h-6 w-px bg-gray-200" />
          <div className="px-3 py-1 bg-emerald-50 rounded-lg text-emerald-700 text-sm font-bold">
            {points} pts
          </div>
        </div>
      </div>

      <div className="grid gap-4">
        {pickups.map((p) => {
          const isExpanded = expandedId === p._id;
          return (
            <div
              key={p._id}
              className={`bg-white rounded-2xl border transition-all duration-200 overflow-hidden ${isExpanded ? 'shadow-md border-primary/20 ring-1 ring-primary/10' : 'border-gray-100 shadow-sm hover:shadow-md'
                }`}
            >
              {/* Card Header (Clickable) */}
              <div
                className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer"
                onClick={() => toggleExpand(p._id)}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center bg-gray-50 border border-gray-100 transition-transform ${p.overflow ? 'bg-red-50 border-red-100' : ''
                    }`}>
                    {wasteIcons[p.wasteType] || <Trash2 size={16} />}
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-slate-800 capitalize">
                        {p.wasteType} Waste
                      </span>
                      {p.overflow && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-red-600 bg-red-50 px-2 py-0.5 rounded-full">
                          <AlertTriangle size={10} /> Overflow
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <Calendar size={12} />
                      {new Date(p.pickupTime).toLocaleString([], {
                        month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                      })}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-6 pl-16 sm:pl-0">
                  <div className="text-right hidden sm:block">
                    <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wider mb-1">Status</p>
                    <StatusBadge status={p.status} />
                  </div>
                  <div className="sm:hidden">
                    <StatusBadge status={p.status} />
                  </div>

                  <button
                    className={`text-slate-300 transition-transform duration-300 ${isExpanded ? 'rotate-180 text-primary' : 'hover:text-primary'}`}
                  >
                    <ChevronDown size={20} />
                  </button>
                </div>
              </div>

              {/* Expanded Details */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="border-t border-gray-100 bg-gray-50/50"
                  >
                    <div className="p-4 grid sm:grid-cols-2 gap-4 text-sm">
                      <div className="space-y-3">
                        <div>
                          <p className="text-xs text-slate-400 uppercase font-semibold mb-1 flex items-center gap-1"><FileText size={12} /> Request ID</p>
                          <p className="font-mono text-slate-600 bg-white inline-block px-2 py-1 rounded border border-gray-200 text-xs">{p._id}</p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-400 uppercase font-semibold mb-1 flex items-center gap-1"><Clock size={12} /> Est. Arrival</p>
                          <p className="text-slate-700 font-medium">
                            {p.status === 'completed' ? 'Completed' : 'Within 2 hours of scheduled time'}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-col justify-end items-end gap-2">
                        {p.status === 'pending' && (
                          <div className="text-right">
                            <button
                              disabled
                              className="text-xs font-semibold text-red-400 hover:text-red-500 flex items-center gap-1 border border-red-200 px-3 py-2 rounded-lg bg-white opacity-50 cursor-not-allowed"
                              title="Cancellation not enabled in demo"
                            >
                              <Ban size={14} /> Cancel Request
                            </button>
                            <p className="text-[10px] text-slate-400 mt-1 italic">Cancellation disabled in demo mode</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}

        {!pickups.length && (
          <div className="text-center py-12 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-100">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
              <Calendar size={32} className="text-slate-300" />
            </div>
            <h4 className="text-slate-900 font-semibold mb-1">No pickups found</h4>
            <p className="text-slate-500 text-sm max-w-xs mx-auto">
              You haven't scheduled any pickups for this household yet.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default CitizenStatusView;

