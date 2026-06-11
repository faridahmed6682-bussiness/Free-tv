import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import axios from "axios";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Proxy to fetch M3U or Stream Manifests to bypass CORS
  app.get("/api/iptv/proxy", async (req, res) => {
    const { url, referer } = req.query;
    if (!url || typeof url !== 'string') {
      return res.status(400).json({ error: "URL is required" });
    }

    try {
      const parsedUrl = new URL(url);
      const customReferer = typeof referer === 'string' ? referer : (parsedUrl.origin + '/');
      
      const response = await axios.get(url, {
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept': '*/*',
            'Referer': customReferer,
            'Origin': parsedUrl.origin
        },
        responseType: 'arraybuffer',
        timeout: 15000
      });
      
      const contentType = response.headers['content-type'] || 'text/plain';
      res.set('Content-Type', contentType);
      res.set('Access-Control-Allow-Origin', '*');
      
      let responseData = response.data;

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
                 return `/api/iptv/proxy?url=${encodeURIComponent(absoluteUrl)}`;
            } else if (line.startsWith('#EXT-X-STREAM-INF') || line.startsWith('#EXT-X-MEDIA')) {
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

      res.send(responseData);
    } catch (error: any) {
      console.error('Proxy Error for URL', url, ':', error.message);
      res.status(500).json({ error: "Failed to fetch remote resource", details: error.message });
    }
  });

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
