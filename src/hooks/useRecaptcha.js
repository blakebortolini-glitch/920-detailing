import { useState, useEffect, useRef } from 'react';
import { base44 } from '@/api/base44Client';

let siteKeyCache = null;

export function useRecaptcha(containerId) {
  const [ready, setReady] = useState(false);
  const widgetIdRef = useRef(null);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => { mountedRef.current = false; };
  }, []);

  useEffect(() => {
    if (!containerId) return;

    const renderWidget = () => {
      const container = document.getElementById(containerId);
      if (!container || widgetIdRef.current !== null) return;
      try {
        widgetIdRef.current = window.grecaptcha.render(containerId, {
          sitekey: siteKeyCache,
        });
        if (mountedRef.current) setReady(true);
      } catch (e) {
        console.error('reCAPTCHA render error:', e);
      }
    };

    const init = async () => {
      if (!siteKeyCache) {
        const res = await base44.functions.invoke('getRecaptchaSiteKey', {});
        siteKeyCache = res.data?.siteKey;
      }
      if (!siteKeyCache) return;

      if (window.grecaptcha && window.grecaptcha.render) {
        // Already loaded — try immediately, then retry if container not ready yet
        renderWidget();
        if (widgetIdRef.current === null) {
          const timer = setInterval(() => {
            if (document.getElementById(containerId)) {
              clearInterval(timer);
              renderWidget();
            }
          }, 100);
          setTimeout(() => clearInterval(timer), 5000);
        }
        return;
      }

      // Script not yet loaded
      window.onRecaptchaLoad = renderWidget;

      if (!document.querySelector('script[src*="recaptcha/api.js"]')) {
        const script = document.createElement('script');
        script.src = `https://www.google.com/recaptcha/api.js?onload=onRecaptchaLoad&render=explicit`;
        script.async = true;
        script.defer = true;
        document.head.appendChild(script);
      }
    };

    init();
  }, [containerId]);

  const getToken = () => {
    if (!ready || widgetIdRef.current === null) throw new Error('reCAPTCHA not ready');
    const token = window.grecaptcha.getResponse(widgetIdRef.current);
    if (!token) throw new Error('Please complete the reCAPTCHA.');
    return token;
  };

  const reset = () => {
    if (widgetIdRef.current !== null) {
      window.grecaptcha.reset(widgetIdRef.current);
    }
  };

  return { ready, getToken, reset };
}