// src/data/serviceAPI.ts
import { Service } from "@/types/models";

export const createService = async (service: Service) => {
  const response = await fetch("http://localhost:5000/api/Service", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(service),
  });

  if (!response.ok) {
    throw new Error("Erreur lors de la création du service");
  }

  return response.json();
};
