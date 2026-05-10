import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';

let siteKeyCache = null;

export function useRecaptcha() {
  const [ready, setReady] = useState(false);
  const [siteKey, setSiteKey] = useState(null);

  useEffect(() => {
    const init = async () => {
      // Fetch site key once
      if (!siteKeyCache) {
        const res = await base44.functions.invoke('getRecaptchaSiteKey', {});
        siteKeyCache = res.data?.siteKey;
      }
      if (!siteKeyCache) return;
      setSiteKey(siteKeyCache);

      // Load reCAPTCHA script if not already loaded
      if (window.grecaptcha) {
        setReady(true);
        return;
      }
      const script = document.createElement('script');
      script.src = `https://www.google.com/recaptcha/api.js?render=${siteKeyCache}`;
      script.onload = () => {
        window.grecaptcha.ready(() => setReady(true));
      };
      document.head.appendChild(script);
    };
    init();
  }, []);

  const getToken = async (action = 'submit') => {
    if (!ready || !siteKey) throw new Error('reCAPTCHA not ready');
    return new Promise((resolve, reject) => {
      window.grecaptcha.ready(async () => {
        try {
          const token = await window.grecaptcha.execute(siteKey, { action });
          resolve(token);
        } catch (err) {
          reject(err);
        }
      });
    });
  };

  return { ready, getToken };
}