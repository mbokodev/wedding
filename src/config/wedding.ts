/**
 * ============================================================
 * CONFIGURATION CENTRALE DU MARIAGE
 * ============================================================
 * Tout le contenu du site public est défini ici :
 * textes, dates, lieux, programme, images, contacts…
 *
 * Pour personnaliser le site, modifiez UNIQUEMENT ce fichier
 * (et remplacez les images dans /public/images).
 * ============================================================
 */

export const wedding = {
  /** Identité du couple */
  couple: {
    partner1: "Ange",
    partner2: "Cédric",
    /** Affichage combiné, ex: "Ange & Cédric" */
    displayName: "Ange & Cédric",
    initials: "A & C",
  },

  /** Date et heure du début de la cérémonie (heure locale de Douala, UTC+1) */
  date: {
    iso: "2026-12-28T14:00:00+01:00",
    /** Texte affiché sur le site */
    display: "28 décembre 2026",
    displayShort: "28 . 12 . 2026",
  },

  /** Lieu principal (affiché dans le hero) */
  location: {
    city: "Douala",
    country: "Cameroun",
    display: "Douala, Cameroun",
  },

  /** Textes principaux */
  texts: {
    heroTagline: "Deux cœurs, une seule promesse",
    heroSubtitle:
      "Nous avons l'immense joie de vous convier à la célébration de notre union.",
    storyIntro:
      "Chaque grande histoire commence par un simple regard. Voici la nôtre.",
    invitationMessage:
      "ont le plaisir de vous inviter à la célébration de leur mariage.",
    footerQuote: "L'amour ne se voit pas avec les yeux, mais avec le cœur.",
  },

  /** Notre histoire — chapitres */
  story: [
    {
      year: "2019",
      title: "La rencontre",
      text: "Un après-midi ensoleillé à Douala, au détour d'un café entre amis communs. Un sourire échangé, une conversation qui ne voulait pas s'arrêter — et le sentiment étrange de se connaître depuis toujours.",
      image: "/images/placeholders/story-1.svg",
    },
    {
      year: "2022",
      title: "Le premier voyage",
      text: "De Kribi aux montagnes de l'Ouest, nous avons appris à voyager ensemble, à rire des imprévus et à construire, kilomètre après kilomètre, une complicité qui ne nous a plus quittés.",
      image: "/images/placeholders/story-2.svg",
    },
    {
      year: "2025",
      title: "La demande",
      text: "Face à l'océan, au coucher du soleil, un genou à terre et une question murmurée. La réponse fut un « oui » riant, ému, évident. Le plus beau chapitre pouvait commencer.",
      image: "/images/placeholders/story-3.svg",
    },
  ],

  /** Programme de la journée */
  program: [
    {
      time: "14h00",
      title: "Cérémonie",
      description: "Échange des vœux entouré de nos proches.",
    },
    {
      time: "17h00",
      title: "Cocktail & photos",
      description: "Un moment de détente, de bulles et de souvenirs.",
    },
    {
      time: "19h00",
      title: "Réception",
      description: "Accueil des invités dans la salle de réception.",
    },
    {
      time: "21h00",
      title: "Dîner",
      description: "Un dîner raffiné aux saveurs d'ici et d'ailleurs.",
    },
    {
      time: "23h00",
      title: "Soirée",
      description: "Place à la danse, jusqu'au bout de la nuit.",
    },
  ],

  /** Lieux de l'événement */
  venues: [
    {
      name: "Cathédrale Saint-Pierre-et-Saint-Paul",
      role: "Cérémonie religieuse",
      address: "Boulevard de la Liberté, Bonanjo, Douala",
      description:
        "La cérémonie se tiendra dans ce lieu emblématique au cœur de Douala. Merci d'arriver 30 minutes avant le début.",
      /** Lien itinéraire (Google Maps). Remplacer par le vrai lien. */
      mapsUrl: "https://maps.google.com/?q=Douala+Cameroun",
      image: "/images/placeholders/venue-1.svg",
    },
    {
      name: "Domaine Les Jardins d'Ivoire",
      role: "Réception & soirée",
      address: "Route de Bonapriso, Douala",
      description:
        "Un cadre verdoyant et élégant pour le cocktail, le dîner et la soirée dansante. Parking privé disponible sur place.",
      mapsUrl: "https://maps.google.com/?q=Douala+Cameroun",
      image: "/images/placeholders/venue-2.svg",
    },
  ],

  /** Dress code */
  dressCode: {
    title: "Élégance chic",
    description:
      "Nous serions honorés de vous voir dans vos plus belles tenues. Tenue de soirée ou tenue traditionnelle chic — laissez parler votre élégance.",
    note: "Le blanc est réservé à la mariée.",
    colors: [
      { name: "Ivoire", hex: "#F5EFE4", reserved: true },
      { name: "Champagne", hex: "#E8D5B0" },
      { name: "Vert sauge", hex: "#9CAF88" },
      { name: "Doré", hex: "#B08D57" },
      { name: "Brun profond", hex: "#3E2F23" },
    ],
  },

  /** Galerie — images placeholders à remplacer */
  gallery: [
    { src: "/images/placeholders/gallery-1.svg", alt: "Ange & Cédric — photo 1" },
    { src: "/images/placeholders/gallery-2.svg", alt: "Ange & Cédric — photo 2" },
    { src: "/images/placeholders/gallery-3.svg", alt: "Ange & Cédric — photo 3" },
    { src: "/images/placeholders/gallery-4.svg", alt: "Ange & Cédric — photo 4" },
    { src: "/images/placeholders/gallery-5.svg", alt: "Ange & Cédric — photo 5" },
    { src: "/images/placeholders/gallery-6.svg", alt: "Ange & Cédric — photo 6" },
    { src: "/images/placeholders/gallery-7.svg", alt: "Ange & Cédric — photo 7" },
    { src: "/images/placeholders/gallery-8.svg", alt: "Ange & Cédric — photo 8" },
  ],

  /** Image du hero (plein écran) */
  heroImage: "/images/hero-bg.png",

  /** Informations pratiques */
  infos: [
    {
      title: "Horaires",
      icon: "clock",
      lines: [
        "Cérémonie à 14h00 précises.",
        "Merci d'arriver 30 minutes en avance.",
        "Fin de soirée prévue vers 4h00.",
      ],
    },
    {
      title: "Accès & transport",
      icon: "car",
      lines: [
        "Les deux lieux sont à 15 minutes l'un de l'autre.",
        "Taxis et VTC disponibles à Douala.",
        "Navettes prévues entre la cérémonie et la réception.",
      ],
    },
    {
      title: "Parking",
      icon: "parking",
      lines: [
        "Parking gratuit au lieu de réception.",
        "Places limitées près de la cathédrale.",
        "Un service de voiturier sera présent à la réception.",
      ],
    },
    {
      title: "Enfants",
      icon: "children",
      lines: [
        "Les enfants sont les bienvenus.",
        "Un espace dédié avec animatrices sera prévu pendant la soirée.",
      ],
    },
    {
      title: "Hébergement",
      icon: "hotel",
      lines: [
        "Plusieurs hôtels se trouvent à proximité de la réception.",
        "Contactez-nous pour des recommandations.",
      ],
    },
    {
      title: "Contacts",
      icon: "phone",
      lines: [
        "Organisation : +237 6XX XX XX XX",
        "Témoin de Cédric : +237 6XX XX XX XX",
        "Témoin d'Ange : +237 6XX XX XX XX",
      ],
    },
  ],

  /** Métadonnées du site */
  meta: {
    title: "Ange & Cédric — 28 décembre 2026",
    description:
      "Nous nous marions le 28 décembre 2026 à Douala. Retrouvez toutes les informations : programme, lieux, dress code et galerie.",
    /** URL de production (utilisée pour les QR codes et liens absolus) */
    siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  },
} as const;

export type Wedding = typeof wedding;
