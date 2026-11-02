/** Contenu public : seules les dates et étapes confirmées sont racontées comme des faits. */
export type PublicPhoto = {
  src: string;
  alt: string;
  label: string;
  position?: string;
};

export const photos = {
  saveTheDate: { src: "/images/save-the-date-26-decembre.jpeg", alt: "Save the Date — 26 décembre 2026 : deux alliances dorées sur une Bible ouverte, entourées de fleurs blanches", label: "" },
  conversationCall: { src: "/images/generated/conversation-en-ligne-eclaircie.png", alt: "Ange et Cédric discutent pendant un appel vidéo", label: "", position: "center" },
  prayerCall: { src: "/images/generated/priere-en-ligne-eclaircie.png", alt: "Ange et Cédric en prière pendant un appel vidéo", label: "Notre moment de prière en ligne", position: "center" },
  angeFrance: { src: "/images/ange-en-france.jpeg", alt: "Ange en France, en manteau rose", label: "Ange en France", position: "center 20%" },
  cedricCanada: { src: "/images/cedric-au-canada-v2.jpg", alt: "Cédric au Canada, en manteau et écharpe devant une voiture rouge dans la neige", label: "Cédric au Canada", position: "center top" },
  momentsEmbrace: { src: "/images/ange-cedric-moments-enlaces.jpg", alt: "Ange et Cédric enlacés devant un miroir", label: "Un moment de tendresse", position: "center" },
  momentsSofa: { src: "/images/ange-cedric-moments-canape.jpg", alt: "Ange et Cédric prenant un selfie ensemble sur un canapé", label: "Un souvenir à deux", position: "center top" },
  momentsTogether: { src: "/images/generated/ange-cedric-moments-a-deux.png", alt: "Ange et Cédric côte à côte, un souvenir à deux", label: "Un instant à deux", position: "center top" },
  momentsDouala: { src: "/images/ange-cedric-moments-douala.jpg", alt: "Selfie d’Ange et Cédric à Douala", label: "Un souvenir à Douala", position: "center 38%" },
  familyMemory: { src: "/images/generated/le-bonheur-a-trois-transparent.png", alt: "Ange, Cédric et leur fille réunis pour une photo de famille", label: "", position: "center" },
  firstSteps: { src: "/images/nos-premiers-pas-v2.jpeg", alt: "Ange et Cédric assis ensemble, un souvenir de leurs premiers pas", label: "Un souvenir à deux", position: "center top" },
  portrait: { src: "/images/ange-cedric-portrait.png", alt: "Ange et Cédric enlacés en tenues blanches", label: "" },
  walk: { src: "/images/generated/story-walk.png", alt: "Un couple se promenant dans un jardin lumineux", label: "", position: "62% center" },
  maternity: { src: "/images/ange-cedric-grossesse.jpg", alt: "Ange enceinte et Cédric posant ensemble, les mains sur son ventre", label: "", position: "center top" },
  family: { src: "/images/generated/famille-jardin-paysage.png", alt: "Ange, Cédric et leur fille dans un jardin à la lumière dorée", label: "", position: "center" },
  faith: { src: "/images/generated/faith-light.png", alt: "Une Bible ouverte dans une lumière douce, à côté d’une bougie", label: "" },
  reception: { src: "/images/generated/reception-dream.png", alt: "Décor de réception, fleurs blanches, bougies et touches sauge", label: "" },
} satisfies Record<string, PublicPhoto>;

export type StoryMedia =
  | { kind: "image"; photo: PublicPhoto; caption?: string }
  | { kind: "video"; src: string; poster: string; title: string; description: string; captionsSrc?: string };
export type StoryChapter = {
  number: string; tag: string; title: string; text: string; mobileText: string; aside: string; media: StoryMedia[];
};

