import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Authentication
export const loginUser = async (credentials) => {
  const response = await api.post('/auth/login', credentials);
  return response.data;
};

// Heat Hotspots
export const getHotspots = async () => {
  const response = await api.get('/hotspots');
  return response.data;
};

export const getHotspotById = async (id) => {
  const response = await api.get(`/hotspots/${id}`);
  return response.data;
};

export const createHotspot = async (data) => {
  const response = await api.post('/hotspots', data);
  return response.data;
};

export const updateHotspot = async (id, data) => {
  const response = await api.put(`/hotspots/${id}`, data);
  return response.data;
};

export const deleteHotspot = async (id) => {
  const response = await api.delete(`/hotspots/${id}`);
  return response.data;
};

// Green Cover
export const getGreenCovers = async () => {
  const response = await api.get('/green-cover');
  return response.data;
};

export const getGreenCoverById = async (id) => {
  const response = await api.get(`/green-cover/${id}`);
  return response.data;
};

export const createGreenCover = async (data) => {
  const response = await api.post('/green-cover', data);
  return response.data;
};

export const updateGreenCover = async (id, data) => {
  const response = await api.put(`/green-cover/${id}`, data);
  return response.data;
};

export const deleteGreenCover = async (id) => {
  const response = await api.delete(`/green-cover/${id}`);
  return response.data;
};

// Weather Stations
export const getWeatherStations = async () => {
  const response = await api.get('/weather-stations');
  return response.data;
};

export const getWeatherStationById = async (id) => {
  const response = await api.get(`/weather-stations/${id}`);
  return response.data;
};

export const createWeatherStation = async (data) => {
  const response = await api.post('/weather-stations', data);
  return response.data;
};

export const updateWeatherStation = async (id, data) => {
  const response = await api.put(`/weather-stations/${id}`, data);
  return response.data;
};

export const deleteWeatherStation = async (id) => {
  const response = await api.delete(`/weather-stations/${id}`);
  return response.data;
};

// Cooling Initiatives
export const getCoolingInitiatives = async () => {
  const response = await api.get('/cooling-initiatives');
  return response.data;
};

export const getCoolingInitiativeById = async (id) => {
  const response = await api.get(`/cooling-initiatives/${id}`);
  return response.data;
};

export const createCoolingInitiative = async (data) => {
  const response = await api.post('/cooling-initiatives', data);
  return response.data;
};

export const updateCoolingInitiative = async (id, data) => {
  const response = await api.put(`/cooling-initiatives/${id}`, data);
  return response.data;
};

export const deleteCoolingInitiative = async (id) => {
  const response = await api.delete(`/cooling-initiatives/${id}`);
  return response.data;
};

// Reports & Summary
export const getReportSummary = async () => {
  const response = await api.get('/reports/summary');
  return response.data;
};

export const downloadCsvReportUrl = `${API_BASE_URL}/reports/download-csv`;

export default api;
