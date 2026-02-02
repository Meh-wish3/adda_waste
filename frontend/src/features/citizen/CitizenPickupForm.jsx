import React, { useEffect, useState } from 'react';
import {
  fetchHouseholds,
  createPickup,
  fetchIncentives,
} from './CitizenApi';
import { Droplets, Trash2, Battery, AlertTriangle, Clock, MapPin, CheckCircle2, Ticket } from 'lucide-react';
import { motion } from 'framer-motion';

const wasteTypeOptions = [
  {
    value: 'wet',
    label: 'Wet Waste',
    desc: 'Kitchen & Organic',
    color: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    icon: <Droplets size={24} />
  },
  {
    value: 'dry',
    label: 'Dry Waste',
    desc: 'Plastic, Paper, Metal',
    color: 'bg-blue-100 text-blue-700 border-blue-200',
    icon: <Trash2 size={24} />
  },
  {
    value: 'e-waste',
    label: 'E-Waste',
    desc: 'Batteries, Electronics',
    color: 'bg-amber-100 text-amber-700 border-amber-200',
    icon: <Battery size={24} />
  },
];

const CitizenPickupForm = () => {
  const [households, setHouseholds] = useState([]);
  const [selectedHousehold, setSelectedHousehold] = useState('');
  const [wasteType, setWasteType] = useState('wet');
  const [pickupTime, setPickupTime] = useState('');
  const [overflow, setOverflow] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [points, setPoints] = useState(0);
  const [location, setLocation] = useState(null);
  const [locationStatus, setLocationStatus] = useState('idle'); // idle, requesting, granted, denied, fallback
  const [useManualArea, setUseManualArea] = useState(false);

  useEffect(() => {
    fetchHouseholds()
      .then((data) => {
        setHouseholds(data);
        if (data.length) {
          setSelectedHousehold(data[0].householdId);
        }
      })
      .catch(() => {
        setMessage('Failed to load households. Check backend.');
      });
  }, []);

  useEffect(() => {
    if (!selectedHousehold) return;
    fetchIncentives(selectedHousehold)
      .then((data) => setPoints(data.points || 0))
      .catch(() => { });
  }, [selectedHousehold]);

  // Request geolocation on component mount or when household changes
  useEffect(() => {
    if (!selectedHousehold || useManualArea) return;

    if ('geolocation' in navigator) {
      setLocationStatus('requesting');
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          setLocationStatus('granted');
        },
        (error) => {
          console.warn('Geolocation denied or failed:', error);
          setLocationStatus('denied');
          // Fallback: use household's area location if available
          const household = households.find((h) => h.householdId === selectedHousehold);
          if (household?.location?.lat && household?.location?.lng) {
            setLocation(household.location);
            setLocationStatus('fallback');
          }
        },
        { timeout: 5000, enableHighAccuracy: false }
      );
    } else {
      setLocationStatus('denied');
      const household = households.find((h) => h.householdId === selectedHousehold);
      if (household?.location?.lat && household?.location?.lng) {
        setLocation(household.location);
        setLocationStatus('fallback');
      }
    }
  }, [selectedHousehold, households, useManualArea]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedHousehold || !pickupTime) return;
    setSubmitting(true);
    setMessage('');
    try {
      await createPickup({
        householdId: selectedHousehold,
        wasteType,
        pickupTime,
        overflow,
        location, // Include location if available
      });

      // Refresh points after successful submission
      fetchIncentives(selectedHousehold)
        .then((data) => setPoints(data.points || 0))
        .catch(() => { });

      setMessage('Pickup scheduled successfully! Location shared with collector.');
      // Reset form
      setPickupTime('');
      setOverflow(false);
    } catch (err) {
      setMessage('Failed to schedule pickup. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <section className="card lg:col-span-2 shadow-lg border border-gray-100/50">
        <h2 className="font-heading text-xl font-bold text-primary mb-2 flex items-center gap-2">
          <Clock size={20} className="text-secondary" />
          Schedule Pickup
        </h2>
        <p className="text-sm text-slate-500 mb-6">
          Ward workers will visit your household based on this request. Please ensure correct segregation.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Household Selection */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
              <MapPin size={16} className="text-emerald-500" />
              Select Household
            </label>
            <div className="relative">
              <select
                value={selectedHousehold}
                onChange={(e) => {
                  setSelectedHousehold(e.target.value);
                  setUseManualArea(false);
                }}
                className="w-full rounded-2xl border border-gray-200 bg-gray-50/50 px-4 py-3 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all appearance-none cursor-pointer hover:bg-white"
              >
                {households.map((h) => (
                  <option key={h.householdId} value={h.householdId}>
                    {h.householdId} – {h.headName} ({h.area})
                  </option>
                ))}
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                ▼
              </div>
            </div>

            {/* Location Status */}
            <div className="mt-2 text-xs">
              {locationStatus === 'requesting' && (
                <p className="text-blue-600 flex items-center gap-1">
                  <MapPin size={12} /> Requesting location...
                </p>
              )}
              {locationStatus === 'granted' && location && (
                <p className="text-emerald-600 flex items-center gap-1">
                  <CheckCircle2 size={12} /> Location shared: {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
                </p>
              )}
              {locationStatus === 'denied' && (
                <div className="flex items-center gap-2">
                  <p className="text-amber-600 flex items-center gap-1">
                    <AlertTriangle size={12} /> Location access denied
                  </p>
                  {!useManualArea && (
                    <button
                      type="button"
                      onClick={() => {
                        setUseManualArea(true);
                        const household = households.find((h) => h.householdId === selectedHousehold);
                        if (household?.location) {
                          setLocation(household.location);
                          setLocationStatus('fallback');
                        }
                      }}
                      className="text-primary underline text-xs"
                    >
                      Use area location
                    </button>
                  )}
                </div>
              )}
              {locationStatus === 'fallback' && location && (
                <p className="text-slate-500 flex items-center gap-1">
                  <MapPin size={12} /> Using area location: {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
                </p>
              )}
            </div>
          </div>

          {/* Waste Type Grid */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-3">
              Type of Waste
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {wasteTypeOptions.map((opt) => {
                const isSelected = wasteType === opt.value;
                return (
                  <motion.button
                    key={opt.value}
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setWasteType(opt.value)}
                    className={`relative p-4 rounded-2xl border-2 text-left transition-all duration-200 flex flex-col gap-2 ${isSelected
                      ? `border-primary bg-primary/5 shadow-md`
                      : 'border-transparent bg-gray-50 hover:bg-gray-100'
                      }`}
                  >
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isSelected ? 'bg-primary text-white' : 'bg-white text-slate-400'
                      }`}>
                      {isSelected ? <CheckCircle2 size={20} /> : opt.icon}
                    </div>
                    <div>
                      <p className={`font-bold text-sm ${isSelected ? 'text-primary' : 'text-slate-700'}`}>
                        {opt.label}
                      </p>
                      <p className="text-xs text-slate-500">{opt.desc}</p>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* Time & Overflow */}
          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Preferred Time
              </label>
              <input
                type="datetime-local"
                value={pickupTime}
                onChange={(e) => setPickupTime(e.target.value)}
                className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
              />
            </div>

            <div
              className={`rounded-2xl border-2 p-4 cursor-pointer transition-all duration-200 flex items-start gap-3 ${overflow
                ? 'border-red-400 bg-red-50'
                : 'border-dashed border-gray-300 hover:border-red-300 hover:bg-red-50/30'
                }`}
              onClick={() => setOverflow(!overflow)}
            >
              <div className={`mt-0.5 p-1.5 rounded-full ${overflow ? 'bg-red-500 text-white' : 'bg-gray-200 text-gray-500'}`}>
                <AlertTriangle size={16} />
              </div>
              <div>
                <p className={`text-sm font-bold ${overflow ? 'text-red-700' : 'text-slate-600'}`}>
                  Report Overflow
                </p>
                <p className="text-xs text-slate-500 leading-tight mt-1">
                  Mark if the bin is full. High priority for collectors.
                </p>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={submitting || !selectedHousehold || !pickupTime}
              className="btn-primary w-full h-14 text-base shadow-lg hover:shadow-xl disabled:opacity-50 disabled:shadow-none"
            >
              {submitting ? 'Scheduling...' : 'Schedule Pickup Request'}
            </button>
          </div>

          {message && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-4 rounded-xl text-sm font-medium flex items-center gap-3 ${message.includes('success')
                ? 'bg-emerald-100 text-emerald-800'
                : 'bg-red-100 text-red-800'
                }`}
            >
              {message.includes('success') ? <CheckCircle2 size={18} /> : <AlertTriangle size={18} />}
              {message}
            </motion.div>
          )}
        </form>
      </section>

      {/* Score Card */}
      <section className="space-y-4">
        <div className="card bg-gradient-to-br from-primary to-emerald-900 text-white shadow-xl border-none relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <Ticket size={120} />
          </div>

          <div className="relative z-10">
            <h3 className="text-emerald-200 text-xs font-bold uppercase tracking-wider mb-1">
              My Segregation Score
            </h3>
            <div className="flex items-baseline gap-1">
              <span className="text-5xl font-bold tracking-tight">{points}</span>
              <span className="text-emerald-300 text-sm">pts</span>
            </div>

            <div className="mt-6 bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/10">
              <ul className="space-y-2 text-xs text-emerald-50">
                <li className="flex justify-between">
                  <span>Wet Waste</span>
                  <span className="font-bold">+5 pts</span>
                </li>
                <li className="flex justify-between">
                  <span>Dry Waste</span>
                  <span className="font-bold">+8 pts</span>
                </li>
                <li className="flex justify-between">
                  <span>E-Waste</span>
                  <span className="font-bold">+15 pts</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="card bg-white border border-lime-100 shadow-sm relative overflow-hidden">
          <div className="absolute -right-4 -top-4 bg-lime-50 w-24 h-24 rounded-full blur-xl" />
          <h3 className="font-heading font-bold text-slate-800 flex items-center gap-2 mb-2 relative z-10">
            <Ticket size={18} className="text-lime-600" />
            Rewards
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed relative z-10">
            Redeem points for discounts at local partner stores.
            <br />
            <span className="italic text-slate-400 mt-2 block">(Currently in demo mode)</span>
          </p>
        </div>
      </section>
    </div>
  );
};

export default CitizenPickupForm;

