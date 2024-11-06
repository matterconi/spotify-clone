'use client'; // Mark this file as a Client Component

import { SessionProvider } from 'next-auth/react';
import { ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

const SessionProviderWrapper = ({ children }: Props) => {
  return <SessionProvider>{children}</SessionProvider>;
};

export default SessionProviderWrapper;
