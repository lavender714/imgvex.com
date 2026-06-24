import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

const GET_USER_TIMEOUT_MS = 4000;

async function getUserWithTimeout(supabase: ReturnType<typeof createServerClient>, timeoutMs: number) {
  return Promise.race([
    supabase.auth.getUser(),
    new Promise<{ data: { user: null }; error: Error }>((_, reject) =>
      setTimeout(
        () => reject(new Error(`supabase.auth.getUser() exceeded ${timeoutMs}ms`)),
        timeoutMs
      )
    ),
  ]);
}

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  try {
    await getUserWithTimeout(supabase, GET_USER_TIMEOUT_MS);
  } catch (err) {
    // Fail open: let the request continue as an unauthenticated user.
    // This prevents Vercel 504 MIDDLEWARE_INVOCATION_TIMEOUT when Supabase is slow.
    console.warn("[middleware] auth getUser timeout/failed, continuing unauthenticated:", err);
  }

  return supabaseResponse;
}
