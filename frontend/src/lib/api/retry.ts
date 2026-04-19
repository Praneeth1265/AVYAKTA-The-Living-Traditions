// Retry helper for handling transient Supabase failures
interface RetryResult {
  data: unknown;
  error: unknown;
}

export async function retryWithBackoff<T extends RetryResult>(
  fn: () => Promise<T>,
  maxAttempts = 3,
  delayMs = 500,
): Promise<T> {
  let lastError: unknown;

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    try {
      const result = await fn();
      if (!result.error) return result;

      lastError = result.error;

      // Don't retry if it's a client error (4xx)
      const status = (result.error as { status?: number })?.status;
      if (typeof status === "number" && status >= 400 && status < 500) {
        return result;
      }

      if (attempt < maxAttempts - 1) {
        // Exponential backoff
        const delay = delayMs * Math.pow(2, attempt);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    } catch (error) {
      lastError = error;

      if (attempt < maxAttempts - 1) {
        const delay = delayMs * Math.pow(2, attempt);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }

  // Return final result with error
  return { data: null, error: lastError } as T;
}

// Wrapper for safe error extraction
export function getSafeErrorMessage(error: unknown): string {
  if (typeof error === "object" && error !== null && "message" in error) {
    return (error as { message: string }).message;
  }
  if (typeof error === "string") {
    return error;
  }
  return "An unknown error occurred";
}
