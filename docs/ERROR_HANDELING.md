# Next.js Error Handling — Complete Reference

A practical guide covering every error scenario in a Next.js 15 App Router project.

---

## Quick Reference

| Scenario | File / Method | User action |
|---|---|---|
| Page not found | `app/not-found.tsx` | Go home |
| Route crash / server error | `app/error.tsx` | Retry or go home |
| Root layout crash | `app/global-error.tsx` | Retry or go home |
| NextAuth auth failure | `app/auth/error/page.tsx` | Try again / go home |
| OAuth error on login page | Read `?error=` in login form | Inline banner |
| Fetch failure in page | Check `res.ok`, return fallback UI | N/A |
| Missing resource | `notFound()` + `not-found.tsx` | Go home |
| API call error | Toast + throw (client fetch wrapper) | Inline / retry |

---

## 1. 404 — Page Not Found

**File:** `app/not-found.tsx`  
Triggered automatically when `notFound()` is called or a route simply doesn't exist.

```tsx
// app/not-found.tsx
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center space-y-6">
        <p className="text-sm text-muted-foreground uppercase tracking-widest">404</p>
        <h1 className="text-3xl font-semibold">Page not found</h1>
        <p className="text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Button asChild>
          <Link href="/">Go to Home</Link>
        </Button>
      </div>
    </div>
  );
}
```

**Trigger it programmatically:**
```tsx
// app/blog/[slug]/page.tsx
import { notFound } from "next/navigation";

export default async function Page({ params }) {
  const post = await getPost(params.slug);
  if (!post) notFound(); // renders not-found.tsx
  return <div>{post.title}</div>;
}
```

**Segment-level 404s:** Place `not-found.tsx` inside any route folder  
(e.g. `app/blog/not-found.tsx`) to scope it to that subtree.

---

## 2. Route Error Boundary

**File:** `app/error.tsx`  
Catches unexpected runtime errors inside any Server or Client Component in the subtree.  
Must be a `"use client"` component. Receives `error` and `reset` props.

```tsx
// app/error.tsx
"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;            // re-renders the segment, no full reload
}) {
  useEffect(() => {
    // error.digest matches your server log entries — never shown to users
    if (error.digest) console.error("digest:", error.digest);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center space-y-6">
        <h1 className="text-3xl font-semibold">Something went wrong</h1>
        <p className="text-muted-foreground">
          We ran into a problem. This is likely temporary — try again.
        </p>
        {error.digest && (
          <p className="text-xs text-muted-foreground/60 font-mono">Ref: {error.digest}</p>
        )}
        <div className="flex gap-3 justify-center">
          <Button onClick={reset}>Try Again</Button>
          <Button variant="outline" asChild>
            <Link href="/">Go to Home</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
```

> **Scoping:** Place `error.tsx` inside any route folder for granular control.  
> Errors bubble up to the nearest parent error boundary.

> **Production note:** `error.message` is scrubbed for server-side errors to prevent
> leaking sensitive info. Only `error.digest` is safe to surface to users.

---

## 3. Global Error Boundary

**File:** `app/global-error.tsx`  
Catches crashes in the root `layout.tsx` itself (e.g. a Provider throwing).  
**Must render its own `<html>` and `<body>`** since the layout is gone.  
Import your CSS directly so styles are available.

```tsx
// app/global-error.tsx
"use client";

import "./globals.css"; // must import CSS manually — layout is bypassed

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center space-y-6">
            <h1 className="text-3xl font-semibold">App failed to load</h1>
            <p className="text-muted-foreground">
              A critical error occurred. Please try again or go home.
            </p>
            <div className="flex gap-3 justify-center">
              <button onClick={reset}>Try Again</button>
              <a href="/">Go to Home</a>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
```

> **CSS import caveat:** TypeScript may complain about `import "./globals.css"` in a
> `"use client"` component. Fix by adding a `src/types/css.d.ts`:
> ```ts
> declare module "*.css" {
>   const content: Record<string, string>;
>   export default content;
> }
> ```

---

## 4. NextAuth / Auth.js Error Page

**File:** `app/auth/error/page.tsx`  
**Config:** `pages: { error: "/auth/error" }` in your `auth.ts`

NextAuth redirects all auth failures to `pages.error` with `?error=<ErrorCode>`.
Without this config it falls back to its own built-in `/api/auth/error` page.

```ts
// lib/auth.ts
export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [...],
  pages: {
    signIn: "/login",
    error: "/auth/error",   // ← your custom error page
  },
  // ...
});
```

```tsx
// app/auth/error/page.tsx  (Server Component — no "use client" needed)
import Link from "next/link";
import { Button } from "@/components/ui/button";

const ERROR_MAP: Record<string, { title: string; description: string }> = {
  OAuthCallbackError:    { title: "Sign-in failed",          description: "Google sign-in couldn't complete. Please try again." },
  AccessDenied:          { title: "Access denied",           description: "Your account doesn't have permission to sign in." },
  OAuthAccountNotLinked: { title: "Account already exists",  description: "This email is linked to a different sign-in method." },
  OAuthSignInError:      { title: "Couldn't connect",        description: "We couldn't start the Google sign-in process." },
  InvalidCheck:          { title: "Cookies required",        description: "Enable cookies in your browser and try again." },
  CallbackRouteError:    { title: "Sign-in failed",          description: "Something went wrong. Please try again." },
  Verification:          { title: "Link expired",            description: "This sign-in link has expired. Request a new one." },
  Configuration:         { title: "Server error",            description: "There is a problem with the server configuration." },
};

const DEFAULT = {
  title: "Authentication error",
  description: "An unexpected error occurred. Please try again.",
};

export default async function AuthErrorPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const { title, description } = (error && ERROR_MAP[error]) || DEFAULT;

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center space-y-6 max-w-md">
        <h1 className="text-2xl font-semibold">{title}</h1>
        <p className="text-muted-foreground">{description}</p>
        {error && <p className="text-xs text-muted-foreground/50 font-mono">Error: {error}</p>}
        <Button asChild>
          <Link href="/login">Try Again</Link>
        </Button>
      </div>
    </div>
  );
}
```

