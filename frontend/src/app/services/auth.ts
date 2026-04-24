import type { LoginResponse } from '../types/auth';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

export async function loginRequest(email: string, password: string): Promise<LoginResponse> {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data?.message || 'No se pudo iniciar sesión');
  }

  return data;
}
