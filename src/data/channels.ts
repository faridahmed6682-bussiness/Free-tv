import { Channel } from '../types';

export const CHANNELS: Channel[] = [
  {
    id: 'somoy-tv',
    name: 'Somoy TV',
    logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/f/f6/Somoy_TV_logo.svg/1200px-Somoy_TV_logo.svg.png',
    url: 'https://r3.bebi.me/live/somoy/index.m3u8',
    category: 'News',
    description: 'Somoy TV is a 24-hour Bengali news television channel in Bangladesh.'
  },
  {
    id: 'jamuna-tv',
    name: 'Jamuna TV',
    logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/e/e0/Jamuna_TV_logo.svg/1200px-Jamuna_TV_logo.svg.png',
    url: 'https://jamuna-tv-live.akamaized.net/hls/live/2012351/jamunatv/index.m3u8',
    category: 'News',
    description: 'Jamuna Television is a 24-hour news channel in Bangladesh.'
  },
  {
    id: 'btv-world',
    name: 'BTV World',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/BTV_World_logo.svg/1200px-BTV_World_logo.svg.png',
    url: 'https://btvworld.akamaized.net/hls/live/2034177/btvworld/index.m3u8',
    category: 'News',
    description: 'Bangladesh Television World is a state-owned television network.'
  },
  {
    id: 'channel-i',
    name: 'Channel i',
    logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/1/1e/Channel_i_Logo.svg/1200px-Channel_i_Logo.svg.png',
    url: 'https://www.youtube.com/watch?v=H7tS_L7eZ9w',
    category: 'Entertainment',
    description: 'Channel i is a privately owned television network in Bangladesh.'
  },
  {
    id: 'independent-tv',
    name: 'Independent TV',
    logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/1/1b/Independent_Television_logo.svg/1200px-Independent_Television_logo.svg.png',
    url: 'https://www.youtube.com/watch?v=H7rN7y8e7y0',
    category: 'News',
    description: 'Independent Television is a 24-hour news channel in Bangladesh.'
  },
  {
    id: 'tsports',
    name: 'T Sports',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/T_Sports_logo.svg/1200px-T_Sports_logo.svg.png',
    url: 'https://tsports-live.akamaized.net/hls/live/2025177/tsports/index.m3u8',
    category: 'Sports',
    description: 'T Sports is the first sports television network of Bangladesh.'
  },
  {
    id: 'ekattor-tv',
    name: 'Ekattor TV',
    logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/b/b8/Ekattor_TV_logo.svg/1200px-Ekattor_TV_logo.svg.png',
    url: 'https://r3.bebi.me/live/ekattor/index.m3u8',
    category: 'News',
    description: 'Ekattor TV is the first full HD 24-hour news television channel in Bangladesh.'
  },
  {
    id: 'mohona-tv',
    name: 'Mohona TV',
    logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/d/d4/Mohona_TV_logo.svg/1200px-Mohona_TV_logo.svg.png',
    url: 'https://r3.bebi.me/live/mohona/index.m3u8',
    category: 'Entertainment',
    description: 'Mohona TV is a Bengali-language satellite television channel.'
  }
];

export const CATEGORIES: string[] = ['All', 'News', 'Entertainment', 'Sports', 'Movies', 'Music'];
