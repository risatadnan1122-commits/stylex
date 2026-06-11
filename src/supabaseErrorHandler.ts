/**
 * STYLE X COLLECTIVE - CENTRALIZED SUPABASE ERROR HANDLER UTILITY
 * Consistently parses PostgreSQL and Supabase database codes into elegant,
 * luxury-brand friendly feedback notifications, and triggers micro-toasts.
 */

export interface LuxeErrorDetails {
  title: string;
  message: string;
  code?: string;
  originalError: any;
}

/**
 * Event-based toast Dispatcher to trigger the beautiful React toast container 
 * anywhere in the app (even inside non-React utilities or event listeners!).
 */
export const showLuxeToast = (
  message: string,
  type: 'success' | 'error' | 'info' | 'warning' = 'info',
  title?: string
) => {
  const event = new CustomEvent('luxe-toast-notification', {
    detail: { message, type, title }
  });
  window.dispatchEvent(event);
};

/**
 * High-precision parsing function returning refined luxury-tier user notices 
 * for typical database error codes (23505, 42501, 23502, 23503, PGRST116, etc.).
 */
export const parseSupabaseError = (error: any, contextDescription?: string): LuxeErrorDetails => {
  if (!error) {
    return {
      title: "SUCCESSFUL RECORD SECURED",
      message: "Your ledger update has been perfectly completed under strict cryptographic protocols.",
      code: "SUCCESS",
      originalError: null
    };
  }

  // Handle nested or string errors
  const rawMsg = typeof error === 'string' ? error : (error.message || error.msg || 'An unknown exception was intercepted.');
  const rawCode = typeof error === 'object' && error !== null ? String(error.code || '') : '';
  const hint = typeof error === 'object' && error !== null ? String(error.hint || '') : '';
  const details = typeof error === 'object' && error !== null ? String(error.details || '') : '';

  let title = "DATABASE INFRASTRUCTURE EXCEPTION";
  let message = rawMsg;

  // Exact mappings for typical PostgreSQL / PostgREST error codes
  if (rawCode === '42501' || rawMsg.toLowerCase().includes('row-level security') || rawMsg.toLowerCase().includes('insufficient privilege')) {
    title = "AESTHETIC SECURITY BLOCK";
    message = "The STYLE X Collective database declined this request. Safe guest sessions are restricted from altering cloud structures without validated root administrator credentials.";
  } else if (rawCode === '23505' || rawMsg.toLowerCase().includes('unique constraint') || rawMsg.toLowerCase().includes('already exists')) {
    title = "SPECIFICATION CLASH";
    message = "An exquisite catalog item with an identical identifier, slug, or transaction key already exists in our archives. Please utilize distinct profiles.";
  } else if (rawCode === '23503' || rawMsg.toLowerCase().includes('foreign key constraint')) {
    title = "CATALOG DECOUPLED";
    message = "This operation refers to a non-existent parent element (e.g. invalid product association, missing user account). Please confirm target structures exist.";
  } else if (rawCode === '23502' || rawMsg.toLowerCase().includes('not-null constraint')) {
    title = "INCOMPLETE SPECIFICATIONS";
    message = "One or more mandatory attributes (such as price, slug, or title) were omitted. Please complete luxury profiles before submitting saved edits.";
  } else if (rawCode === 'PGRST116') {
    title = "RECORD LOST IN ARCHIVES";
    message = "The specific document requested could not be located in our secure storage system. It may have been retired or amended.";
  } else if (rawMsg.toLowerCase().includes('failed to fetch') || rawMsg.toLowerCase().includes('networkerror') || rawMsg.toLowerCase().includes('network connection')) {
    title = "COMMUNICATION BREAKDOWN";
    message = "Impossible to establish an active synchronization bridge with Supabase. Check your coverage parameters or API service bounds.";
  } else if (rawCode === '42703' || rawMsg.toLowerCase().includes('column does not exist')) {
    title = "SCHEMA VERSION DISCREPANCY";
    message = "The localized database schema version deviates from the deployed Cloud layout. Sync your Supabase tables using the setup SQL.";
  } else {
    // General fallback parsing
    if (contextDescription) {
      message = `Our database returned an error during [${contextDescription}]: ${rawMsg}`;
    }
  }

  return {
    title,
    message,
    code: rawCode || undefined,
    originalError: error
  };
};

/**
 * Universal error orchestrator. Consistently parses, outputs detailed debug logs,
 * and triggers a gorgeous UX toast notification.
 */
export const supabaseErrorHandler = (
  error: any,
  contextDescription?: string
): LuxeErrorDetails => {
  const parsed = parseSupabaseError(error, contextDescription);
  
  // High-end server/client debug summary log
  console.error(`[Luxe Supabase Interceptor] Failed Action: "${contextDescription || 'CRUD transaction'}"`, {
    code: parsed.code,
    title: parsed.title,
    message: parsed.message,
    hint: typeof error === 'object' && error !== null ? error.hint : undefined,
    details: typeof error === 'object' && error !== null ? error.details : undefined,
    rawError: error
  });

  // Automatically dispatch visual toast
  showLuxeToast(parsed.message, 'error', `${parsed.title} (${contextDescription || 'Database Error'})`);

  return parsed;
};
