'use client';

import { useEffect, useRef, useState } from 'react';

declare global {
  interface Window {
    turnstile: any;
  }
}

interface TurnstileProps {
  siteKey: string;
  onSuccess: (token: string) => void;
}

export function Turnstile({ siteKey, onSuccess }: TurnstileProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scriptLoaded, setScriptLoaded] = useState(false);

  useEffect(() => {
    if (document.getElementById('turnstile-script')) {
      setScriptLoaded(true);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js';
    script.id = 'turnstile-script';
    script.async = true;
    script.defer = true;
    script.onload = () => setScriptLoaded(true);
    document.body.appendChild(script);
  }, []);

  useEffect(() => {
    if (scriptLoaded && containerRef.current && window.turnstile) {
      // Clear previous instance if any (though typically this effect runs once in this setup)
      containerRef.current.innerHTML = '';

      const id = window.turnstile.render(containerRef.current, {
        sitekey: siteKey,
        callback: (token: string) => {
          onSuccess(token);
        },
      });

      return () => {
        if (window.turnstile) {
          window.turnstile.remove(id);
        }
      };
    }
  }, [scriptLoaded, siteKey, onSuccess]);

  return <div ref={containerRef} />;
}
