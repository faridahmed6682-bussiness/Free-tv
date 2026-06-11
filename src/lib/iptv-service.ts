
import { parseM3U, M3UEntry } from './m3u-parser';
import { Channel } from '../types';

const IPTV_ORG_BASE = 'https://iptv-org.github.io/iptv';

export async function fetchIptvOrgChannels(countryCode: string = 'bd'): Promise<Channel[]> {
  try {
    const response = await fetch(`${IPTV_ORG_BASE}/countries/${countryCode}.m3u`);
    if (!response.ok) throw new Error('Failed to fetch playlist');
    const content = await response.text();
    const entries = parseM3U(content);
    
    return entries.map((entry, index) => ({
      id: `iptv-org-${countryCode}-${index}`,
      name: entry.name,
      logo: entry.logo || 'https://images.unsplash.com/photo-1594909122845-11baa439b7bf?auto=format&fit=crop&q=80&w=200&h=200',
      url: entry.url,
      category: entry.group || 'Public',
      description: `Sourced from iptv-org GitHub repository.`
    }));
  } catch (error) {
    console.error('Error fetching IPTV-org channels:', error);
    return [];
  }
}
