import App from './App.tsx';
import './Global.css';
import metadata from './assets/contract_transfer.json';
import React from 'react';
import ReactDOM from 'react-dom/client';
import 'ui/style.css';
import { UseInkProvider } from 'useink';
import { AlephTestnet } from 'useink/chains';
import { NotificationsProvider } from 'useink/notifications';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <UseInkProvider
      config={{
        dappName: metadata.contract.name,
        chains: [AlephTestnet],
        caller: {
          default: '5CFP5rsvHBaKpuPp9HJeXSYxagH2dQMhb23LyXQoPeyNkeDL',
        },
      }}
    >
      <NotificationsProvider>
        <App />
      </NotificationsProvider>
    </UseInkProvider>
  </React.StrictMode>,
);
