export type LayoutMode = 'grid' | 'canonical' | 'cube' | 'globe' | 'horizontal';

export interface PlayItem {
  id: string;
  name: string;
  role: string;
  location: string;
  year: string;
  gradient: string;
  accent: string;
}

export const PLAY_ITEMS: PlayItem[] = [
  {
    id: '01',
    name: 'Isabela\nGaleano',
    role: 'Curator',
    location: 'USA',
    year: '2024',
    gradient: 'linear-gradient(135deg, #1a0a2e 0%, #7c2d92 40%, #f472b6 100%)',
    accent: '#c026d3',
  },
  {
    id: '02',
    name: 'Danny\nVan der Elst',
    role: 'Artist',
    location: 'Belgium, Mechelen',
    year: '2024',
    gradient: 'linear-gradient(135deg, #0d1b2a 0%, #1d4ed8 50%, #38bdf8 100%)',
    accent: '#3b82f6',
  },
  {
    id: '03',
    name: 'Sophie\nWratzfeld',
    role: 'Curator',
    location: 'Austria',
    year: '2023',
    gradient: 'linear-gradient(135deg, #052e16 0%, #15803d 45%, #86efac 100%)',
    accent: '#22c55e',
  },
  {
    id: '04',
    name: 'Karim\nEl-Khairy',
    role: 'Designer',
    location: 'Egypt, Cairo',
    year: '2023',
    gradient: 'linear-gradient(135deg, #1e1b4b 0%, #6d28d9 50%, #c4b5fd 100%)',
    accent: '#8b5cf6',
  },
  {
    id: '05',
    name: 'Yuki\nTanaka',
    role: 'Director',
    location: 'Japan, Tokyo',
    year: '2022',
    gradient: 'linear-gradient(135deg, #0f172a 0%, #1e40af 45%, #93c5fd 100%)',
    accent: '#60a5fa',
  },
  {
    id: '06',
    name: 'Lena\nMüller',
    role: 'Developer',
    location: 'Germany, Berlin',
    year: '2022',
    gradient: 'linear-gradient(135deg, #1c0f00 0%, #b45309 45%, #fde68a 100%)',
    accent: '#f59e0b',
  },
  {
    id: '07',
    name: 'Amara\nDiallo',
    role: 'Artist',
    location: 'Senegal, Dakar',
    year: '2021',
    gradient: 'linear-gradient(135deg, #083344 0%, #0891b2 45%, #a5f3fc 100%)',
    accent: '#06b6d4',
  },
  {
    id: '08',
    name: 'Lucas\nRocha',
    role: 'Filmmaker',
    location: 'Brazil, São Paulo',
    year: '2021',
    gradient: 'linear-gradient(135deg, #450a0a 0%, #dc2626 50%, #fca5a5 100%)',
    accent: '#ef4444',
  },
];
