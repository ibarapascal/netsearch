import React, { useCallback } from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from 'react-query';
import { HashRouter, Navigate, Route, Routes } from 'react-router-dom';

import { Search } from './components/Search';

function App(): JSX.Element {
  const queryClient = new QueryClient();
  const PageNotFound = useCallback((): JSX.Element => {
    return <p>page not found</p>;
  }, []);
  return (
    <QueryClientProvider client={queryClient}>
      <HashRouter>
        <Routes>
          <Route element={<Search />} path="search" />
          <Route element={<Navigate replace to="search" />} path="/" />
          <Route element={<PageNotFound />} path="/*" />
        </Routes>
      </HashRouter>
    </QueryClientProvider>
  );
}

document.body.style.margin = '0';
document.documentElement.lang = 'ja';
const rootElement = document.getElementById('root');
const root = createRoot(rootElement!);
root.render(<App />);
