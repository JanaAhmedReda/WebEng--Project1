import api from './api';

const normalizePet = (pet) => {
  if (!pet) {
    return pet;
  }

  return {
    ...pet,
    id: pet.id ?? pet.Id,
    name: pet.name ?? pet.Name,
    breed: pet.breed ?? pet.Breed,
    age: pet.age ?? pet.Age,
    ageUnit: pet.ageUnit ?? pet.AgeUnit,
    shelterId: pet.shelterId ?? pet.ShelterId,
    shelterName: pet.shelterName ?? pet.ShelterName,
    healthNotes: pet.healthNotes ?? pet.HealthNotes,
    isVaccinated: pet.isVaccinated ?? pet.IsVaccinated,
  };
};

export const petService = {
  getAll: async () => {
    const data = (await api.get('/pets')).data;
    return Array.isArray(data) ? data.map(normalizePet) : [];
  },
  getById: async (id) => normalizePet((await api.get(`/pets/${id}`)).data),
  create: async (data) => normalizePet((await api.post('/pets', data)).data),
  update: async (id, data) => normalizePet((await api.put(`/pets/${id}`, data)).data),
  delete: async (id) => (await api.delete(`/pets/${id}`)).data,
  getByShelterId: async (shelterId) => {
    const data = (await api.get(`/shelters/${shelterId}/pets`)).data;
    return Array.isArray(data) ? data.map(normalizePet) : [];
  },
};