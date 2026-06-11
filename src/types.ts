
export interface Channel {
  id: string;
  name: string;
  logo: string;
  url: string;
  category: string;
  description?: string;
  status?: 'online' | 'offline' | 'checking';
  country?: string;
}

export type Category = 'All' | 'News' | 'Sports' | 'Entertainment' | 'Movies' | 'Music';
