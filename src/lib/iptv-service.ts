
import { parseM3U, M3UEntry } from './m3u-parser';
import { Channel } from '../types';

const IPTV_ORG_BASE = 'https://iptv-org.github.io/iptv';

export async function fetchIptvOrgChannels(countryCode: string = 'bd'): Promise<Channel[]> {
  try {
    const targetUrl = `${IPTV_ORG_BASE}/countries/${countryCode}.m3u`;
    const response = await fetch(`/api/iptv/proxy?url=${encodeURIComponent(targetUrl)}`);
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

export async function fetchCustomM3U(url: string): Promise<Channel[]> {
  try {
    const response = await fetch(`/api/iptv/proxy?url=${encodeURIComponent(url)}`);
    if (!response.ok) throw new Error('Failed to fetch custom M3U');
    const content = await response.text();
    const entries = parseM3U(content);
    
    return entries.map((entry, index) => ({
      id: `custom-m3u-${Date.now()}-${index}`,
      name: entry.name || `Channel ${index + 1}`,
      logo: entry.logo || 'https://images.unsplash.com/photo-1594909122845-11baa439b7bf?auto=format&fit=crop&q=80&w=200&h=200',
      url: entry.url,
      category: entry.group || 'Custom',
      description: `Custom M3U Channel`
    }));
  } catch (error) {
    console.error('Error fetching Custom M3U:', error);
    throw error;
  }
}

export async function fetchXtreamLive(url: string, user: string, pass: string): Promise<Channel[]> {
  try {
    // Format: http://server.com:port/player_api.php?username=XXX&password=YYY&action=get_live_streams
    const baseUrl = url.replace(/\/$/, "");
    const apiUrl = `${baseUrl}/player_api.php?username=${encodeURIComponent(user)}&password=${encodeURIComponent(pass)}&action=get_live_streams`;
    
    const response = await fetch(`/api/iptv/proxy?url=${encodeURIComponent(apiUrl)}`);
    if (!response.ok) throw new Error('Failed to fetch Xtream API');
    const data = await response.json();
    
    if (!Array.isArray(data)) {
        throw new Error('Invalid format returned by Xtream API');
    }
    
    return data.map((item: any, index: number) => ({
        id: `xtream-${item.stream_id || index}`,
        name: item.name || `Xtream Channel ${index}`,
        logo: item.stream_icon || 'https://images.unsplash.com/photo-1594909122845-11baa439b7bf?auto=format&fit=crop&q=80&w=200&h=200',
        url: `${baseUrl}/live/${user}/${pass}/${item.stream_id}.m3u8`,
        category: item.category_name || 'Xtream',
        description: `Xtream Live Stream`
    }));
  } catch (error) {
    console.error('Error fetching Xtream API:', error);
    throw error;
  }
}
