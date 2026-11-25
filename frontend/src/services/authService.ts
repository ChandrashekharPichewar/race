import { User } from '../types/ride';

const API_BASE_URL = 'https://my-app-backend-4lw0.onrender.com/api';
const SESSION_USER_KEY = 'race_user';
const SESSION_USER_ID_KEY = 'userId';

export interface AuthApiResponse {
  userId: string;
  accessToken: string;
  refreshToken: string;
  firstname: string;
  lastname: string;
}

export interface SignupPayload {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  deviceId: string;
}

export interface LoginPayload {
  username: string;
  password: string;
  deviceId: string;
}

const setCookie = (name: string, value: string, maxAgeSeconds: number) => {
  document.cookie = `${encodeURIComponent(name)}=${encodeURIComponent(
    value
  )}; path=/; max-age=${maxAgeSeconds}; SameSite=Lax`;
};

const deleteCookie = (name: string) => {
  document.cookie = `${encodeURIComponent(name)}=; path=/; max-age=0; SameSite=Lax`;
};

const getCookie = (name: string): string | null => {
  const target = `${encodeURIComponent(name)}=`;
  const parts = document.cookie.split(';');
  for (const part of parts) {
    const trimmed = part.trim();
    if (trimmed.startsWith(target)) {
      return decodeURIComponent(trimmed.slice(target.length));
    }
  }
  return null;
};

export const getAuthToken = (): string | null => getCookie('accessToken');

export const hasAuthToken = (): boolean => {
  const token = getAuthToken();
  return Boolean(token && token.trim().length > 0);
};

export const storeAuthTokens = (accessToken: string, refreshToken: string) => {
  setCookie('accessToken', accessToken, 60 * 15); // 15 minutes
  setCookie('refreshToken', refreshToken, 60 * 60 * 24 * 7); // 7 days
};

export const clearAuthTokens = () => {
  deleteCookie('accessToken');
  deleteCookie('refreshToken');
};

export const saveUserSession = (user: User) => {
  sessionStorage.setItem(SESSION_USER_KEY, JSON.stringify(user));
  sessionStorage.setItem(SESSION_USER_ID_KEY, user.userId ?? user.id);
};

export const getUserSession = (): User | null => {
  const saved = sessionStorage.getItem(SESSION_USER_KEY);
  if (!saved) return null;
  try {
    return JSON.parse(saved) as User;
  } catch {
    return null;
  }
};

export const clearUserSession = () => {
  sessionStorage.removeItem(SESSION_USER_KEY);
  sessionStorage.removeItem(SESSION_USER_ID_KEY);
};

const extractErrorMessage = async (response: Response, fallback: string) => {
  try {
    const data = (await response.json()) as { error?: string; message?: string };
    return data.error || data.message || fallback;
  } catch {
    return fallback;
  }
};

export const registerDeviceId = async (deviceID: string): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/deviceId`, {
    method: 'POST',
    headers: {
      accept: '*/*',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ deviceID }),
  });

  if (response.status !== 200 && !response.ok) {
    const msg = await extractErrorMessage(
      response,
      `Device registration failed (${response.status}).`
    );
    throw new Error(msg);
  }
};

export const signupUser = async (payload: SignupPayload): Promise<AuthApiResponse> => {
  const response = await fetch(`${API_BASE_URL}/auth/signup`, {
    method: 'POST',
    headers: {
      accept: '*/*',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const msg = await extractErrorMessage(
      response,
      `Sign up failed (${response.status}).`
    );
    throw new Error(msg);
  }

  return (await response.json()) as AuthApiResponse;
};

export const loginUser = async (payload: LoginPayload): Promise<AuthApiResponse> => {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: {
      accept: '*/*',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const msg = await extractErrorMessage(
      response,
      `Sign in failed (${response.status}).`
    );
    throw new Error(msg);
  }

  return (await response.json()) as AuthApiResponse;
};
