import { Channel } from '../types';

export const CHANNELS: Channel[] = [
  {
    id: 'somoy-tv',
    name: 'Somoy TV',
    logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/f/f6/Somoy_TV_logo.svg/1200px-Somoy_TV_logo.svg.png',
    url: 'https://www.youtube.com/watch?v=R9KbeB68zEM', // This is a live stream example
    category: 'News',
    description: 'Somoy TV is a 24-hour Bengali news television channel in Bangladesh.'
  },
  {
    id: 'jamuna-tv',
    name: 'Jamuna TV',
    logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/e/e0/Jamuna_TV_logo.svg/1200px-Jamuna_TV_logo.svg.png',
    url: 'https://www.youtube.com/watch?v=680D1Jv_7l8',
    category: 'News',
    description: 'Jamuna Television is a 24-hour news channel in Bangladesh.'
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
    id: 'atn-bangla',
    name: 'ATN Bangla',
    logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/e/e0/ATN_Bangla_Logo.svg/1200px-ATN_Bangla_Logo.svg.png',
    url: 'https://www.youtube.com/watch?v=tI8L4W3LwXk',
    category: 'Entertainment',
    description: 'ATN Bangla is a Bengali-language digital cable television channel.'
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
    url: 'https://www.youtube.com/watch?v=L7rN7y8e7y0', // Placeholder
    category: 'Sports',
    description: 'T Sports is a Bangladeshi sports television network.'
  },
  {
    id: 'ekattor-tv',
    name: 'Ekattor TV',
    logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/b/b8/Ekattor_TV_logo.svg/1200px-Ekattor_TV_logo.svg.png',
    url: 'https://www.youtube.com/watch?v=R9KbeB68zEM',
    category: 'News',
    description: 'Ekattor TV is the first full HD 24-hour news television channel in Bangladesh.'
  },
  {
    id: 'r-tv',
    name: 'RTV',
    logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/3/3b/RTV_logo.svg/1200px-RTV_logo.svg.png',
    url: 'https://www.youtube.com/watch?v=R9KbeB68zEM',
    category: 'Entertainment',
    description: 'RTV is an entertainment television channel in Bangladesh.'
  },
  {
    id: 'boishakhi-tv',
    name: 'Boishakhi TV',
    logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/1/12/Boishakhi_TV_Logo.svg/1200px-Boishakhi_TV_Logo.svg.png',
    url: 'https://www.youtube.com/watch?v=R9KbeB68zEM',
    category: 'Entertainment',
    description: 'Boishakhi TV is an entertainment channel in Bangladesh.'
  },
  {
    id: 'n-tv',
    name: 'NTV',
    logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/0/02/NTV_Bangladesh_logo.svg/1200px-NTV_Bangladesh_logo.svg.png',
    url: 'https://www.youtube.com/watch?v=R9KbeB68zEM',
    category: 'Entertainment',
    description: 'NTV is a Bengali-language satellite television channel based in Bangladesh.'
  },
  {
    id: 'masranga-tv',
    name: 'Maasranga TV',
    logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/7/75/Maasranga_TV_Logo.svg/1200px-Maasranga_TV_Logo.svg.png',
    url: 'https://www.youtube.com/watch?v=R9KbeB68zEM',
    category: 'Entertainment',
    description: 'Maasranga Television is a family-oriented entertainment television channel in Bangladesh.'
  }
];

export const CATEGORIES: string[] = ['All', 'News', 'Entertainment', 'Sports', 'Movies', 'Music'];
