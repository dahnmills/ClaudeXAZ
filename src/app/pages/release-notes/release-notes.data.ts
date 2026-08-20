export type ReleaseCategory = 'feature' | 'fix' | 'design' | 'content';

export interface ReleaseNote {
  date: string; // 'YYYY-MM-DD'
  category: ReleaseCategory;
  screens: string[]; // paths into SCREENS; empty array = meta/harness change
  title: string;
  description: string;
}

export const CATEGORY_LABELS: Record<ReleaseCategory, string> = {
  feature: 'Feature',
  fix: 'Fix',
  design: 'Design',
  content: 'Content',
};

// Newest first. Prepend a new entry here at every push that changes a screen.
export const RELEASE_NOTES: ReleaseNote[] = [
  {
    date: '2026-08-20',
    category: 'feature',
    screens: [],
    title: 'Versioning par écran et notes de version',
    description:
      'Chaque écran a désormais un numéro de version (major.minor.patch). Une nouvelle page Notes de version recense les évolutions, filtrable par catégorie et par écran.',
  },
  {
    date: '2026-08-20',
    category: 'design',
    screens: [],
    title: 'Harmonisation des listings prototype et univers isolés',
    description:
      'Le listing de /prototype reprend le même langage visuel (cards, typographie, structure) que celui des univers isolés Useberry.',
  },
];
