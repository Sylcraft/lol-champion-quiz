export type Role = "Fighter" | "Tank" | "Mage" | "Assassin" | "Support" | "Marksman";

export type QuizOption = {
  id: string;
  text: string;
  scores: Partial<Record<Role, number>>;
};

export type QuizQuestion = {
  id: string;
  prompt: string;
  options: QuizOption[];
  focusRoles: Role[];
};

export const ROLES: Role[] = ["Fighter", "Tank", "Mage", "Assassin", "Support", "Marksman"];

export const QUESTIONS: QuizQuestion[] = [
  {
    id: "q1_lane",
    prompt: "En game, ton lane ideal ?",
    focusRoles: ["Fighter", "Tank", "Mage", "Assassin", "Support", "Marksman"],
    options: [
      { id: "top", text: "Top, duel sans pitie", scores: { Fighter: 3, Tank: 2 } },
      { id: "mid", text: "Mid, playmaking et impact", scores: { Mage: 3, Assassin: 2 } },
      { id: "bot", text: "Bot, scaling et teamfights", scores: { Marksman: 3, Support: 2 } },
      { id: "jungle", text: "Jungle, partout sur la map", scores: { Assassin: 2, Fighter: 2, Tank: 1 } },
    ],
  },
  {
    id: "q2_fight_start",
    prompt: "Un teamfight demarre. Ton premier reflexe ?",
    focusRoles: ["Tank", "Assassin", "Mage", "Support"],
    options: [
      { id: "engage", text: "J engage, full confiance", scores: { Tank: 3, Fighter: 2 } },
      { id: "flank", text: "Je flank pour supprimer un carry", scores: { Assassin: 3 } },
      { id: "poke", text: "Je poke et zone avant d entrer", scores: { Mage: 3 } },
      { id: "peel", text: "Je protege les miens", scores: { Support: 3, Tank: 1 } },
    ],
  },
  {
    id: "q3_risk",
    prompt: "Ton rapport au risque ?",
    focusRoles: ["Assassin", "Mage", "Marksman", "Tank"],
    options: [
      { id: "allin", text: "All-in ou rien", scores: { Assassin: 3, Fighter: 1 } },
      { id: "smart", text: "Calcule, propre, efficace", scores: { Mage: 2, Marksman: 2 } },
      { id: "safe", text: "Safe et discipline", scores: { Tank: 2, Support: 2 } },
    ],
  },
  {
    id: "q4_power_spike",
    prompt: "Tu preferes etre fort quand ?",
    focusRoles: ["Assassin", "Fighter", "Mage", "Marksman", "Tank", "Support"],
    options: [
      { id: "early", text: "Tres tot, snowball", scores: { Assassin: 2, Fighter: 2 } },
      { id: "mid", text: "Mid game, timing objectifs", scores: { Mage: 2, Support: 1, Fighter: 1 } },
      { id: "late", text: "Late game, je deviens un boss", scores: { Marksman: 3, Tank: 1 } },
    ],
  },
  {
    id: "q5_team_role",
    prompt: "Ton equipe attend quoi de toi ?",
    focusRoles: ["Tank", "Support", "Mage", "Marksman"],
    options: [
      { id: "frontline", text: "Une frontline solide", scores: { Tank: 3 } },
      { id: "utility", text: "Vision, peel, setup", scores: { Support: 3 } },
      { id: "damage", text: "Du gros DPS constant", scores: { Marksman: 3 } },
      { id: "burst", text: "Du burst et du controle", scores: { Mage: 3 } },
    ],
  },
  {
    id: "q6_style",
    prompt: "Ton style mecanique ?",
    focusRoles: ["Assassin", "Marksman", "Tank", "Support"],
    options: [
      { id: "combo", text: "Combos rapides et precis", scores: { Assassin: 2, Mage: 1 } },
      { id: "kiting", text: "Kiting et spacing", scores: { Marksman: 3 } },
      { id: "timing", text: "Timing engage/cc", scores: { Tank: 2, Support: 1 } },
      { id: "macro", text: "Macro et decisions", scores: { Support: 2, Fighter: 1 } },
    ],
  },
  {
    id: "q7_mental",
    prompt: "Quand tu es en retard, tu...",
    focusRoles: ["Support", "Tank", "Assassin", "Mage"],
    options: [
      { id: "calm", text: "Reste utile avec vision/utility", scores: { Support: 3 } },
      { id: "force", text: "Force un play pour revenir", scores: { Assassin: 2, Fighter: 1 } },
      { id: "scale", text: "Farm et scaling tranquille", scores: { Marksman: 2, Mage: 2 } },
      { id: "protect", text: "Je joue pour mon carry", scores: { Tank: 2, Support: 1 } },
    ],
  },
  {
    id: "q8_objective",
    prompt: "Objectif neutre conteste: ta priorite ?",
    focusRoles: ["Tank", "Support", "Assassin", "Mage"],
    options: [
      { id: "zone", text: "Zoner l acces", scores: { Tank: 2, Mage: 1 } },
      { id: "pick", text: "Trouver un pick avant", scores: { Assassin: 3 } },
      { id: "secure", text: "Securiser smite/tempo", scores: { Fighter: 2, Tank: 1 } },
      { id: "cover", text: "Couvrir la backline", scores: { Support: 2, Marksman: 1 } },
    ],
  },
  {
    id: "q9_fun",
    prompt: "Ce qui te fait le plus kiffer ?",
    focusRoles: ["Assassin", "Mage", "Marksman", "Support"],
    options: [
      { id: "outplay", text: "Outplay 1v2", scores: { Assassin: 3 } },
      { id: "skillshot", text: "Toucher un skillshot clutch", scores: { Mage: 3 } },
      { id: "penta", text: "Nettoyer un fight en DPS", scores: { Marksman: 3 } },
      { id: "save", text: "Sauver un allie a 1 HP", scores: { Support: 3 } },
    ],
  },
  {
    id: "q10_call",
    prompt: "En vocal, tu es plutot...",
    focusRoles: ["Tank", "Support", "Fighter", "Mage"],
    options: [
      { id: "caller", text: "Shotcaller principal", scores: { Tank: 2, Support: 2 } },
      { id: "silent", text: "Focus gameplay avant tout", scores: { Marksman: 2, Assassin: 1 } },
      { id: "setup", text: "Annonce mes timings et setups", scores: { Mage: 2, Fighter: 1 } },
    ],
  },
  {
    id: "q11_teamfight_pos",
    prompt: "Ta position favorite en fight ?",
    focusRoles: ["Marksman", "Mage", "Tank", "Assassin"],
    options: [
      { id: "front", text: "Frontline", scores: { Tank: 3, Fighter: 1 } },
      { id: "back", text: "Backline safe", scores: { Marksman: 3 } },
      { id: "side", text: "Sur le cote pour angle", scores: { Mage: 2, Assassin: 1 } },
      { id: "behind", text: "Derriere eux pour flank", scores: { Assassin: 3 } },
    ],
  },
  {
    id: "q12_mood",
    prompt: "Ton mood en ranked ?",
    focusRoles: ["Support", "Fighter", "Mage", "Assassin"],
    options: [
      { id: "leader", text: "On gagne ensemble", scores: { Support: 2, Tank: 1 } },
      { id: "carry", text: "Je dois carry cette game", scores: { Fighter: 2, Assassin: 2 } },
      { id: "brain", text: "Je joue la map intelligemment", scores: { Mage: 2, Support: 1 } },
      { id: "tempo", text: "Je joue le tempo des objectifs", scores: { Fighter: 1, Tank: 1, Marksman: 1 } },
    ],
  },
  {
    id: "q13_conflict",
    prompt: "Quand un conflit apparait dans un groupe, tu fais quoi ?",
    focusRoles: ["Support", "Tank", "Mage", "Assassin"],
    options: [
      { id: "mediate", text: "Je calme le jeu et je reconnecte tout le monde", scores: { Support: 3 } },
      { id: "decide", text: "Je tranche vite pour eviter de perdre du temps", scores: { Tank: 2, Fighter: 1 } },
      { id: "analyze", text: "Je cherche la cause exacte du probleme", scores: { Mage: 3 } },
      { id: "shock", text: "Je provoque pour faire reagir", scores: { Assassin: 2, Fighter: 1 } },
    ],
  },
  {
    id: "q14_weekend",
    prompt: "Ton weekend ideal ressemble a quoi ?",
    focusRoles: ["Fighter", "Mage", "Support", "Marksman"],
    options: [
      { id: "adventure", text: "Sortie improvisee et energie a fond", scores: { Fighter: 3, Assassin: 1 } },
      { id: "cozy", text: "Moments calmes avec mes proches", scores: { Support: 3 } },
      { id: "learn", text: "Explorer une passion ou apprendre quelque chose", scores: { Mage: 3 } },
      { id: "reset", text: "Recharge complete pour etre en forme lundi", scores: { Marksman: 2, Tank: 1 } },
    ],
  },
  {
    id: "q15_pressure",
    prompt: "Sous pression, tu deviens plutot...",
    focusRoles: ["Tank", "Assassin", "Mage", "Marksman"],
    options: [
      { id: "cold", text: "Froid et ultra concentre", scores: { Assassin: 2, Marksman: 1 } },
      { id: "leader", text: "Directif et rassurant", scores: { Tank: 2, Support: 1 } },
      { id: "method", text: "Methodique, etape par etape", scores: { Mage: 2, Marksman: 1 } },
      { id: "heart", text: "Empathique, je soutiens le groupe", scores: { Support: 2, Fighter: 1 } },
    ],
  },
  {
    id: "q16_choice",
    prompt: "Pour prendre une decision importante, tu suis surtout...",
    focusRoles: ["Mage", "Support", "Fighter", "Assassin"],
    options: [
      { id: "logic", text: "Les faits et la logique", scores: { Mage: 3 } },
      { id: "values", text: "Mes valeurs et l impact humain", scores: { Support: 3 } },
      { id: "instinct", text: "Mon instinct immediat", scores: { Assassin: 2, Fighter: 1 } },
      { id: "experience", text: "Ce qui a deja marche avant", scores: { Tank: 2, Marksman: 1 } },
    ],
  },
  {
    id: "q17_group_role",
    prompt: "Dans un projet d equipe, ton role naturel ?",
    focusRoles: ["Support", "Tank", "Mage", "Marksman"],
    options: [
      { id: "organizer", text: "Coordonner les gens et garder le cap", scores: { Support: 2, Tank: 1 } },
      { id: "executor", text: "Executer vite et proprement", scores: { Marksman: 3 } },
      { id: "strategist", text: "Designer la strategie globale", scores: { Mage: 3 } },
      { id: "driver", text: "Pousser le groupe vers l action", scores: { Fighter: 2, Tank: 1 } },
    ],
  },
  {
    id: "q18_surprise",
    prompt: "Face a un changement inattendu, tu...",
    focusRoles: ["Assassin", "Tank", "Mage", "Support"],
    options: [
      { id: "adapt", text: "Je pivote instantanement", scores: { Assassin: 2, Fighter: 1 } },
      { id: "stabilize", text: "Je securise la situation avant tout", scores: { Tank: 3 } },
      { id: "model", text: "Je fais un plan B structure", scores: { Mage: 3 } },
      { id: "supportive", text: "Je m assure que personne ne decroche", scores: { Support: 3 } },
    ],
  },
  {
    id: "q19_success",
    prompt: "Ta definition d une vraie reussite ?",
    focusRoles: ["Marksman", "Support", "Mage", "Fighter"],
    options: [
      { id: "mastery", text: "La maitrise technique", scores: { Marksman: 2, Mage: 1 } },
      { id: "impact", text: "Avoir un impact concret sur les autres", scores: { Support: 3 } },
      { id: "vision", text: "Construire une vision long terme", scores: { Mage: 2, Tank: 1 } },
      { id: "win", text: "Atteindre l objectif coute que coute", scores: { Fighter: 2, Assassin: 1 } },
    ],
  },
  {
    id: "q20_energy",
    prompt: "Ce qui recharge le plus ton energie ?",
    focusRoles: ["Support", "Assassin", "Mage", "Tank"],
    options: [
      { id: "people", text: "Discuter avec des gens que j apprecie", scores: { Support: 3 } },
      { id: "solo", text: "Un moment solo intense", scores: { Assassin: 2, Marksman: 1 } },
      { id: "curiosity", text: "Lire, apprendre, comprendre", scores: { Mage: 3 } },
      { id: "routine", text: "Une routine stable et saine", scores: { Tank: 2, Fighter: 1 } },
    ],
  },
  {
    id: "q21_detail_vs_big",
    prompt: "Tu preferes travailler sur...",
    focusRoles: ["Marksman", "Mage", "Fighter", "Support"],
    options: [
      { id: "details", text: "Les details qui font la difference", scores: { Marksman: 3 } },
      { id: "big_picture", text: "La vision d ensemble", scores: { Mage: 2, Tank: 1 } },
      { id: "delivery", text: "La production rapide de resultat", scores: { Fighter: 2, Assassin: 1 } },
      { id: "alignment", text: "La cohesion entre les personnes", scores: { Support: 3 } },
    ],
  },
  {
    id: "q22_signature",
    prompt: "Ton trait de personnalite le plus fort ?",
    focusRoles: ["Tank", "Support", "Assassin", "Mage", "Marksman", "Fighter"],
    options: [
      { id: "resilience", text: "La resilience", scores: { Tank: 3 } },
      { id: "empathy", text: "L empathie", scores: { Support: 3 } },
      { id: "audacity", text: "L audace", scores: { Assassin: 2, Fighter: 1 } },
      { id: "clarity", text: "La clarte d esprit", scores: { Mage: 2, Marksman: 1 } },
    ],
  },
];

export const QUESTION_BY_ID = new Map(QUESTIONS.map((q) => [q.id, q]));
