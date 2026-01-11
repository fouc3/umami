import debug from 'debug';

const log = debug('umami:turnstile');

const verifyEndpoint = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';

export async function verifyTurnstile(token: string | undefined, secretKey: string): Promise<boolean> {
  if (!token) {
    return false;
  }

  try {
    const res = await fetch(verifyEndpoint, {
      method: 'POST',
      body: `secret=${encodeURIComponent(secretKey)}&response=${encodeURIComponent(token)}`,
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
      },
    });

    const data = await res.json();
    log(data);

    return data.success;
  } catch (e) {
    log(e);
    return false;
  }
}
