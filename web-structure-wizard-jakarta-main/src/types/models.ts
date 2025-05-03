
// Types représentant la structure du diagramme UML

export interface Admin {
  id: number;
  nom: string;
  email: string;
  motDePasse: string;
}

export interface Demandeur {
  id: number;
  email: string;
  motDePasse: string;
  historiqueService: Service[];
  
  authentifier?: () => boolean;
  gererUtilisateurs?: () => void;
}

export interface Profil {
  id: number;
  nom: string;
  prenom: string;
  bio: string;
  adress: string;
  
  gererProfile?: () => void;
  profilePro?: () => ProfilPro | null;
  consulterProfils?: () => Profil[];
}

export interface ProfilPro extends Profil {
  competences: string[];
  experience: string[];
}

export interface Prestataire extends Demandeur {
  services: Service[];
  profilPro: ProfilPro;
  
  creerService?: () => Service;
  gererPrestataires?: () => void;
}

export interface Feedback {
  id: number;
  commentaire: string;
  note: number;
  demandeurId: number;
  serviceId: number;
  
  donnerFeedback?: () => void;
}

export interface Categorie {
  id: number;
  nom: string;
  image: string;
}

export interface SousCategorie {
  id: number;
  nom: string;
  categorieId: number;
  
  getServices?: () => Service[];
}

export interface Service {
  id: number;
  titre: string;
  description: string;
  prestataireId: number;   // Utiliser l'ID du prestataire
  sousCategorieId: number; // Utiliser l'ID de la sous-catégorie
  reserveParId?: number;   // Utiliser l'ID du demandeur, s'il existe
  image: string;
}
