'use client';

import { useEffect } from 'react';
import Clarity from '@microsoft/clarity';


const CLARITY_ID = 'x5tkk2esbf';

export function ClarityScript() {
  useEffect(() => {
    Clarity.init(CLARITY_ID);
  }, []);

  return null;
}
