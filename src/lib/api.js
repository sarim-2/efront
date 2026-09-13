// Central place every frontend call to the backend goes through.
// Reads the backend URL from VITE_API_URL (set in .env locally and in
// Netlify's environment variables for production).
const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000').replace(/\/$/, '');

function getAdminToken() {
  return localStorage.getItem('adminToken');
}

async function request(path, { method = 'GET', body, auth = false, isFormData = false } = {}) {
  const headers = {};
  if (!isFormData) headers['Content-Type'] = 'application/json';

  if (auth) {
    const token = getAdminToken();
    if (token) headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers,
    body: isFormData ? body : body ? JSON.stringify(body) : undefined,
  });

  if (res.status === 401 && auth) {
    // Token missing/expired/invalid — bounce back to the admin login screen.
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminTokenExpiry');
    if (!window.location.pathname.startsWith('/admin/login')) {
      window.location.href = '/admin/login';
    }
  }

  let data = null;
  try {
    data = await res.json();
  } catch {
    // no JSON body (e.g. 204)
  }

  if (!res.ok) {
    const message = data?.message || `Request failed with status ${res.status}`;
    throw new Error(message);
  }

  return data;
}

export const api = {
  // Public storefront reads
  getProducts: () => request('/api/products'),
  getProduct: (id) => request(`/api/products/${id}`),
  getCategories: () => request('/api/categories'),
  getSettings: () => request('/api/settings'),

  // Admin auth
  login: (username, password) =>
    request('/api/auth/login', { method: 'POST', body: { username, password } }),
  verifyToken: () => request('/api/auth/verify', { auth: true }),

  // Admin writes (all require auth)
  createProduct: (payload) =>
    request('/api/products', { method: 'POST', body: payload, auth: true }),
  updateProduct: (id, payload) =>
    request(`/api/products/${id}`, { method: 'PUT', body: payload, auth: true }),
  deleteProduct: (id) => request(`/api/products/${id}`, { method: 'DELETE', auth: true }),

  createCategory: (payload) =>
    request('/api/categories', { method: 'POST', body: payload, auth: true }),
  updateCategory: (id, payload) =>
    request(`/api/categories/${id}`, { method: 'PUT', body: payload, auth: true }),
  deleteCategory: (id) => request(`/api/categories/${id}`, { method: 'DELETE', auth: true }),

  updateSettings: (payload) =>
    request('/api/settings', { method: 'PUT', body: payload, auth: true }),

  uploadImage: (file) => {
    const formData = new FormData();
    formData.append('image', file);
    return request('/api/upload', {
      method: 'POST',
      body: formData,
      auth: true,
      isFormData: true,
    });
  },
};
