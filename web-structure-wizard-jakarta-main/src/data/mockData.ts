// src/services/dataService.ts
import api from '@/Services/api';
import { Categorie, SousCategorie, Service, Prestataire, Feedback, Demandeur, Admin, Profil } from '../types/models';

export const fetchCategories = async (): Promise<Categorie[]> => {
  const response = await api.get('/Categorie');
  return response.data;
};

export const fetchSousCategories = async (): Promise<SousCategorie[]> => {
  const response = await api.get('/SousCategorie');
  return response.data;
};

export const fetchServices = async (): Promise<Service[]> => {
  const response = await api.get('/Service');
  return response.data;
};

export const fetchPrestataires = async (): Promise<Prestataire[]> => {
  const response = await api.get('/Prestataires');
  return response.data;
};

export const fetchProfils = async (): Promise<Profil[]> => {
  const response = await api.get('/Profil');
  return response.data;
};

// Repeat for Demandeurs, Feedback, Admin, etc.
