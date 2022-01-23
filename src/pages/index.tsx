import React, { useState } from 'react';
import { css, keyframes } from '@emotion/react';
import tw from 'twin.macro';
import logo from '~/assets/svgs/logo.svg';

const Index: React.VFC = () => {
  const [count, setCount] = useState(0);

  return (
    <div css={app}>
      <header css={appHeader}>
        <img src={logo} css={appLogo} alt="logo" />
        <p>Hello Vite + React!</p>
        <p>
          <button
            css={button}
            type="button"
            onClick={() => setCount((count) => count + 1)}
          >
            count is: {count}
          </button>
        </p>
        <p>
          Edit <code>App.tsx</code> and save to test HMR updates.
        </p>
        <p>
          <a
            css={appLink}
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
          {` | `}
          <a
            css={appLink}
            href="https://vitejs.dev/guide/features.html"
            target="_blank"
            rel="noopener noreferrer"
          >
            Vite Docs
          </a>
        </p>
      </header>
    </div>
  );
};

const appLogoSpin = keyframes`
    from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

const app = css`
  ${tw`text-center`}
`;

const appLogo = css`
  ${tw`pointer-events-none h-56`}
  @media (prefers-reduced-motion: no-preference) {
    animation: ${appLogoSpin} infinite 20s linear;
  }
`;

const appHeader = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  font-size: calc(10px + 2vmin);
  color: white;
  background-color: #282c34;
`;

const appLink = css`
  color: #61dafb;
`;

const button = css`
  font-size: calc(10px + 2vmin);
`;

export default Index;
