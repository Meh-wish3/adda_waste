import api from '../../api/apiClient';

export const fetchHouseholds = async () => {
  const res = await api.get('/households');
  return res.data;
};

export const createPickup = async (payload) => {
  const res = await api.post('/pickups', payload);
  return res.data;
};

export const fetchCitizenPickups = async (householdId) => {
  const res = await api.get('/pickups', {
    params: { householdId },
  });
  return res.data;
};

export const fetchIncentives = async (householdId) => {
  const res = await api.get(`/incentives/${householdId}`);
  return res.data;
};

