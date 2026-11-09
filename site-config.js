/* Configuration centrale DarbDev : identité, contenus réutilisables et données de démonstration. */
window.DARBDEV_CONFIG = {
  company: {
    name: "Felix Softwares",
    city: "Casablanca, Maroc",
    email: "bonjour@darbdev.fr",
    phone: "07 82 42 56 51",
    whatsapp: "212782425651",
    whatsapp2: "212782425651"
  },
  theme: {
    primary: "#2A5A66",
    accent: "#408380",
    fontDisplay: "Space Grotesk",
    fontBody: "DM Sans"
  },
  services: [
    {
      number: "01",
      category: "Web · visibilité · conversion",
      title: "Création de sites web professionnels",
      summary: "Des sites rapides, accessibles et distinctifs qui transforment votre présence en ligne en levier commercial.",
      problem: "Votre site ne reflète plus la qualité de votre offre ou ne transforme pas assez de visiteurs en contacts.",
      deliverables: "Stratégie de contenu, UX/UI, développement responsive, SEO technique et suivi des performances.",
      tech: ["HTML/CSS", "JavaScript", "CMS"],
      outcome: "Une présence claire, crédible et conçue pour convertir.",
      anchor: "solution-web"
    },
    {
      number: "02",
      category: "Mobile · web app · expérience",
      title: "Applications mobiles et web",
      summary: "Des expériences intuitives, de la première interaction au geste quotidien qui fidélise.",
      problem: "Vos utilisateurs jonglent entre trop d'outils ou abandonnent un parcours trop complexe.",
      deliverables: "Parcours utilisateur, prototype, application responsive ou mobile et accompagnement au lancement.",
      tech: ["JavaScript", "API", "PWA"],
      outcome: "Un service disponible partout et simple à adopter.",
      anchor: "solution-app"
    },
    {
      number: "03",
      category: "Desktop · outils métier",
      title: "Logiciels desktop",
      summary: "Des outils métier puissants et fiables, conçus pour exploiter pleinement vos données et vos opérations.",
      problem: "Un logiciel historique ralentit vos équipes ou ne suit plus la réalité de votre activité.",
      deliverables: "Cadrage fonctionnel, architecture, développement, tests et déploiement sécurisé.",
      tech: ["Electron", ".NET", "PostgreSQL"],
      outcome: "Des opérations plus fiables, avec moins de tâches répétitives.",
      anchor: "solution-desktop"
    },
    {
      number: "04",
      category: "ERP · CRM · pilotage",
      title: "ERP et CRM pour entreprises",
      summary: "Nous connectons vos informations et vos métiers pour rendre les décisions plus rapides et les opérations plus sereines.",
      problem: "Vos données sont dispersées et vos équipes perdent du temps à reconstituer la bonne information.",
      deliverables: "Audit des flux, paramétrage, développements sur mesure, migration et formation.",
      tech: ["Odoo", "Python", "CRM"],
      outcome: "Une vision partagée de l'activité et des décisions mieux informées.",
      anchor: "solution-erp"
    },
    {
      number: "05",
      category: "Sur mesure · restauration · médical",
      title: "Solutions métiers",
      summary: "Restauration, médical, industrie ou services : nous façonnons les outils que vos réalités particulières réclament.",
      problem: "Les outils standards imposent leurs règles alors que votre métier a besoin de ses propres raccourcis.",
      deliverables: "Immersion métier, conception sur mesure, intégrations, formation et amélioration continue.",
      tech: ["API", "Automatisation", "Cloud"],
      outcome: "Un avantage opérationnel construit autour de vos usages réels.",
      anchor: "solution-metiers"
    },
    {
      number: "06",
      category: "UX/UI · produit digital",
      title: "Design UX/UI et systèmes d'interface",
      summary: "Nous clarifions les parcours et construisons une interface cohérente, utile et prête à évoluer.",
      problem: "Votre produit s'enrichit mais devient difficile à comprendre, à maintenir ou à faire adopter.",
      deliverables: "Audit UX, architecture de l'information, design system, prototype et règles d'interface.",
      tech: ["Figma", "Design system", "Prototypage"],
      outcome: "Une expérience plus lisible pour vos utilisateurs et vos équipes.",
      anchor: "solution-design"
    }
  ],
  projects: [
    {
      title: "Portail Atlas",
      description: "Portail web de pilotage des opérations, pensé pour réunir les équipes et leurs indicateurs.",
      member: "Saad Mriki",
      tech: ["HTML/CSS", "JavaScript", "Node.js"],
      repoUrl: "https://github.com/Saad-mrk",
      liveUrl: "",
      image: "",
      category: "Web"
    },
    {
      title: "Nova Mobile",
      description: "Application mobile de suivi et de notifications, conçue autour d'un parcours utilisateur très court.",
      member: "Mohammed Bourass",
      tech: ["Flutter", "Firebase", "UX/UI"],
      repoUrl: "https://github.com/mohammedbourass-youssef",
      liveUrl: "",
      image: "",
      category: "Mobile"
    },
    {
      title: "Flux ERP",
      description: "Outil métier pour centraliser les flux, automatiser les tâches et fiabiliser les décisions quotidiennes.",
      member: "Taoufiq Rahioui",
      tech: ["Odoo", "Python", "PostgreSQL"],
      repoUrl: "https://github.com/TAOUFIK0",
      liveUrl: "",
      image: "",
      category: "ERP"
    }
  ]
};
