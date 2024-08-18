'use client'
import { useState, useEffect, useRef } from 'react';
import * as Y from 'yjs';
import { WebsocketProvider } from 'y-websocket';
import { Guest } from '@/types/Project';

export function useYjsGuests(projectId: string, userData: Guest) {
  const [guests, setGuests] = useState<Guest[]>([]);
  const ydocRef = useRef<Y.Doc | null>(null);
  const providerRef = useRef<WebsocketProvider | null>(null);

  useEffect(() => {
    ydocRef.current = new Y.Doc();
    const yGuests = ydocRef.current.getArray<Guest>('guests');

    providerRef.current = new WebsocketProvider(
      'wss://demos.yjs.dev/ws', 
      `tetrips-project-guests-${projectId}`,
      ydocRef.current
    );

    const updateGuests = () => {
      const currentGuests = yGuests.toArray();
      setGuests(currentGuests);
    };

    const addCurrentUser = () => {
      const currentGuest: Guest = {
        email: userData.email,
        nickname: userData.nickname,
      };
      if (!yGuests.toArray().some(guest => guest.email === currentGuest.email)) {
        yGuests.push([currentGuest]);
      }
      updateGuests();
    };

    providerRef.current.on('sync', addCurrentUser);

    yGuests.observe(updateGuests);

    return () => {
      if (providerRef.current) {
        providerRef.current.off('sync', addCurrentUser);
        const index = yGuests.toArray().findIndex(guest => guest.email === userData.email);
        if (index !== -1) {
          yGuests.delete(index, 1);
        }
        providerRef.current.destroy();
      }
      if (ydocRef.current) {
        ydocRef.current.destroy();
      }
    };
  }, [projectId, userData]);


  return { guests};
}