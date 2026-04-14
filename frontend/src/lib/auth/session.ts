import { SignJWT, jwtVerify, type JWTPayload } from "jose";

const SESSION_COOKIE_NAME = "avyakta-auth";
const SESSION_ALGORITHM = "HS256";
const SESSION_TTL = "7d";

export type SessionPayload = JWTPayload & {
  sub: string;
  email: string;
};

export function getSessionCookieName() {
  return SESSION_COOKIE_NAME;
}

function getSessionSecret(): Uint8Array | null {
  const secret =
    process.env.AUTH_SESSION_SECRET ?? process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!secret) {
    return null;
  }

  return new TextEncoder().encode(secret);
}

export async function createSessionToken(params: {
  userId: string;
  email: string;
}): Promise<string> {
  const secret = getSessionSecret();

  if (!secret) {
    throw new Error(
      "Missing AUTH_SESSION_SECRET (or fallback SUPABASE_SERVICE_ROLE_KEY)",
    );
  }

  return new SignJWT({ email: params.email })
    .setProtectedHeader({ alg: SESSION_ALGORITHM })
    .setSubject(params.userId)
    .setIssuedAt()
    .setExpirationTime(SESSION_TTL)
    .sign(secret);
}

export async function verifySessionId(
  token: string,
): Promise<SessionPayload | null> {
  const secret = getSessionSecret();

  if (!secret) {
    return null;
  }

  try {
    const { payload } = await jwtVerify(token, secret, {
      algorithms: [SESSION_ALGORITHM],
    });

    if (!payload.sub || typeof payload.email !== "string") {
      return null;
    }

    return payload as SessionPayload;
  } catch {
    return null;
  }
}
