import React from 'react';
import ReactDOM from 'react-dom/client';
import 'reset-css';
import { StencilProvider } from '@amzn/stencil-react-components/context';
import { brandTheme } from '@amzn/stencil-design-tokens/js/web/theme';
import { Global, css } from '@emotion/react';
import { BrowserRouter } from 'react-router-dom';
import App from './App';

const GlobalStyles = () => (
  <Global
    styles={css`
      * {
        box-sizing: border-box;
      }
      html,
      body,
      #root {
        min-height: 100vh;
      }
      html {
        font-family: sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        -webkit-text-size-adjust: 100%;
        text-rendering: optimizeLegibility;
      }
    `}
  />
);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <StencilProvider theme={brandTheme}>
      <BrowserRouter>
        <GlobalStyles />
        <App />
      </BrowserRouter>
    </StencilProvider>
  </React.StrictMode>
);
