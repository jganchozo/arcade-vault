"use client";

import { createContext, useContext, useEffect, useSyncExternalStore } from "react";
import {
  appendScore,
  migrateSavedScores,
  readUser,
  subscribeUser,
  writeUser,
  type MockUser,
  type SavedScore,
} from "@/lib/mock-session";

type Session = {
  user: MockUser | null;
  signIn: (user: MockUser | null) => void;
  signOut: () => void;
  saveScore: (entry: Omit<SavedScore, "at">) => void;
};

const SessionContext = createContext<Session | null>(null);

export function SessionProvider({ children }: { children: React.ReactNode }) {
  // Server snapshot is always signed out, so prerendered HTML never mismatches on hydration.
  const user = useSyncExternalStore(subscribeUser, readUser, () => null);

  // Once per load, move scores saved under the old Spanish game ids to the new ids (SPEC 04).
  useEffect(() => {
    migrateSavedScores();
  }, []);

  const session: Session = {
    user,
    signIn: writeUser,
    signOut: () => writeUser(null),
    saveScore: appendScore,
  };

  return <SessionContext value={session}>{children}</SessionContext>;
}

export function useSession() {
  const session = useContext(SessionContext);
  if (!session) throw new Error("useSession must be used inside <SessionProvider>");
  return session;
}
