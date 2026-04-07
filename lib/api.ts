/**
 * API Configuration and Base Functions
 */

export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || "/api",
  TIMEOUT: 10000, // 10 seconds
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000, // 1 second
} as const;

/**
 * Custom API Error class
 */
export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public statusText: string,
    public data?: any
  ) {
    super(message);
    this.name = "ApiError";
  }
}

/**
 * Sleep utility for retry delays
 */
const sleep = (ms: number): Promise<void> =>
  new Promise(resolve => setTimeout(resolve, ms));

/**
 * Get authentication token from localStorage
 */
const getAuthToken = (): string | null => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("finance-token");
};

/**
 * Create headers for API requests
 */
const createHeaders = (customHeaders?: Record<string, string>): Headers => {
  const headers = new Headers(customHeaders || {});

  const token = getAuthToken();
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  if (!headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  return headers;
};

/**
 * Handle API response and throw appropriate errors
 */
const handleResponse = async (response: Response): Promise<any> => {
  if (!response.ok) {
    let errorMessage = "Erro na requisição";
    let errorData: any = null;

    try {
      errorData = await response.json();
      errorMessage = errorData.message || errorData.error || errorMessage;
    } catch {
      errorMessage = await response.text() || `HTTP ${response.status}: ${response.statusText}`;
    }

    throw new ApiError(errorMessage, response.status, response.statusText, errorData);
  }

  // Handle empty responses
  const contentType = response.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    return response.json();
  }

  return response.text();
};

/**
 * Base fetch function with retry logic and error handling
 */
export async function fetchApi(
  endpoint: string,
  options: RequestInit = {},
  retryCount = 0
): Promise<any> {
  const url = `${API_CONFIG.BASE_URL}${endpoint}`;
  const headers = createHeaders(options.headers as Record<string, string>);

  const config: RequestInit = {
    ...options,
    headers,
    signal: options.signal || AbortSignal.timeout(API_CONFIG.TIMEOUT),
  };

  try {
    const response = await fetch(url, config);
    return await handleResponse(response);
  } catch (error) {
    // Retry logic for network errors or 5xx server errors
    if (
      retryCount < API_CONFIG.RETRY_ATTEMPTS &&
      (error instanceof TypeError || // Network errors
       (error instanceof ApiError && error.status >= 500)) // Server errors
    ) {
      await sleep(API_CONFIG.RETRY_DELAY * Math.pow(2, retryCount)); // Exponential backoff
      return fetchApi(endpoint, options, retryCount + 1);
    }

    // Re-throw the error if no more retries or different error type
    if (error instanceof ApiError) {
      throw error;
    }

    // Handle other errors (network, timeout, etc.)
    throw new ApiError(
      error instanceof Error ? error.message : "Erro desconhecido na requisição",
      0,
      "Network Error"
    );
  }
}

/**
 * Convenience methods for common HTTP methods
 */
export const api = {
  get: (endpoint: string, options?: RequestInit) =>
    fetchApi(endpoint, { ...options, method: "GET" }),

  post: (endpoint: string, data?: any, options?: RequestInit) =>
    fetchApi(endpoint, {
      ...options,
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
    }),

  put: (endpoint: string, data?: any, options?: RequestInit) =>
    fetchApi(endpoint, {
      ...options,
      method: "PUT",
      body: data ? JSON.stringify(data) : undefined,
    }),

  patch: (endpoint: string, data?: any, options?: RequestInit) =>
    fetchApi(endpoint, {
      ...options,
      method: "PATCH",
      body: data ? JSON.stringify(data) : undefined,
    }),

  delete: (endpoint: string, options?: RequestInit) =>
    fetchApi(endpoint, { ...options, method: "DELETE" }),
};