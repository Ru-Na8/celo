// Simple auth utilities for admin
// In production, use a proper auth library like NextAuth.js

const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "celo2024"; // Change in production!

// Simple token generation (in production, use JWT)
function generateToken(): string {
  return Buffer.from(`${Date.now()}-${Math.random().toString(36)}`).toString("base64");
}

// Store active sessions (in production, use Redis or database)
const sessions = new Map<string, { username: string; expiresAt: number }>();

export const auth = {
  login: (username: string, password: string): string | null => {
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      const token = generateToken();
      sessions.set(token, {
        username,
        expiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
      });
      return token;
    }
    return null;
  },

  logout: (token: string): void => {
    sessions.delete(token);
  },

  verifyToken: (token: string): boolean => {
    const session = sessions.get(token);
    if (!session) return false;
    if (Date.now() > session.expiresAt) {
      sessions.delete(token);
      return false;
    }
    return true;
  },

  getSession: (token: string) => {
    const session = sessions.get(token);
    if (!session || Date.now() > session.expiresAt) {
      return null;
    }
    return session;
  },
};
