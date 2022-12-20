import React, { useCallback } from 'react';
import ReactDOM from 'react-dom';
import { HashRouter, Navigate, Route, Routes } from 'react-router-dom';

import { Sample } from './_sample';

function App(): JSX.Element {
  const PageNotFound = useCallback((): JSX.Element => {
    return <p>page not found</p>;
  }, []);
  return (
    <HashRouter>
      <Routes>
        <Route element={<Sample />} path="sample" />
        <Route element={<Navigate replace to="sample" />} path="/" />
        <Route element={<PageNotFound />} path="/*" />
      </Routes>
    </HashRouter>
  );
}

document.body.style.margin = '0';
document.documentElement.lang = 'ja';
const rootElement = document.getElementById('root');
ReactDOM.render(<App />, rootElement);
