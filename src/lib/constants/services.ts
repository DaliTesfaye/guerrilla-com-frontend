export type Service = {
  id: string;
  name: string;
  description: string;
  iconKey: string;
};

export const SERVICES: Service[] = [
  {
    id: "street-marketing",
    name: "Street Marketing",
    description: "Levier de visibilité incontournable pour les marques, le recours au Street Marketing est souvent une des meilleures approches pour toucher un grand nombre de personnes via des activations dans la rue et les lieux publique",
    iconKey: "megaphone",
  },
  {
    id: "Evénementiel",
    name: "Evénementiel",
    description: "Notre équipe d'experts en événementiel possède une vaste expérience dans la planification et l'organisation de divers types d'événements, tels que des conférences, des salons professionnels",
    iconKey: "party-popper",
  },
  {
    id: "animation-gms",
    name: "Animation GMS",
    description: "Guerrilla Com est experte dans le domaine. En fonction de vos objectifs, nous vous proposons la stratégie et l’activation appropriée",
    iconKey: "shopping-bag",
  },
  {
    id: "Team Building",
    name: "Team Building",
    description: "Ce format d’actions est de plus en plus en vogue chez les entreprises tous secteurs et tailles confondus. Organiser des team building permet de tisser des liens d’appartenances forts à l’entreprise, renforcer la cohésion d’équipes",
    iconKey: "users-round",
  },
  {
    id: "PLV",
    name: "PLV",
    description: "Nous offrons une gamme complète de services de PLV pour aider les entreprises à promouvoir leurs produits et services , en créant des présentoirs et des supports de communication attractifs et efficaces",
    iconKey: "monitor",
  },
  {
    id: "Gifts Promotionnels",
    name: "Gifts Promotionnels",
    description: "Vous avez certainement vu ou même acheté certains des gadgets que nous avons introduits en Tunisie pour des opérations de promotions pour des leaders nationaux en FMCG.",
    iconKey: "gift",
  },
];
