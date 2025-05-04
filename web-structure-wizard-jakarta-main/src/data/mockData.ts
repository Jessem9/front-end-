// src/services/dataService.ts
import api from '@/Services/api';
import { Categorie, SousCategorie, Service, Prestataire, Feedback, Demandeur, Admin, Profil } from '../types/models';
import axios from 'axios';

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
export async function getPrestataire(id: string): Promise<Prestataire> {
  try {
    const response = await axios.get(`/prestataires/${id}`);
    const data = response.data;

    console.log("API response data for prestataire:", data);

    // Vérification minimale (sans throw)
    if (!data || !data.id || !data.nom || !data.email) {
      console.warn("Prestataire data seems incomplete:", data);
    }

    return data as Prestataire;
  } catch (error: any) {
    console.error("Erreur lors de la récupération du prestataire:", error);
    throw new Error("Impossible de récupérer les données du prestataire.");
  }
}