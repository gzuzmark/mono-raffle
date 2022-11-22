/* eslint-disable react/prop-types */
import { type AppType } from 'next/app';
import { type Session } from 'next-auth';
import { SessionProvider } from 'next-auth/react';
import { MoralisProvider } from 'react-moralis';
import { NotificationProvider } from '@web3uikit/core';
import { trpc } from '../utils/trpc';

import '../styles/globals.css';

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => (
  <SessionProvider session={session}>
    <MoralisProvider initializeOnMount={false}>
      <NotificationProvider>
        <Component {...pageProps} />
      </NotificationProvider>
    </MoralisProvider>
  </SessionProvider>
);

export default trpc.withTRPC(MyApp);
