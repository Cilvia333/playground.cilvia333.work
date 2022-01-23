import React from 'react';
import { css } from '@emotion/react';
import tw from 'twin.macro';

import onDay001 from '~/day/001';

const MainCanvasStyle = css`
  ${tw`relative w-full`}
`;

const Day001Page: React.VFC = () => (
  <canvas css={MainCanvasStyle} ref={onDay001} />
);

export default Day001Page;
