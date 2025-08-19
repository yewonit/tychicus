const NODE_ENV = process.env.NODE_ENV;

const env = {
  production: {
    AUTH_BASE_URL: 'https://attendance.icoramdeo.com/auth',
    API_BASE_URL: 'https://attendance.icoramdeo.com/api',
    ADMIN_CONTACT: 'admin@example.com',
  },
  development: {
    AUTH_BASE_URL: 'https://attendance-dev.icoramdeo.com/auth',
    API_BASE_URL: 'https://attendance-dev.icoramdeo.com/api',
    ADMIN_CONTACT: 'admin@example.com',
  },
  local: {
    AUTH_BASE_URL: 'http://localhost:3000/auth',
    API_BASE_URL: 'http://localhost:3000/api',
    ADMIN_CONTACT: 'admin@example.com',
  },
};

export default NODE_ENV ? env[NODE_ENV] : env['development'];
