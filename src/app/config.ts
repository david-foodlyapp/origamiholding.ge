export const CONFIG = {
  API_BASE_URL: (window as any).ENV_CONFIG?.API_BASE_URL || (import.meta as any).env.VITE_API_BASE_URL || "https://api.origamiholding.com",
};
