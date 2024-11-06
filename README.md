# Spotify Clone 🎶

This project is a Spotify-inspired music app that allows users to explore music, create and manage playlists, and more. Developed using **Next.js**, **Redux** for state management, **RESTful APIs** for data fetching, and **NextAuth** for authentication, this app offers a responsive and dynamic experience inspired by Spotify's interface.

## Demo

[Deployed Application](https://your-live-url.vercel.app) - *(Replace this URL with your deployed app’s URL)*

## Features

- **Music Search and Explore**: Search for tracks, artists, and albums.
- **Playlist Management**: Create, view, and manage playlists, add or remove songs.
- **Favorite Tracks**: Easily save favorite tracks for quick access.
- **Authentication with Spotify**: Securely log in using your Spotify account.
- **Responsive Design**: Optimized for both desktop and mobile devices.

## Technologies Used

- **Next.js** - React framework for server-rendered applications.
- **Redux** - State management for seamless data flow across the app.
- **NextAuth** - Authentication with Spotify API for user login.
- **Tailwind CSS** - Utility-first CSS framework for styling.
- **Axios** - For handling RESTful API requests to fetch Spotify data.

## Getting Started

### Prerequisites

Ensure you have **Node.js** and **npm** installed on your machine. You’ll also need to create a Spotify Developer account to obtain API credentials.

### Environment Variables

Create a `.env.local` file in the project root with the following environment variables:

```plaintext
NEXT_PUBLIC_SPOTIFY_CLIENT_ID=your_spotify_client_id
NEXT_PUBLIC_SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
NEXTAUTH_URL=http://localhost:3000  # or your deployed URL
JWT_SECRET=your_jwt_secret  # for NextAuth session security
```

# Installation

### Clone the repository:

```bash
git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name
```

### Install dependencies:

```bash
npm install
```

### Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

# Project Structure

- **`app/`**: Contains all pages and components structured by feature.
- **`redux/`**: Manages global state with Redux, especially for handling playlists, tracks, and UI toggles.
- **`hooks/`**: Contains custom hooks, including those for search and library actions.
- **`components/`**: Reusable components, such as `Navbar`, `Library`, `PlaylistComponent`, and `TrackItem`. 
- 
# Deployment on Vercel

To deploy this Next.js app on Vercel:

1. **Push your code to GitHub**.
2. **Import the GitHub repo to Vercel**.
3. **Set up environment variables** in Vercel’s dashboard under **Settings > Environment Variables**.
4. **Click Deploy**.

For more details, visit [Next.js Deployment Documentation](https://nextjs.org/docs/app/building-your-application/deploying).

# Acknowledgements

- **[Spotify API](https://developer.spotify.com/documentation/web-api/)** - For providing access to Spotify's vast music database.
- **[Next.js](https://nextjs.org)** - For powering this app’s front-end framework.
- **[Vercel](https://vercel.com)** - For hosting and seamless Next.js integration.

# Learn More

Explore additional resources to learn more about the technologies used:

- [Next.js Documentation](https://nextjs.org/docs)
- [Redux Documentation](https://redux.js.org/introduction/getting-started)
- [NextAuth Documentation](https://next-auth.js.org/getting-started/introduction)