export type Lang = "fr" | "en";

export const dictionary = {
  fr: {
    brand: "Console Opérateur",
    brandSub: "Boîte à outils Telus — usage personnel",
    navHome: "Tableau de bord",
    navScript: "Script",
    navSmartScript: "Smart Script",
    navVocabulaire: "Vocabulaire",
    navTechnologies: "Technologies",
    navProvinces: "Provinces",
    navCodePostal: "Code postal",
    statusLive: "Session active",
    homeTitle: "Tableau de bord",
    homeLede:
      "Ton espace de référence perso pour les appels : scripts, vocabulaire et fiches techniques, tout au même endroit.",
    entriesLogged: "entrées enregistrées",
    draftEntries: "à compléter",
    openSection: "Ouvrir",
    emptyTitle: "Section vide pour l'instant",
    emptyBody:
      "Cette section n'a pas encore de contenu. On la remplira à la prochaine étape — structure prête, branchement à venir.",
    vocabTitle: "Vocabulaire pour les appels",
    vocabLede:
      "Termes clés à connaître en appel, avec leur équivalent anglais. Modifie ou ajoute des entrées au fil de tes scripts.",
    searchPlaceholder: "Chercher un terme…",
    noResults: "Aucun terme ne correspond à ta recherche.",
    related: "Voir aussi",
    langToggleLabel: "Langue",
    footerNote:
      "Brouillon v0.1 — structure de base prête pour le branchement de scripts à venir.",
  },
  en: {
    brand: "Operator Console",
    brandSub: "Telus toolkit — personal use",
    navHome: "Dashboard",
    navScript: "Script",
    navSmartScript: "Smart Script",
    navVocabulaire: "Vocabulary",
    navTechnologies: "Technologies",
    navProvinces: "Provinces",
    navCodePostal: "Postal Code",
    statusLive: "Session live",
    homeTitle: "Dashboard",
    homeLede:
      "Your personal reference space for calls: scripts, vocabulary, and technical sheets, all in one place.",
    entriesLogged: "entries logged",
    draftEntries: "to fill in",
    openSection: "Open",
    emptyTitle: "Nothing here yet",
    emptyBody:
      "This section has no content yet. We'll fill it in at the next step — the structure is ready, branching coming soon.",
    vocabTitle: "Contract Vocabulary",
    vocabLede:
      "Key terms to know on calls, with their French equivalent. Edit or add entries as your scripts grow.",
    searchPlaceholder: "Search a term…",
    noResults: "No term matches your search.",
    related: "See also",
    langToggleLabel: "Language",
    footerNote:
      "Draft v2 - ready structure for future script branching andinitial build for gemini integration and tweaks.",
  },
} as const;

export type DictKey = keyof typeof dictionary["fr"];
