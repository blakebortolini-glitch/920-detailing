Deno.serve(async (_req) => {
  const siteKey = Deno.env.get('reCAPTCHA_site_key');
  if (!siteKey) {
    return Response.json({ error: 'Site key not configured' }, { status: 500 });
  }
  return Response.json({ siteKey });
});