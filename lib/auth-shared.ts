export function getAdminCookieName(nodeEnv = process.env.NODE_ENV) {
  // __Host- cookies cannot be scoped by a subdomain or a Domain attribute.
  // Keep the development name unprefixed because local HTTP is intentionally used there.
  return nodeEnv === 'production' ? '__Host-admin_session' : 'admin_session'
}

export const ADMIN_COOKIE = getAdminCookieName()

export const SESSION_MAX_AGE = 60 * 60 * 8
