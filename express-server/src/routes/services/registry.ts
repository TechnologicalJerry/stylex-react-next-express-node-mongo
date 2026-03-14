export const serviceNames = [
  'auth',
  'users',
  'tickets',
  'billing',
  'payments',
  'notifications',
  'analytics',
  'inventory',
  'search',
  'reports',
  'sla'
] as const;

export type ServiceName = (typeof serviceNames)[number];