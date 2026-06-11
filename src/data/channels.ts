import { Channel } from '../types';

export const CHANNELS: Channel[] = [
  {
    id: 'btv-national',
    name: 'BTV National',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Logo_of_Bangladesh_Television.svg/1024px-Logo_of_Bangladesh_Television.svg.png',
    url: 'http://103.205.133.42:1935/live/btv_national_720/index.m3u8',
    category: 'News',
    description: 'BTV National (Official Stream)'
  },
  {
    id: 'jamuna-tv-hq',
    name: 'Jamuna TV HD',
    logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/e/e0/Jamuna_TV_logo.svg/1200px-Jamuna_TV_logo.svg.png',
    url: 'http://103.144.200.7:8080/hls/jamunatv/index.m3u8',
    category: 'News',
    description: 'Jamuna Television HD (BDIX optimized)'
  },
  {
    id: 't-sports-hq',
    name: 'T Sports',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/T_Sports_logo.svg/1200px-T_Sports_logo.svg.png',
    url: 'http://103.159.4.38:5868/BD-BANGLA-11/index.m3u8',
    category: 'Sports',
    description: 'T Sports Live (Reliable)'
  },
  {
    id: 'star-sports-1',
    name: 'Star Sports 1',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Star_Sports_logo.svg/1200px-Star_Sports_logo.svg.png',
    url: 'http://103.214.202.218:8081/live/starsports1/chunks.m3u8',
    category: 'Sports',
    description: 'Star Sports 1 HD'
  },
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
  }
];

export const CATEGORIES: string[] = ['All', 'News', 'Entertainment', 'Sports', 'Movies', 'Music'];
