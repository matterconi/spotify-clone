import NextAuth from 'next-auth';
import SpotifyProvider from 'next-auth/providers/spotify';

const scopes = [
  'user-read-private',               // Access to user's private profile
  'user-read-email',                 // Access to user's email address
  'playlist-read-private',           // Access to private playlists
  'playlist-read-collaborative',     // Access to collaborative playlists
  'playlist-modify-private',         // Modify private playlists
  'playlist-modify-public',          // Modify public playlists
  'user-library-read',               // Access user's saved albums and tracks
  'user-library-modify',             // Modify user's saved albums and tracks
].join(' ');

const authorizationUrl = `https://accounts.spotify.com/authorize?scope=${scopes}`;

export const handler = NextAuth({
  providers: [
    SpotifyProvider({
      clientId: process.env.SPOTIFY_CLIENT_ID,
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
      authorization: authorizationUrl, // Authorization URL with proper scopes
    }),
  ],
  callbacks: {
    async jwt({ token, account, profile }) {
      if (account) {
        token.accessToken = account.access_token; // Store access token in JWT
        token.refreshToken = account.refresh_token; // Store refresh token
        token.id = profile.id; // Store Spotify user ID
        token.accessTokenExpires = Date.now() + account.expires_in * 1000; // Set token expiry time
      }

      // Refresh token logic: Check if token has expired
      if (Date.now() < token.accessTokenExpires) {
        return token; // Token is still valid
      } else {
        return await refreshAccessToken(token); // Refresh token if expired
      }
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken; // Attach access token to session
      session.refreshToken = token.refreshToken; // Attach refresh token to session
      session.user.id = token.id; // Attach Spotify user ID to session
      return session;
    },
  },
});

// Helper function to refresh the access token
async function refreshAccessToken(token) {
  try {
    const url = 'https://accounts.spotify.com/api/token';
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${Buffer.from(
          `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
        ).toString('base64')}`,
      },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: token.refreshToken,
      }),
    });

    const refreshedTokens = await response.json();

    if (!response.ok) {
      throw new Error('Failed to refresh access token');
    }

    return {
      ...token,
      accessToken: refreshedTokens.access_token,
      accessTokenExpires: Date.now() + refreshedTokens.expires_in * 1000,
      refreshToken: refreshedTokens.refresh_token ?? token.refreshToken, // Fall back to old refresh token
    };
  } catch (error) {
    console.error('Error refreshing access token:', error);
    return { ...token, error: 'RefreshAccessTokenError' };
  }
}

export { handler as GET, handler as POST };
