import * as zenWasm from '@gorules/zen-engine-wasm';
import zenWasmUrl from '@gorules/zen-engine-wasm/dist/zen_engine_wasm_bg.wasm?url';

import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClientProvider } from '@tanstack/react-query';

import './main.css';

import '@mlw-packages/react-components/dist/index.css';

import 'react-ace';

import 'ace-builds/src-noconflict/ext-language_tools';
import 'ace-builds/src-noconflict/mode-json5';
import 'ace-builds/src-noconflict/mode-liquid';
import 'ace-builds/src-noconflict/mode-javascript';
import 'ace-builds/src-noconflict/mode-typescript';
import 'ace-builds/src-noconflict/snippets/javascript';
import 'ace-builds/src-noconflict/theme-chrome';

import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { HomePage } from './pages/home';
import { DecisionSimplePage } from './pages/decision-simple';
import { RuleDetailsPage } from './pages/rule-details';
import { NotFoundPage } from './pages/not-found';
import { queryClient } from './lib/query-client';
import { ThemeProviderBase, Toaster, TooltipProviderBase } from '@mlw-packages/react-components';
import { IconContext } from '@phosphor-icons/react';

await zenWasm.default(zenWasmUrl);

const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />,
  },
  {
    path: '/rule/:ruleId',
    element: <RuleDetailsPage />,
  },
  {
    path: '/editor',
    element: <DecisionSimplePage />,
  },
  {
    path: '/editor/:flowId',
    element: <DecisionSimplePage />,
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
]);

const iconContextValue = { size: 20, mirrored: false };

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProviderBase defaultTheme="light">
        <TooltipProviderBase>
          <IconContext.Provider value={iconContextValue}>
            <RouterProvider router={router} />
            <Toaster />
          </IconContext.Provider>
        </TooltipProviderBase>
      </ThemeProviderBase>
    </QueryClientProvider>
  </React.StrictMode>,
);
