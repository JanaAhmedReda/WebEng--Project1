import api from './api';

const normalizeAdoption = (application) => {
  if (!application) {
    return application;
  }

  return {
    ...application,
    userId: application.userId ?? application.UserId,
    petId: application.petId ?? application.PetId,
    petName: application.petName ?? application.PetName,
    adopterName: application.adopterName ?? application.AdopterName,
    applicationDate: application.applicationDate ?? application.ApplicationDate,
    status: application.status ?? application.Status,
  };
};

export const adoptionService = {
  apply: async (data) => normalizeAdoption((await api.post('/adoptions/apply', data)).data),
  getAll: async () => {
    const data = (await api.get('/adoptions/all')).data;
    return Array.isArray(data) ? data.map(normalizeAdoption) : [];
  },
  getByPet: async (petId) => {
    const data = (await api.get(`/adoptions/pet/${petId}`)).data;
    return Array.isArray(data) ? data.map(normalizeAdoption) : [];
  },
  getByUser: async (userId) => {
    const data = (await api.get(`/adoptions/user/${userId}`)).data;
    return Array.isArray(data) ? data.map(normalizeAdoption) : [];
  },
  updateStatus: async (data) => (await api.put('/adoptions/status', data)).data,
  delete: async (petId, userId) => (await api.delete(`/adoptions/${petId}/${userId}`)).data,
};