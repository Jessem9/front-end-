import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface Profile {
  id: number;
  nom: string;
  prenom: string;
  adresse: string;
  telephone: string;
  description: string;
}

const ProfilePage = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/Demandeur/${userId}/profile`);
        setProfile(response.data);
      } catch (error) {
        console.error("Failed to fetch profile:", error);
      }
    };

    if (userId) fetchProfile();
  }, [userId]);

  if (!profile) return <div>Chargement du profil...</div>;

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Mon Profil</h2>
      <div className="bg-white shadow-md rounded p-4 space-y-2">
        <p><strong>Nom :</strong> {profile.nom}</p>
        <p><strong>Prénom :</strong> {profile.prenom}</p>
        <p><strong>Adresse :</strong> {profile.adresse}</p>
        <p><strong>Téléphone :</strong> {profile.telephone}</p>
        <p><strong>Description :</strong> {profile.description}</p>
      </div>
    </div>
  );
};

export default ProfilePage;
