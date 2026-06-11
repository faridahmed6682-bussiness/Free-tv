
export interface M3UEntry {
  name: string;
  url: string;
  logo: string;
  group: string;
}

export function parseM3U(content: string): M3UEntry[] {
  const lines = content.split('\n');
  const entries: M3UEntry[] = [];
  let currentEntry: Partial<M3UEntry> = {};

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line.startsWith('#EXTINF:')) {
      // Parse metadata
      // Format: #EXTINF:-1 tvg-id="ID" tvg-logo="LOGO" group-title="GROUP",NAME
      const nameMatch = line.match(/,(.*)$/);
      const logoMatch = line.match(/tvg-logo="(.*?)"/);
      const groupMatch = line.match(/group-title="(.*?)"/);

      currentEntry.name = nameMatch ? nameMatch[1].trim() : 'Unknown';
      currentEntry.logo = logoMatch ? logoMatch[1].trim() : '';
      currentEntry.group = groupMatch ? groupMatch[1].trim() : 'General';
    } else if (line.startsWith('http')) {
      currentEntry.url = line;
      if (currentEntry.name && currentEntry.url) {
        entries.push(currentEntry as M3UEntry);
      }
      currentEntry = {};
    }
  }

  return entries;
}
