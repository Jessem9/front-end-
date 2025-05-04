import { useEffect, useState } from "react";
import { NavBar } from "@/components/NavBar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { fetchCategories, fetchSousCategories, fetchPrestataires } from "@/data/mockData";
import { Categorie, SousCategorie, Prestataire } from "@/types/models";
import { createService } from "@/data/ServiceAPI";

const CreerService = () => {
  const [titre, setTitre] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [prestataireId, setPrestataireId] = useState<number>(1); // prestataire connecté
  const [sousCategorieId, setSousCategorieId] = useState<number | undefined>(undefined);
  const [categories, setCategories] = useState<Categorie[]>([]);
  const [sousCategories, setSousCategories] = useState<SousCategorie[]>([]);
  const [prestataires, setPrestataires] = useState<Prestataire[]>([]);

  // Simuler un utilisateur connecté avec ID 1 (à remplacer par le vrai contexte auth si dispo)
  const prestataireConnecteId = 1;

  useEffect(() => {
    const fetchData = async () => {
      const [cats, sousCats, prestas] = await Promise.all([
        fetchCategories(),
        fetchSousCategories(),
        fetchPrestataires()
      ]);
      setCategories(cats);
      setSousCategories(sousCats);
      setPrestataires(prestas);

      const prestataireConnecte = prestas.find(p => p.id === prestataireConnecteId);
      if (prestataireConnecte) {
        setPrestataireId(prestataireConnecte.id);
      }
    };
    fetchData();
  }, []);

  const handleSubmit = async () => {
    if (!titre || !description || !prestataireId || !sousCategorieId || !image) {
      alert("Veuillez remplir tous les champs.");
      return;
    }
  
    const newService = {
      id: Date.now(),
      titre,
      description,
      prestataireId,
      sousCategorieId,
      reserveParId: 1,
      image,
    };
  
    try {
      await createService(newService);
      alert("Service créé avec succès !");
    } catch (error) {
      console.error("Erreur API :", error);
      alert("Une erreur est survenue lors de la création du service.");
    }
    console.log("Data envoyée au backend :", newService);
  };
  

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      <main className="flex-grow bg-gray-50 pt-28 px-4 max-w-3xl mx-auto">
        {/* pt-28 pour ajouter de l'espace sous la navbar */}
        <h1 className="text-2xl font-bold mb-6">Créer un nouveau service</h1>

        <div className="space-y-4">
          <Input placeholder="Titre du service" value={titre} onChange={(e) => setTitre(e.target.value)} />
          <Textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
          <Input placeholder="URL de l'image" value={image} onChange={(e) => setImage(e.target.value)} />

          <Select value={prestataireId?.toString()} onValueChange={(value) => setPrestataireId(Number(value))}>
            <SelectTrigger>
              <SelectValue placeholder="Prestataire connecté" />
            </SelectTrigger>
            <SelectContent>
              {prestataires.map((p) => (
                <SelectItem key={p.id} value={String(p.id)}>
                  {p.profilPro?.prenom} {p.profilPro?.nom}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select onValueChange={(value) => setSousCategorieId(Number(value))}>
            <SelectTrigger>
              <SelectValue placeholder="Choisir une sous-catégorie" />
            </SelectTrigger>
            <SelectContent>
              {sousCategories.map((s) => (
                <SelectItem key={s.id} value={String(s.id)}>
                  {s.nom}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button className="w-full" style={{ backgroundColor: "#09403A", color: "white" }} onClick={handleSubmit}>
            Créer le service
          </Button>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CreerService;
