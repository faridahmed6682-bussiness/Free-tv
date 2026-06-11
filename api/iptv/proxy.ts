import type { VercelRequest, VercelResponse } from '@vercel/node';
import axios from 'axios';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { url } = req.query;

  if (!url || typeof url !== 'string') {
    return res.status(400).json({ error: 'URL is required' });
  }

  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return res.status(200).end();
  }

  try {
    const parsedUrl = new URL(url);
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': '*/*',
        'Origin': parsedUrl.origin,
        'Referer': parsedUrl.origin + '/',
      },
      responseType: 'arraybuffer',
      timeout: 10000,
    });
    
    const contentType = (response.headers['content-type'] as string) || 'text/plain';
    res.setHeader('Content-Type', contentType);
    res.setHeader('Access-Control-Allow-Origin', '*');
    
    // Only cache if it's not a video segment, or cache very shortly
    if (url.includes('.m3u8')) {
        res.setHeader('Cache-Control', 's-maxage=1, stale-while-revalidate=1');
    } else {
        res.setHeader('Cache-Control', 'public, max-age=3600');
    }

    let responseData = response.data;

    // If it's an m3u8 playlist, rewrite relative URLs to absolute proxy URLs
    if (url.includes('.m3u8') || contentType.includes('mpegurl') || contentType.includes('application/x-mpegURL')) {
        const textDecoder = new TextDecoder('utf-8');
        let text = textDecoder.decode(responseData);
        
        const lines = text.split('\n');
        const rewrittenLines = lines.map(line => {
            line = line.trim();
            if (line && !line.startsWith('#')) {
                 let absoluteUrl = line;
                 if (!line.startsWith('http')) {
                     absoluteUrl = new URL(line, url).toString();
                 }
                 // Return the proxy URL for the segment
                 return `/api/iptv/proxy?url=${encodeURIComponent(absoluteUrl)}`;
            } else if (line.startsWith('#EXT-X-STREAM-INF') || line.startsWith('#EXT-X-MEDIA')) {
               // Sometimes URIs are inside tags, e.g. URI="something.m3u8"
               return line.replace(/URI="([^"]+)"/g, (match, p1) => {
                   let absoluteUrl = p1;
                   if (!p1.startsWith('http')) {
                       absoluteUrl = new URL(p1, url).toString();
                   }
                   return `URI="/api/iptv/proxy?url=${encodeURIComponent(absoluteUrl)}"`;
               });
            }
            return line;
        });
        
        responseData = Buffer.from(rewrittenLines.join('\n'), 'utf-8');
    }
    
    res.status(200).send(responseData);
  } catch (error: any) {
    console.error('Vercel Proxy Error for URL', url, ':', error.message);
    res.status(500).json({ error: 'Failed to fetch remote resource', message: error.message });
  }
}
