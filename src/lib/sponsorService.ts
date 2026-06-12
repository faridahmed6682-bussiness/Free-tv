import { db, auth } from './firebase';
import { 
  collection, 
  doc, 
  getDocs, 
  setDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  serverTimestamp 
} from 'firebase/firestore';
import { Sponsor } from '../types';

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Fetch only active sponsors for the marquee slider
export async function getActiveSponsors(): Promise<Sponsor[]> {
  const path = 'sponsors';
  try {
    const sponsorsRef = collection(db, path);
    const q = query(sponsorsRef, where('isActive', '==', true), orderBy('updatedAt', 'desc'));
    const querySnapshot = await getDocs(q);
    const list: Sponsor[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      list.push({
        id: doc.id,
        imageUrl: data.imageUrl,
        text: data.text,
        linkUrl: data.linkUrl || '',
        isActive: data.isActive,
        updatedAt: data.updatedAt,
      });
    });
    return list;
  } catch (error) {
    // If the index isn't built yet or orderby fails, fallback to simple filtering
    try {
      const sponsorsRef = collection(db, path);
      const querySnapshot = await getDocs(sponsorsRef);
      const list: Sponsor[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.isActive) {
          list.push({
            id: doc.id,
            imageUrl: data.imageUrl,
            text: data.text,
            linkUrl: data.linkUrl || '',
            isActive: data.isActive,
            updatedAt: data.updatedAt,
          });
        }
      });
      return list;
    } catch (fallbackError) {
      handleFirestoreError(fallbackError, OperationType.LIST, path);
      return [];
    }
  }
}

// Fetch all sponsors (for the admin panel list)
export async function getAllSponsors(): Promise<Sponsor[]> {
  const path = 'sponsors';
  try {
    const sponsorsRef = collection(db, path);
    const querySnapshot = await getDocs(sponsorsRef);
    const list: Sponsor[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      list.push({
        id: doc.id,
        imageUrl: data.imageUrl,
        text: data.text,
        linkUrl: data.linkUrl || '',
        isActive: data.isActive !== false,
        updatedAt: data.updatedAt,
      });
    });
    return list;
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
    return [];
  }
}

// Add/save/update a sponsor
export async function saveSponsor(sponsor: Omit<Sponsor, 'updatedAt'>): Promise<void> {
  const path = `sponsors/${sponsor.id}`;
  try {
    const docRef = doc(db, 'sponsors', sponsor.id);
    
    const payload: any = {
      id: sponsor.id,
      imageUrl: sponsor.imageUrl,
      text: sponsor.text,
      linkUrl: sponsor.linkUrl || '',
      isActive: sponsor.isActive !== false,
      updatedAt: serverTimestamp(),
    };

    await setDoc(docRef, payload, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

// Delete a sponsor
export async function deleteSponsor(id: string): Promise<void> {
  const path = `sponsors/${id}`;
  try {
    const docRef = doc(db, 'sponsors', id);
    await deleteDoc(docRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}
