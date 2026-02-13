export type Axis = "audace" | "lead" | "social" | "patience" | "creativity" | "calm" | "ambition" | "empathy";

export const AXES: Axis[] = ["audace", "lead", "social", "patience", "creativity", "calm", "ambition", "empathy"];

export type QuizOption = {
  id: string;
  text: string;
  scores: Partial<Record<Axis, number>>;
};

export type QuizQuestion = {
  id: string;
  prompt: string;
  options: QuizOption[];
  tags: Axis[];
};

export const QUESTIONS: QuizQuestion[] = [
  {
    id: "q01_first_impression",
    prompt: "Quand tu arrives dans un nouveau groupe, ton premier reflexe est...",
    tags: ["social", "lead", "calm"],
    options: [
      { id: "break_ice", text: "Lancer une blague pour briser la glace", scores: { social: 2, audace: 1 } },
      { id: "observe", text: "Observer l ambiance avant de parler", scores: { calm: 2, patience: 1 } },
      { id: "organize", text: "Prendre vite un role utile", scores: { lead: 2, ambition: 1 } },
    ],
  },
  {
    id: "q02_decision_style",
    prompt: "Quand tu dois prendre une decision importante...",
    tags: ["calm", "creativity", "ambition"],
    options: [
      { id: "instinct", text: "Tu suis ton instinct", scores: { audace: 2, creativity: 1 } },
      { id: "facts", text: "Tu peses les faits calmement", scores: { calm: 2, patience: 1 } },
      { id: "impact", text: "Tu choisis ce qui te fera progresser", scores: { ambition: 2, lead: 1 } },
      { id: "human", text: "Tu privilegies l impact humain", scores: { empathy: 2, social: 1 } },
    ],
  },
  {
    id: "q03_conflict",
    prompt: "Un conflit eclate autour de toi. Tu...",
    tags: ["empathy", "lead", "audace"],
    options: [
      { id: "mediate", text: "Joues le mediateur", scores: { empathy: 2, social: 1 } },
      { id: "frame", text: "Recadres et fixes une direction", scores: { lead: 2, calm: 1 } },
      { id: "confront", text: "Confrontes directement le probleme", scores: { audace: 2, ambition: 1 } },
    ],
  },
  {
    id: "q04_deadline",
    prompt: "Face a une deadline tres courte...",
    tags: ["ambition", "calm", "patience"],
    options: [
      { id: "sprint", text: "Tu acceleres et improvises", scores: { ambition: 2, audace: 1 } },
      { id: "plan", text: "Tu fais un mini plan et tu executes", scores: { calm: 2, lead: 1 } },
      { id: "chunk", text: "Tu decoupes en petites taches", scores: { patience: 2, calm: 1 } },
      { id: "help", text: "Tu demandes un coup de main utile", scores: { social: 2, empathy: 1 } },
    ],
  },
  {
    id: "q05_creativity",
    prompt: "Ton rapport a la creativite ?",
    tags: ["creativity", "audace", "patience"],
    options: [
      { id: "wild", text: "Tu adores les idees hors cadre", scores: { creativity: 2, audace: 1 } },
      { id: "craft", text: "Tu preferes peaufiner une bonne idee", scores: { creativity: 1, patience: 2 } },
      { id: "practical", text: "Tu restes pratique avant tout", scores: { calm: 2, ambition: 1 } },
    ],
  },
  {
    id: "q06_pressure",
    prompt: "Sous pression, tu deviens plutot...",
    tags: ["calm", "lead", "social"],
    options: [
      { id: "ice", text: "Froid et precis", scores: { calm: 2, patience: 1 } },
      { id: "captain", text: "Directif et rassurant", scores: { lead: 2, empathy: 1 } },
      { id: "spark", text: "Energique et motive", scores: { social: 2, ambition: 1 } },
    ],
  },
  {
    id: "q07_risk",
    prompt: "Ton attitude face au risque ?",
    tags: ["audace", "patience", "calm"],
    options: [
      { id: "all_in", text: "Tu tentes ta chance sans hesiter", scores: { audace: 2, ambition: 1 } },
      { id: "measured", text: "Tu prends des risques calcules", scores: { calm: 2, audace: 1 } },
      { id: "safe", text: "Tu privilegies la securite", scores: { patience: 2, calm: 1 } },
    ],
  },
  {
    id: "q08_team_role",
    prompt: "Dans un projet d equipe, tu es le plus souvent...",
    tags: ["lead", "social", "creativity"],
    options: [
      { id: "pilot", text: "Le pilote qui donne la direction", scores: { lead: 2, ambition: 1 } },
      { id: "glue", text: "Le lien entre les personnes", scores: { social: 2, empathy: 1 } },
      { id: "inventor", text: "Le cerveau d idees", scores: { creativity: 2, audace: 1 } },
      { id: "finisher", text: "Celui qui termine proprement", scores: { patience: 2, calm: 1 } },
    ],
  },
  {
    id: "q09_motivation",
    prompt: "Ce qui te motive le plus au quotidien ?",
    tags: ["ambition", "empathy", "creativity"],
    options: [
      { id: "win", text: "Atteindre des objectifs eleves", scores: { ambition: 2, lead: 1 } },
      { id: "meaning", text: "Aider et avoir de l impact", scores: { empathy: 2, social: 1 } },
      { id: "build", text: "Creer quelque chose de nouveau", scores: { creativity: 2, audace: 1 } },
    ],
  },
  {
    id: "q10_change",
    prompt: "Un changement de plan de derniere minute te fait...",
    tags: ["calm", "patience", "audace"],
    options: [
      { id: "excited", text: "Sourire, tu adores pivoter vite", scores: { audace: 2, creativity: 1 } },
      { id: "steady", text: "Rester calme et replanifier", scores: { calm: 2, lead: 1 } },
      { id: "annoyed", text: "Raler un peu puis t adapter", scores: { patience: 1, ambition: 1 } },
    ],
  },
  {
    id: "q11_energy_source",
    prompt: "Ce qui recharge le plus ton energie ?",
    tags: ["social", "calm", "creativity"],
    options: [
      { id: "people", text: "Les moments avec les autres", scores: { social: 2, empathy: 1 } },
      { id: "solo", text: "Du temps seul, au calme", scores: { calm: 2, patience: 1 } },
      { id: "projects", text: "Un nouveau projet excitant", scores: { creativity: 2, ambition: 1 } },
      { id: "challenge", text: "Un challenge qui pique", scores: { audace: 2, ambition: 1 } },
    ],
  },
  {
    id: "q12_feedback",
    prompt: "Quand on te fait un feedback critique...",
    tags: ["calm", "ambition", "empathy"],
    options: [
      { id: "reflect", text: "Tu ecoutes puis tu ajustes", scores: { calm: 2, ambition: 1 } },
      { id: "debate", text: "Tu debates si tu n es pas d accord", scores: { lead: 1, audace: 1 } },
      { id: "take_hard", text: "Tu le prends a coeur", scores: { empathy: 2, patience: 1 } },
    ],
  },
  {
    id: "q13_weekend",
    prompt: "Ton week-end ideal ?",
    tags: ["social", "calm", "ambition"],
    options: [
      { id: "friends", text: "Sortie entre amis", scores: { social: 2, audace: 1 } },
      { id: "cocoon", text: "Repos et ambiance chill", scores: { calm: 2, patience: 1 } },
      { id: "side_project", text: "Avancer sur un projet perso", scores: { ambition: 2, creativity: 1 } },
    ],
  },
  {
    id: "q14_fail",
    prompt: "Quand tu echoues sur quelque chose...",
    tags: ["patience", "ambition", "calm"],
    options: [
      { id: "retry_fast", text: "Tu retentes tout de suite", scores: { ambition: 2, audace: 1 } },
      { id: "analyze", text: "Tu analyses avant de recommencer", scores: { calm: 2, patience: 1 } },
      { id: "step_back", text: "Tu prends du recul puis tu reviens", scores: { patience: 2, calm: 1 } },
    ],
  },
  {
    id: "q15_group_decision",
    prompt: "Si un groupe n arrive pas a choisir...",
    tags: ["lead", "empathy", "social"],
    options: [
      { id: "decide_now", text: "Tu proposes une decision claire", scores: { lead: 2, ambition: 1 } },
      { id: "collect", text: "Tu fais parler tout le monde", scores: { empathy: 2, social: 1 } },
      { id: "test", text: "Tu proposes de tester rapidement", scores: { audace: 2, creativity: 1 } },
    ],
  },
  {
    id: "q16_attention",
    prompt: "Tu preferes travailler sur...",
    tags: ["patience", "creativity", "ambition"],
    options: [
      { id: "details", text: "Les details qui font la qualite", scores: { patience: 2, calm: 1 } },
      { id: "big_picture", text: "La vision d ensemble", scores: { creativity: 2, lead: 1 } },
      { id: "results", text: "Le resultat concret rapidement", scores: { ambition: 2, audace: 1 } },
    ],
  },
  {
    id: "q17_values",
    prompt: "Le trait que tu valorises le plus chez les autres ?",
    tags: ["empathy", "calm", "ambition"],
    options: [
      { id: "kind", text: "La bienveillance", scores: { empathy: 2, social: 1 } },
      { id: "reliable", text: "La fiabilite", scores: { calm: 2, patience: 1 } },
      { id: "drive", text: "La determination", scores: { ambition: 2, lead: 1 } },
      { id: "bold", text: "Le courage", scores: { audace: 2, ambition: 1 } },
    ],
  },
  {
    id: "q18_communication",
    prompt: "Ton style de communication naturel ?",
    tags: ["social", "lead", "calm"],
    options: [
      { id: "direct", text: "Direct et concis", scores: { lead: 2, calm: 1 } },
      { id: "warm", text: "Chaleureux et attentionne", scores: { social: 2, empathy: 1 } },
      { id: "measured", text: "Pose et nuance", scores: { calm: 2, patience: 1 } },
    ],
  },
  {
    id: "q19_opportunity",
    prompt: "Une opportunite inattendue se presente. Tu...",
    tags: ["audace", "ambition", "calm"],
    options: [
      { id: "jump", text: "Sautes dessus", scores: { audace: 2, ambition: 1 } },
      { id: "verify", text: "Verifies vite les risques", scores: { calm: 2, patience: 1 } },
      { id: "consult", text: "Demandes un avis de confiance", scores: { social: 1, empathy: 2 } },
    ],
  },
  {
    id: "q20_legacy",
    prompt: "Tu aimerais etre reconnu pour...",
    tags: ["ambition", "empathy", "creativity"],
    options: [
      { id: "achievements", text: "Tes accomplissements", scores: { ambition: 2, lead: 1 } },
      { id: "people", text: "L impact positif sur les gens", scores: { empathy: 2, social: 1 } },
      { id: "ideas", text: "Tes idees originales", scores: { creativity: 2, audace: 1 } },
    ],
  },
];

const ids = QUESTIONS.map((question) => question.id);
const uniqueIds = new Set(ids);
if (ids.length !== uniqueIds.size) {
  throw new Error("Duplicate question IDs detected in QUESTIONS");
}

export const QUESTION_BY_ID = new Map(QUESTIONS.map((question) => [question.id, question]));
