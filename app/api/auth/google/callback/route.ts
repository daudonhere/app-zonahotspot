import { NextRequest } from "next/server";
import { AUTH_ENDPOINTS } from "@/libs/api/endpoints";
import { getFullApiUrl } from "@/libs/api/utils";
export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const error = url.searchParams.get("error");
  if (error) {
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
    const tokenResponse = await fetch(getFullApiUrl(AUTH_ENDPOINTS.GOOGLE_CALLBACK), {
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
    const setCookieHeader = tokenResponse.headers.get("set-cookie");
    const responseHeaders: Record<string, string> = {
      'Content-Type': 'text/html',
    };
    if (setCookieHeader) {
      responseHeaders['Set-Cookie'] = setCookieHeader;
    }
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
      headers: responseHeaders,
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