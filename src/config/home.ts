/** Les deux décors sont conservés pour comparer les versions de l’accueil. */
export const heroBackgrounds = {
  stairway: {
    src: "/images/stairway-glory.png",
    alt: "Un escalier blanc s’élève à travers les nuages vers une lumière rayonnante, symbole de la gloire de Dieu au terme du chemin.",
  },
  garden: {
    src: "/images/generated/hero-garden-arch-airy.png",
    alt: "Une arche de fleurs ivoire et de feuillage d’olivier encadre un jardin baigné de lumière dorée au lever du soleil.",
  },
} as const;

/** Identité et navigation du site public. Les récits et photos sont dans public-content.ts. */
export const home = {
  portrait: {
    src: "/images/generated/ange-cedric-transparent.png",
    alt: "Ange et Cédric enlacés, en tenues blanches décontractées sur fond transparent.",
  },
  heroVerses: [
    { text: "C’est pourquoi l’homme quittera son père et sa mère, et s’attachera à sa femme, et ils deviendront une seule chair.", reference: "Genèse 2:24", url: "https://fr.wikisource.org/wiki/Bible_Segond_1910/Genèse", excerpt: false },
    { text: "Deux valent mieux qu’un […] Car, s’ils tombent, l’un relève son compagnon […] et la corde à trois fils ne se rompt pas facilement.", reference: "Ecclésiaste 4:9-12", url: "https://fr.wikisource.org/wiki/Bible_Segond_1910/Ecclésiaste", excerpt: true },
  ],
  // Courts extraits AELF ; sélection proposée pour validation par le couple.
  verses: [
    { text: "Par-dessus tout cela, ayez l’amour, qui est le lien le plus parfait.", reference: "Colossiens 3, 14", url: "https://www.aelf.org/bible/Col/3" },
    { text: "L’amour ne passera jamais.", reference: "1 Corinthiens 13, 8", url: "https://www.aelf.org/bible/1Co/13" },
  ],
  memories: ["Nos sourires", "À deux", "Notre complicité", "Nos instants", "Nos souvenirs"],
  navigation: [
    { href: "#accueil", label: "Accueil" },
    { href: "#histoire", label: "Notre histoire" },
    { href: "#famille", label: "Notre famille" },
    { href: "#foi", label: "Unis dans la foi" },
    { href: "#grand-jour", label: "Le grand jour" },
    { href: "#infos", label: "Informations pratiques" },
  ],
  background: heroBackgrounds.garden,
} as const;