### Common NextAuth Error Codes

| Code | Cause | User action |
|---|---|---|
| `OAuthCallbackError` | User denied Google or OAuth callback failed | Retry |
| `AccessDenied` | `signIn()` callback returned `false` | Contact support |
| `OAuthAccountNotLinked` | Email exists under a different provider | Use original sign-in method |
| `OAuthSignInError` | Couldn't initiate OAuth flow | Retry |
| `InvalidCheck` | PKCE/state/nonce check failed (cookies blocked) | Enable cookies |
| `CallbackRouteError` | Generic callback error | Retry |
| `Configuration` | Missing env vars or misconfigured provider | Fix server config |
| `Verification` | Email magic link expired | Request new link |
| `MissingCSRF` | CSRF token missing | Retry |
| `JWTSessionError` | JWT decode/encode failed | Sign in again |

---

## 5. OAuth Error Banner on Login Page

When NextAuth bounces an error back to your sign-in page (e.g. `?error=OAuthCallbackError`),
read and display it inline so users don't navigate away from the form.

```tsx
// In your login form component
const OAUTH_ERRORS: Record<string, string> = {
  OAuthCallbackError:    "Google sign-in failed. Please try again.",
  AccessDenied:          "Your account doesn't have permission to sign in.",
  OAuthAccountNotLinked: "This email uses a different sign-in method.",
  InvalidCheck:          "Cookies must be enabled to sign in.",
  Default:               "Sign-in failed. Please try again.",
};

export function LoginForm() {
  const searchParams = useSearchParams();
  const errorCode = searchParams.get("error");
  const oauthError = errorCode
    ? (OAUTH_ERRORS[errorCode] ?? OAUTH_ERRORS.Default)
    : null;

  return (
    <>
      {oauthError && (
        <div className="flex items-start gap-2 rounded-lg bg-destructive/10 border border-destructive/20 px-3 py-2.5">
          <AlertTriangle className="w-4 h-4 text-destructive mt-0.5 shrink-0" />
          <p className="text-sm text-destructive">{oauthError}</p>
        </div>
      )}
      {/* rest of form */}
    </>
  );
}
```

---

## 6. Expected Errors in Server Components

For predictable failures (bad API response, missing data) don't throw — return fallback UI.

```tsx
// app/dashboard/page.tsx
export default async function Page() {
  const res = await fetch("https://api.example.com/data");

  if (!res.ok) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Failed to load data.</p>
      </div>
    );
  }

  const data = await res.json();
  return <div>{data.title}</div>;
}
```

---

## 7. Expected Errors in Server Actions

Use `useActionState` and **return** errors as values — never throw.

```ts
// app/actions.ts
"use server";

export async function submitForm(prevState: any, formData: FormData) {
  const res = await fetch("...", { method: "POST" });
  if (!res.ok) {
    return { error: "Submission failed. Please try again." }; // ← return, don't throw
  }
  return { success: true };
}
```

```tsx
// app/ui/form.tsx
"use client";
import { useActionState } from "react";
import { submitForm } from "@/app/actions";

export function MyForm() {
  const [state, formAction, pending] = useActionState(submitForm, {});

  return (
    <form action={formAction}>
      {state?.error && <p className="text-destructive text-sm">{state.error}</p>}
      <button disabled={pending}>Submit</button>
    </form>
  );
}
```

---

## 8. Event Handler Errors

Error boundaries don't catch errors inside event handlers. Use `useState` + try/catch.

```tsx
"use client";
import { useState } from "react";

export function RiskyButton() {
  const [error, setError] = useState<string | null>(null);

  const handleClick = async () => {
    setError(null);
    try {
      await doSomethingRisky();
    } catch (err) {
      setError("Action failed. Please try again.");
    }
  };

  return (
    <>
      <button onClick={handleClick}>Do Something</button>
      {error && <p className="text-sm text-destructive mt-2">{error}</p>}
    </>
  );
}
```

---

## 9. Client-Side Fetch Wrapper Pattern

Centralise API error handling in one place so every fetch call gets consistent error toasts
and components only need to catch truly unexpected errors.

```ts
// lib/client.ts
export async function fetchClient<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, options);

  if (!res.ok) {
    const data = await res.json().catch(() => null);
    const message = data?.message ?? `${res.status} ${res.statusText}`;

    // Show toast for 4xx (expected, non-crashing)
    if (res.status < 500) {
      toast.error(message);
      return data as T;
    }

    // Throw for 5xx so error boundary can catch it
    throw new Error(message);
  }

  return res.json();
}
```

---

## File Checklist for a New Project

```
src/app/
├── not-found.tsx          # 404
├── error.tsx              # Route-level error boundary
├── global-error.tsx       # Root layout crash
└── auth/
    └── error/
        └── page.tsx       # NextAuth error page

src/lib/
└── auth.ts                # pages: { error: "/auth/error" }

src/types/
└── css.d.ts               # declare module "*.css" (for global-error CSS import)
```
