import api from '../../api/apiClient';

export const fetchShiftPickups = async () => {
  const res = await api.get('/pickups', { params: { status: 'pending' } });
  return res.data;
};

export const generateRoute = async () => {
  const res = await api.get('/route');
  return res.data;
};

export const verifySegregation = async (id, { verified }) => {
  const res = await api.patch(`/pickups/${id}/verify`, {
    verified,
  });
  return res.data;
};

export const completePickup = async (id) => {
  const res = await api.patch(`/pickups/${id}/complete`);
  return res.data;
};