export const chapters: StoryChapter[] = [
  { number: "01", mobileText: "Depuis août 2021, nous écrivons notre histoire à deux.", tag: "Août 2021", title: "Nos premiers pas", text: "Notre relation commence en août 2021. Le premier chapitre d’un chemin que nous continuons d’écrire ensemble.", aside: "Le début d’une belle histoire", media: [{ kind: "image", photo: photos.firstSteps }] },
  { number: "02", mobileText: "Des sorties, des rires et des souvenirs qui nous rapprochent.", tag: "Au fil de nos moments", title: "La complicité s’est construite", text: "Nos sorties, le temps passé ensemble et tous ces moments partagés ont peu à peu construit notre complicité. Des souvenirs qui ont leur place dans notre histoire.", aside: "Un instant, puis tant d’autres.", media: [{ kind: "image", photo: photos.walk, caption: "Nos moments à deux." }, { kind: "image", photo: photos.portrait, caption: "Tout près de toi." }] },
  { number: "03", mobileText: "La grossesse, puis notre fille : notre bonheur se construit à trois.", tag: "Avant nos départs", title: "Et notre histoire s’agrandit", text: "La grossesse, puis l’arrivée de notre fille ont marqué notre parcours. Nous avons traversé cette période tant bien que mal, en apprenant à avancer et à construire notre famille.", aside: "De deux, nous devenons trois.", media: [{ kind: "image", photo: photos.maternity, caption: "" }, { kind: "image", photo: photos.familyMemory, caption: "Le bonheur à trois." }] },
  { number: "04", mobileText: "Cédric au Canada, puis Ange en France un an plus tard.", tag: "Deux départs, un an d’écart", title: "De nouveaux horizons", text: "Cédric part au Canada. Un an plus tard, Ange part en France. Notre histoire se poursuit entre ces deux pays, avec la distance à apprivoiser.", aside: "Le Canada, puis la France.", media: [{ kind: "image", photo: photos.cedricCanada, caption: "Cédric au Canada" }, { kind: "image", photo: photos.angeFrance, caption: "Ange en France" }] },
  { number: "05", mobileText: "Les attentions, l’amour et la prière nous ont gardés proches malgré la distance.", tag: "", title: "Un lien au-delà des kilomètres", text: "Les attentions, l’amour et la prière nous ont gardés proches malgré la distance.", aside: "", media: [{ kind: "image", photo: photos.prayerCall }, { kind: "image", photo: photos.conversationCall }] },
  { number: "06", mobileText: "Le 26 décembre 2026, à Douala, nous unirons nos destinées devant Dieu et ceux qui nous sont chers.\n\nVotre présence rendra ce jour encore plus précieux. 🤍", tag: "", title: "Notre grand Oui", text: "Le 26 décembre 2026, à Douala, nous unirons nos destinées devant Dieu et ceux qui nous sont chers.\n\nVotre présence rendra ce jour encore plus précieux. 🤍", aside: "", media: [{ kind: "image", photo: photos.saveTheDate }] },
] as const;

export const practicalInfos = [
  { icon: "⌖", title: "Nous rejoindre", text: "Le mariage aura lieu à Douala, au Cameroun. Les adresses définitives et les itinéraires seront communiqués ici." },
  { icon: "↗", title: "Transport & accès", text: "Les modalités d’accès, de stationnement et les éventuelles navettes sont en cours de confirmation." },
  { icon: "⌂", title: "Séjourner à Douala", text: "Une sélection d’hébergements pourra être ajoutée une fois les lieux de la journée confirmés." },
  { icon: "♡", title: "Restons en contact", text: "Les coordonnées de l’organisation seront partagées ici dès qu’elles seront validées." },
] as const;

export const questions = [
  { question: "Quand et où le mariage aura-t-il lieu ?", answer: "Le samedi 26 décembre 2026 à Douala, au Cameroun. Les lieux précis et les horaires définitifs restent à confirmer." },
  { question: "Comment retrouver mon invitation ?", answer: "Votre invitation est accessible par le lien personnel qui vous sera transmis. Conservez ce lien pour retrouver votre billet et son QR code." },
  { question: "Le programme affiché est-il définitif ?", answer: "Il s’agit du programme prévisionnel. Les horaires et les lieux portent la mention « à confirmer » jusqu’à leur validation." },
  { question: "Quelle tenue choisir ?", answer: "La direction proposée est une tenue élégante, de soirée ou traditionnelle. Le dress code définitif, notamment les couleurs et la place du blanc, sera confirmé ici." },
  { question: "Puis-je venir accompagné ou avec mes enfants ?", answer: "Référez-vous au nombre de personnes indiqué sur votre invitation personnelle. Les modalités concernant les enfants seront précisées par l’organisation." },
  { question: "Y aura-t-il une navette ou un parking ?", answer: "Ces services ne sont pas encore confirmés. Nous publierons les informations vérifiées dans la rubrique Transport & accès." },
] as const;
