import { useState, useEffect, useRef } from 'react';
import { base44 } from '@/api/base44Client';

let siteKeyCache = null;

export function useRecaptcha(containerId) {
  const [ready, setReady] = useState(false);
  const [siteKey, setSiteKey] = useState(null);
  const widgetIdRef = useRef(null);

  useEffect(() => {
    const init = async () => {
      if (!siteKeyCache) {
        const res = await base44.functions.invoke('getRecaptchaSiteKey', {});
        siteKeyCache = res.data?.siteKey;
      }
      if (!siteKeyCache) return;
      setSiteKey(siteKeyCache);

      const renderWidget = () => {
        if (containerId && document.getElementById(containerId) && widgetIdRef.current === null) {
          widgetIdRef.current = window.grecaptcha.render(containerId, {
            sitekey: siteKeyCache,
          });
        }
        setReady(true);
      };

      if (window.grecaptcha && window.grecaptcha.render) {
        renderWidget();
        return;
      }

      // Load v2 script (no render= param)
      if (!document.querySelector('script[src*="recaptcha/api.js"]')) {
        const script = document.createElement('script');
        script.src = `https://www.google.com/recaptcha/api.js?onload=onRecaptchaLoad&render=explicit`;
        script.async = true;
        script.defer = true;
        window.onRecaptchaLoad = renderWidget;
        document.head.appendChild(script);
      } else {
        window.onRecaptchaLoad = renderWidget;
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