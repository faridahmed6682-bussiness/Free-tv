import { Channel } from '../types';

export const CHANNELS: Channel[] = [
  {
    id: 'aamar-bangla',
    name: 'Aamar Bangla',
    logo: 'https://jiotvimages.cdn.jio.com/dare_images/images/Amaar_Bangla.png',
    url: 'https://app.ncare.live/c3VydmVyX8RpbEU9Mi8xNy8yMDE0GIDU6RgzQ6NTAgdEoaeFzbF92YWxIZTO0U0ezN1IzMyfvcGVMZEJCTEFWeVN3PTOmdFsaWRtaW51aiPhnPTI/amarbanglatv.stream/playlist.m3u8',
    category: 'Entertainment',
    description: 'Aamar Bangla Entertainment TV.'
  },
  {
    id: 'ananda-tv',
    name: 'Ananda TV',
    logo: 'https://i.imgur.com/jkbo7Qe.png',
    url: 'https://bozztv.com/rongo/rongo-AnandaTV/index.m3u8',
    category: 'Entertainment',
    description: 'Ananda TV (1080p)'
  },
  {
    id: 'cgtn',
    name: 'CGTN Live',
    logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/f/f3/CGTN_logo.svg/1200px-CGTN_logo.svg.png',
    url: 'https://news.cgtn.com/resource/live/english/cgtn-news.m3u8',
    category: 'News',
    description: 'CGTN International English News (Reliable 24/7 Live Stream)'
  },
  {
    id: 'test-buck-bunny',
    name: 'Classic Cinema TV',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Big_buck_bunny_poster_big.jpg/1200px-Big_buck_bunny_poster_big.jpg',
    url: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
    category: 'Movies',
    description: 'A classic 24/7 cinema test stream featuring Big Buck Bunny.'
  }
];

export const CATEGORIES: string[] = ['All', 'News', 'Entertainment', 'Sports', 'Movies', 'Music'];
