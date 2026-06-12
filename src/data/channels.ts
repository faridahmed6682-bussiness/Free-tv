import { Channel } from '../types';

export const CHANNELS: Channel[] = [
  {
    id: 'btv-world',
    name: 'BTV World',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Logo_of_Bangladesh_Television.svg/1024px-Logo_of_Bangladesh_Television.svg.png',
    url: 'https://btv.ebonictv.com/btv-world/playlist.m3u8',
    category: 'News',
    description: 'Bangladesh Television World (Global)',
    country: 'Bangladesh'
  },
  {
    id: 'somoy-news',
    name: 'Somoy News',
    logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/f/f6/Somoy_TV_logo.svg/1200px-Somoy_TV_logo.svg.png',
    url: 'https://live-somoynews.somoynews.tv/somoy/live.m3u8',
    category: 'News',
    description: 'Somoy News Live BD',
    country: 'Bangladesh'
  },
  {
    id: 'cgtn-news',
    name: 'CGTN Live',
    logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/f/f3/CGTN_logo.svg/1200px-CGTN_logo.svg.png',
    url: 'https://news.cgtn.com/resource/live/english/cgtn-news.m3u8',
    category: 'News',
    description: 'CGTN International English News',
    country: 'International'
  }
];

export const CATEGORIES: string[] = ['All', 'News', 'Entertainment', 'Sports', 'Movies', 'Music'];
