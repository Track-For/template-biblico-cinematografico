export type ChapterEffect =
  | "origin"
  | "awakening"
  | "choice"
  | "calling"
  | "sacrifice"
  | "night"
  | "confrontation"
  | "light";

export type Chapter = {
  id: string;
  title: string;
  label: string;
  start: number;
  end: number;
  duration: number;
  desktopVideo: string;
  mobileVideo: string;
  poster: string;
  narration: string;
  effect: ChapterEffect;
  scrollDistance: number;
  mobileHeight: number;
  playbackStart?: number;
  playbackEnd?: number;
  quote?: string;
  citation?: string;
};

const media = (slug: string) => ({
  desktopVideo: `/videos/chapters/desktop/${slug}.mp4`,
  mobileVideo: `/videos/chapters/mobile/${slug}.mp4`,
  poster: `/videos/chapters/posters/${slug}.webp`,
});

export const chapters: Chapter[] = [
  {
    id: "guerra-invisivel",
    title: "A Guerra Invisível",
    label: "Prólogo",
    start: 0,
    end: 25.125,
    duration: 25.125,
    ...media("00-prologo"),
    narration: "Há conflitos que começam antes de podermos nomeá-los.",
    effect: "origin",
    scrollDistance: 2800,
    mobileHeight: 270,
  },
  {
    id: "despertar",
    title: "O Despertar",
    label: "Capítulo um",
    start: 25.125,
    end: 39.875,
    duration: 14.75,
    ...media("01-despertar"),
    narration: "Abrir os olhos é descobrir que toda escolha tem peso.",
    effect: "awakening",
    scrollDistance: 2100,
    mobileHeight: 235,
    playbackEnd: 13.8,
  },
  {
    id: "escolha",
    title: "A Escolha",
    label: "Capítulo dois",
    start: 39.875,
    end: 49.833,
    duration: 9.958,
    ...media("02-escolha"),
    narration: "Uma escolha nunca termina em quem a faz.",
    effect: "choice",
    scrollDistance: 1900,
    mobileHeight: 225,
  },
  {
    id: "chamado",
    title: "O Chamado",
    label: "Capítulo três",
    start: 49.833,
    end: 69.792,
    duration: 19.959,
    ...media("03-chamado"),
    narration:
      "Mesmo entre ruínas, a humanidade continuou sendo chamada de volta.",
    effect: "calling",
    scrollDistance: 2500,
    mobileHeight: 255,
  },
  {
    id: "sacrificio",
    title: "O Sacrifício",
    label: "Capítulo quatro",
    start: 69.792,
    end: 95.833,
    duration: 26.041,
    ...media("04-sacrificio"),
    narration:
      "A força chegou sem dominar. E permaneceu quando fugir seria mais fácil.",
    effect: "sacrifice",
    scrollDistance: 3200,
    mobileHeight: 285,
    quote:
      "Ninguém tem amor maior do que este: de alguém dar a própria vida pelos seus amigos.",
    citation: "João 15:13, NAA",
  },
  {
    id: "noite",
    title: "A Noite",
    label: "Capítulo cinco",
    start: 95.833,
    end: 132.125,
    duration: 36.292,
    ...media("05-noite"),
    narration: "Quando o poder perde o limite, o medo se torna sistema.",
    effect: "night",
    scrollDistance: 3900,
    mobileHeight: 310,
  },
  {
    id: "confronto",
    title: "O Confronto",
    label: "Capítulo seis",
    start: 132.125,
    end: 176.292,
    duration: 44.167,
    ...media("06-confronto"),
    narration:
      "O mal pode parecer inevitável. Ainda assim, toda geração escolhe o que alimenta.",
    effect: "confrontation",
    scrollDistance: 4600,
    mobileHeight: 335,
    playbackStart: 4,
  },
  {
    id: "luz-permanece",
    title: "A Luz Permanece",
    label: "Epílogo",
    start: 176.292,
    end: 193.535,
    duration: 17.243,
    ...media("07-epilogo"),
    narration: "A história não termina no abismo.",
    effect: "light",
    scrollDistance: 2600,
    mobileHeight: 260,
    quote:
      "A luz resplandece nas trevas, e as trevas não prevaleceram contra ela.",
    citation: "João 1:5, NAA",
  },
];

export const totalFilmDuration = 193.535;
