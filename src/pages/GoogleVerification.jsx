import { useEffect } from 'react';

export default function GoogleVerification() {
  useEffect(() => {
    document.title = 'google-site-verification';
  }, []);

  return (
    <pre style={{ fontFamily: 'monospace', padding: '20px' }}>
      google-site-verification: google896bcd66563ea31c.html
    </pre>
  );
}