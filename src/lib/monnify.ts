// Monnify Sandbox API Helpers (For Demo Purposes Only)
// In a real application, you MUST NOT expose the Secret Key or make these calls from the frontend.
// They should be handled by a secure backend server.

const BASE_URL = import.meta.env.VITE_MONNIFY_BASE_URL || 'https://sandbox.monnify.com';
const API_KEY = import.meta.env.VITE_MONNIFY_API_KEY || '';
const SECRET_KEY = import.meta.env.VITE_MONNIFY_SECRET_KEY || '';
const CONTRACT_CODE = import.meta.env.VITE_MONNIFY_CONTRACT_CODE || ''; // Often needed for web SDK

export interface MonnifyAuthResponse {
  requestSuccessful: boolean;
  responseMessage: string;
  responseCode: string;
  responseBody: {
    accessToken: string;
    expiresIn: number;
  };
}

export async function getMonnifyAccessToken(): Promise<string> {
  const credentials = btoa(`${API_KEY}:${SECRET_KEY}`);
  
  const response = await fetch(`${BASE_URL}/api/v1/auth/login`, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${credentials}`,
      'Content-Type': 'application/json'
    }
  });

  const data: MonnifyAuthResponse = await response.json();
  if (data.requestSuccessful) {
    return data.responseBody.accessToken;
  }
  throw new Error(data.responseMessage || 'Failed to authenticate with Monnify');
}

export function loadMonnifyScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (window.MonnifySDK) {
      resolve();
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://sdk.monnify.com/plugin/monnify.js';
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load Monnify SDK'));
    document.body.appendChild(script);
  });
}
