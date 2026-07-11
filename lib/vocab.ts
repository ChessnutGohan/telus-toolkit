export type VocabCategory = "duration" | "process" | "status" | "financing" | "contact";

export type VocabEntry = {
  id: string;
  termFr: string;
  termEn: string;
  defFr: string;
  defEn: string;
  category: VocabCategory;
  related?: string;
  note?: string;
};

// Source: "Vocabulaire relatif aux contrats" sheet.
// Definitions below are drafted for you to edit/correct — treat as a first pass.
export const vocab: VocabEntry[] = [
  {
    id: "contrat",
    termFr: "Contrat (2-3 ans)",
    termEn: "Contract (2-3 years)",
    defFr: "Durée standard d'un engagement client, généralement entre deux et trois ans.",
    defEn: "Standard length of a customer agreement, typically two to three years.",
    category: "duration",
  },
  {
    id: "engagement",
    termFr: "Engagement",
    termEn: "Commitment",
    defFr: "Promesse contractuelle du client de rester avec Telus pour la durée convenue.",
    defEn: "The customer's contractual promise to stay with Telus for the agreed term.",
    category: "status",
    related: "engager — verbe : s'engager envers un contrat",
  },
  {
    id: "renouvellement",
    termFr: "Renouvellement",
    termEn: "Renewal",
    defFr: "Prolongation du contrat existant à son échéance.",
    defEn: "Extending an existing contract at its expiry.",
    category: "process",
  },
  {
    id: "renouveler",
    termFr: "Renouveler",
    termEn: "To renew",
    defFr: "Verbe : action de prolonger un contrat.",
    defEn: "Verb: the action of extending a contract.",
    category: "process",
  },
  {
    id: "renovation",
    termFr: "Rénovation",
    termEn: "Renovation",
    defFr: "Terme repris tel quel de ta fiche source — à préciser selon le contexte d'appel.",
    defEn: "Kept as written from your source sheet — clarify meaning in call context.",
    category: "process",
    note: "Possible mot voulu : « Rétention ». À confirmer et corriger au besoin.",
  },
  {
    id: "mois-par-mois",
    termFr: "Mois par mois",
    termEn: "Month-to-month",
    defFr: "Normalement moins cher quand le client achète l'appareil comptant.",
    defEn: "Usually cheaper when the client buys the device outright.",
    category: "financing",
  },
  {
    id: "fin-contrat",
    termFr: "Fin du contrat",
    termEn: "End of contract",
    defFr: "Date ou moment où l'engagement du client se termine.",
    defEn: "The date or point at which the customer's commitment ends.",
    category: "duration",
  },
  {
    id: "nouvelle-activation",
    termFr: "Nouvelle activation",
    termEn: "New activation",
    defFr: "Ouverture d'un tout nouveau compte ou d'une nouvelle ligne de service.",
    defEn: "Opening a brand-new account or service line.",
    category: "process",
  },
  {
    id: "equipement-subventionne",
    termFr: "Équipement Subventionné/Financé",
    termEn: "Subsidized / Financed device",
    defFr: "Appareil payé par versements inclus à la facture, plutôt qu'acheté comptant.",
    defEn: "A device paid off through installments on the bill, rather than bought outright.",
    category: "financing",
    note: "Corrigé de « Équipe » à « Équipement » — à valider.",
  },
  {
    id: "numero-telephone",
    termFr: "Le numéro de téléphone",
    termEn: "The phone number",
    defFr: "Identifiant de la ligne du client, à confirmer en début d'appel.",
    defEn: "The customer's line identifier, to confirm at the start of the call.",
    category: "contact",
  },
];
