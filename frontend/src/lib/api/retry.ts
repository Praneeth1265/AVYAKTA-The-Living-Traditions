// Retry helper for handling transient Supabase failures
export async function retryWithBackoff<T extends { data: any; error: any }>(
  fn: () => Promise<T>,
  maxAttempts = 3,
  delayMs = 500
): Promise<T> {
  let lastError: any;
  
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    try {
      const result = await fn();
      if (!result.error) return result;
      
      lastError = result.error;
      
      // Don't retry if it's a client error (4xx)
      if (result.error?.status >= 400 && result.error?.status < 500) {
        return result;
      }
      
      if (attempt < maxAttempts - 1) {
        // Exponential backoff
        const delay = delayMs * Math.pow(2, attempt);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    } catch (error) {
      lastError = error;
      
      if (attempt < maxAttempts - 1) {
        const delay = delayMs * Math.pow(2, attempt);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  
  // Return final result with error
  return { data: null, error: lastError } as T;
}

// Wrapper for safe error extraction
export function getSafeErrorMessage(error: any): string {
  if (error?.message) {
    return error.message;
  }
  if (typeof error === 'string') {
    return error;
  }
  return 'An unknown error occurred';
}
