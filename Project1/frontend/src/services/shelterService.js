import api from './api';

const normalizeShelter = (shelter) => {
  if (!shelter) {
    return shelter;
  }

  return {
    ...shelter,
    id: shelter.id ?? shelter.Id,
    name: shelter.name ?? shelter.Name,
    address: shelter.address ?? shelter.Address,
  };
};

export const shelterService = {
  getAll: async () => {
    const data = (await api.get('/shelters')).data;
    return Array.isArray(data) ? data.map(normalizeShelter) : [];
  },
  getById: async (id) => normalizeShelter((await api.get(`/shelters/${id}`)).data),
  create: async (data) => normalizeShelter((await api.post('/shelters', data)).data),
  update: async (id, data) => normalizeShelter((await api.put(`/shelters/${id}`, data)).data),
  delete: async (id) => (await api.delete(`/shelters/${id}`)).data,
  getPetsByShelter: async (id) => (await api.get(`/shelters/${id}/pets`)).data,
};