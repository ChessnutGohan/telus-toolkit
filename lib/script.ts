export type ScriptLine = {
  id: string;
  speaker: "agent" | "client";
  text: string;
  phase: string;
  note?: string;
  branchPoint?: boolean;
};

export const scriptLines: ScriptLine[] = [
  // PHASE: GREETING
  {
    id: "greeting-001",
    speaker: "agent",
    phase: "greeting",
    text: "FR: Bonjour, ici Francisco chez Telus. En quoi puis-je vous aider aujourd'hui ?\nEN: Hello, this is Francisco at Telus, how can I help you today?",
    note: "Preferred opening (simple and direct).",
  },
  {
    id: "greeting-002",
    speaker: "agent",
    phase: "greeting",
    text: "FR: Bonjour, merci d'avoir contacté Telus, je suis Francisco. Comment puis-je vous être utile aujourd'hui ?\nEN: Hello, thank you for contacting Telus, I am Francisco. How can I be of service to you today?",
    note: "Alternative opening (slightly more formal/complex).",
  },

  // PHASE: VERIFICATION
  {
    id: "verif-001",
    speaker: "agent",
    phase: "verification",
    text: "FR: Pourriez-vous me communiquer votre numéro de compte ou une autre référence pour accéder à votre dossier ?\nEN: Could you provide me with your account number or another reference to access your file?",
    note: "Easiest method to pull up the account.",
  },
  {
    id: "verif-002",
    speaker: "agent",
    phase: "verification",
    text: "FR: Afin de vous identifier dans notre système, pourriez-vous me donner votre [ÉLÉMENT] ou votre [ÉLÉMENT] ?\nEN: In order to identify you in our system, could you give me your [ELEMENT] or your [ELEMENT]?",
    note: "Use when asking for specific data like phone number or PIN.",
  },
  {
    id: "verif-003",
    speaker: "agent",
    phase: "verification",
    text: "FR: Pourriez-vous me fournir une information personnelle, comme votre [ÉLÉMENT], pour que je puisse poursuivre ?\nEN: Could you provide me with personal information, like your [ELEMENT], so that I can proceed?",
    note: "Use if the first verification attempt fails.",
    branchPoint: true,
  },

  // PHASE: DISCOVERY (Demander le problème)

  {
    id: "disc-001",
    speaker: "agent",
    phase: "discovery",
    text: "FR: Pourriez-vous m'expliquer la nature du problème que vous rencontrez ?\nEN: Could you explain the nature of the problem you are experiencing?",
    note: "First time asking for the issue.",
  },
  {
    id: "disc-002",
    speaker: "agent",
    phase: "discovery",
    text: "FR: Pourriez-vous me décrire plus en détail ce qui se passe ?\nEN: Could you describe in more detail what is happening?",
    note: "Use if you didn't understand their first explanation.",
    branchPoint: true,
  },
  {
    id: "disc-003",
    speaker: "agent",
    phase: "discovery",
    text: "FR: Afin que je puisse mieux vous aider, pourriez-vous me dire exactement ce qui ne fonctionne pas ?\nEN: So that I can help you better, could you tell me exactly what is not working?",
    note: "Use if the client is being vague or going off-topic.",
    branchPoint: true,
  },

  // PHASE: ACKNOWLEDGEMENT & REASSURANCE
  {
    id: "ack-001",
    speaker: "agent",
    phase: "acknowledgement",
    text: "FR: Si je résume bien, vous rencontrez les difficultés suivantes : [PROBLÈME]... ?\nEN: If I summarize correctly, you are experiencing the following difficulties: [PROBLEM]...?",
    note: "Best way to confirm you understood the issue.",
  },
  {
    id: "ack-002",
    speaker: "agent",
    phase: "acknowledgement",
    text: "FR: Je vois tout à fait de quoi il s'agit. Soyez assuré que nous mettons tout en œuvre pour une résolution rapide et efficace.\nEN: I fully understand what this is about. Rest assured that we are doing everything possible for a quick and effective resolution.",
    note: "Strong reassurance statement.",
  },
  {
    id: "ack-003",
    speaker: "agent",
    phase: "acknowledgement",
    text: "FR: Je vous remercie de m'avoir fourni toutes les informations nécessaires pour que nous puissions résoudre ce problème.\nEN: Thank you for providing me with all the necessary information so that we can resolve this problem.",
  },

  // PHASE: TROUBLESHOOTING (Action requise)
  {
    id: "trouble-001",
    speaker: "agent",
    phase: "troubleshooting",
    text: "FR: Pourriez-vous m'aider en effectuant cette démarche ?\nEN: Could you help me by performing this step?",
    note: "General troubleshooting, software-wise.",
  },
  {
    id: "trouble-002",
    speaker: "agent",
    phase: "troubleshooting",
    text: "FR: Pourriez-vous faire ceci pour nous s'il vous plaît ? (ex: vérifier le routeur)\nEN: Could you do this for us please? (e.g., check the router)",
    note: "Physical troubleshooting (checking cables, resetting hardware).",
    branchPoint: true,
  },

  // PHASE: HOLD ROUTINE (Attente)
  {
    id: "hold-001",
    speaker: "agent",
    phase: "hold",
    text: "FR: Laissez-moi consulter notre équipe de soutien. Laissez-moi vous mettre en attente pendant quelques minutes.\nEN: Let me consult with our support team. Let me put you on hold for a few minutes.",
  },
  {
    id: "hold-002",
    speaker: "agent",
    phase: "hold",
    text: "FR: Je reviendrai vers vous dans [X] minutes. Merci de patienter.\nEN: I will get back to you in [X] minutes. Thank you for your patience.",
  },
  {
    id: "hold-003",
    speaker: "agent",
    phase: "hold",
    text: "FR: Je vous remercie de votre patience pendant que je faisais les vérifications nécessaires pour votre dossier.\nEN: Thank you for your patience while I performed the necessary checks for your file.",
    note: "Use immediately after taking the client off hold.",
  },

  // PHASE: DE-ESCALATION (Désamorcer)
  {
    id: "deesc-001",
    speaker: "agent",
    phase: "de-escalation",
    text: "FR: Je comprends que vous soyez contrarié, voyons ensemble comment je peux apaiser la situation.\nEN: I understand that you are upset, let's see together how I can calm the situation.",
    note: "Use if the client arrives angry at the start of the call.",
    branchPoint: true,
  },
  {
    id: "deesc-002",
    speaker: "agent",
    phase: "de-escalation",
    text: "FR: Je suis désolé que votre expérience précédente n'ait pas été à la hauteur, permettez-moi de faire le nécessaire aujourd'hui.\nEN: I am sorry that your previous experience was not up to par, allow me to do what is necessary today.",
    note: "Use if the client complains about bad service from a previous agent.",
    branchPoint: true,
  },
  {
    id: "deesc-003",
    speaker: "agent",
    phase: "de-escalation",
    text: "FR: Je vois que nous avons déjà tenté de résoudre ce souci, explorons immédiatement une nouvelle solution pour y mettre un terme.\nEN: I see that we have already tried to resolve this issue, let's explore a new solution immediately to put an end to it.",
    note: "Use for repeat callers whose issue persists.",
    branchPoint: true,
  },
  {
    id: "deesc-004",
    speaker: "agent",
    phase: "de-escalation",
    text: "FR: Je comprends parfaitement votre mécontentement face à cette situation. Soyez assuré que nous mettons tout en œuvre pour corriger cette erreur.\nEN: I perfectly understand your dissatisfaction with this situation. Rest assured that we are doing everything to correct this mistake.",
    note: "Formal apology for a Telus system/billing error.",
  },

  // PHASE: BOUNDARIES & CLOSING
  {
    id: "close-001",
    speaker: "agent",
    phase: "boundaries",
    text: "FR: Je suis navré, je ne peux pas faire cela.\nEN: I am sorry, I cannot do that.",
    note: "Use when the client asks for private info you cannot share.",
    branchPoint: true,
  },
  {
    id: "close-002",
    speaker: "agent",
    phase: "closing",
    text: "FR: Avez-vous besoin d'autre chose ?\nEN: Do you need anything else?",
  },
  {
    id: "close-003",
    speaker: "agent",
    phase: "closing",
    text: "FR: Je vous souhaite une excellente journée. Au revoir.\nEN: I wish you an excellent day. Goodbye.",
  },
  {
    id: "bridge-001",
    speaker: "agent",
    phase: "troubleshooting",
    text: "FR: Laissez-moi vérifier cela pour vous.\nEN: Let me look into that for you.",
    note: "Bridge between discovery and action — buys you time to check the system.",
  },
  {
    id: "hold-return-001", 
    speaker: "agent",
    phase: "hold",
    text: "FR: Merci pour votre patience. J'ai trouvé la solution.\nEN: Thank you for your patience. I have found the solution.",
    note: "Use immediately after returning from hold with an answer.",
  },
  {
    id: "resolution-001",
    speaker: "agent",
    phase: "closing",
    text: "FR: J'ai bien résolu votre problème. Voici ce que j'ai fait : [ACTION].\nEN: I have resolved your issue. Here is what I did: [ACTION].",
    note: "Always confirm what was done before closing.",
  },
];