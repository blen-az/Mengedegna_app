import { useEffect, useState } from 'react';
import { collection, query, where, onSnapshot, QueryConstraint } from 'firebase/firestore';
import { db } from '@/services/firebase';

export function useFirestore<T>(
  collectionName: string,
  constraints: QueryConstraint[] = [],
  deps: any[] = []
) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    const q = query(collection(db, collectionName), ...constraints);
    
    const unsubscribe = onSnapshot(q, 
      (snapshot) => {
        const items: T[] = [];
        snapshot.forEach((doc) => {
          items.push({ id: doc.id, ...doc.data() } as T);
        });
        setData(items);
        setLoading(false);
      },
      (err) => {
        console.error('Firestore subscription error:', err);
        setError(err as Error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, deps);

  return { data, loading, error };
}