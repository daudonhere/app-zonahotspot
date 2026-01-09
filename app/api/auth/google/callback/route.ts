// app/api/auth/google/callback/route.ts
import { NextRequest } from "next/server";
import { cookies } from "next/headers";

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const error = url.searchParams.get("error");

  if (error) {
    // Handle error case
    return new Response(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Login Failed</title>
          <script>
            if (window.opener) {
              window.opener.postMessage({ type: 'social_login_error', error: '${error}' }, '*');
              window.close();
            } else {
              window.location.href = '/auth';
            }
          </script>
        </head>
        <body>
          <p>Login failed: ${error}</p>
        </body>
      </html>
    `, {
      status: 400,
      headers: {
        'Content-Type': 'text/html',
      },
    });
  }

  if (!code) {
    return new Response(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Invalid Request</title>
        </head>
        <body>
          <p>No authorization code provided</p>
        </body>
      </html>
    `, {
      status: 400,
      headers: {
        'Content-Type': 'text/html',
      },
    });
  }

  try {
    // Exchange the code for tokens and get user info
    const tokenResponse = await fetch(process.env.NEXT_PUBLIC_API_URL + "/auth/google/callback", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ code }),
    });

    const tokenData = await tokenResponse.json();

    if (!tokenResponse.ok) {
      throw new Error(tokenData.message || "Failed to exchange code for tokens");
    }

    // Send success message to parent window
    return new Response(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Login Successful</title>
          <script>
            if (window.opener) {
              window.opener.postMessage({
                type: 'social_login_success',
                data: ${JSON.stringify(tokenData)}
              }, '*');
              window.close();
            } else {
              // If no opener, redirect to main page
              window.location.href = '/';
            }
          </script>
        </head>
        <body>
          <p>Login successful! This window should close automatically.</p>
        </body>
      </html>
    `, {
      status: 200,
      headers: {
        'Content-Type': 'text/html',
      },
    });
  } catch (error) {
    console.error("Google OAuth callback error:", error);
    return new Response(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Login Error</title>
        </head>
        <body>
          <p>Error during login: ${(error as Error).message}</p>
        </body>
      </html>
    `, {
      status: 500,
      headers: {
        'Content-Type': 'text/html',
      },
    });
  }
}