import { db, auth } from './firebase';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';

export interface UserConfig {
  userId: string;
  configType: 'm3u' | 'xtream';
  url: string;
  username?: string;
  password?: string;
  updatedAt?: any;
}

export async function getUserConfig(): Promise<UserConfig | null> {
  if (!auth.currentUser) return null;
  const docRef = doc(db, 'userConfigs', auth.currentUser.uid);
  try {
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data() as UserConfig;
    }
    return null;
  } catch (error) {
    console.error("Error fetching config:", error);
    return null;
  }
}

export async function saveUserConfig(config: Omit<UserConfig, 'userId' | 'updatedAt'>): Promise<void> {
  if (!auth.currentUser) throw new Error("Must be logged in to save config");
  const docRef = doc(db, 'userConfigs', auth.currentUser.uid);
  
  const payload: any = {
    userId: auth.currentUser.uid,
    configType: config.configType,
    url: config.url,
    updatedAt: serverTimestamp(),
  };

  if (config.configType === 'xtream') {
    if (config.username) payload.username = config.username;
    if (config.password) payload.password = config.password;
  }

  await setDoc(docRef, payload, { merge: true });
}
