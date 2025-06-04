# SoundCloud Search App

A modern Next.js application that allows users to search and discover music from SoundCloud's vast library using their official API. Built with server-side rendering, smart token management, and beautiful UI.

## Features

- 🎵 **Search SoundCloud tracks** - Find songs by title, artist, or keywords
- ⚡ **Server-side rendering** - Fast initial page loads and SEO-friendly
- 🔒 **Smart token management** - Automatic token refresh with Upstash KV storage
- 📄 **Pagination** - Browse through thousands of results with ease
- 📱 **Responsive design** - Works perfectly on desktop and mobile
- 🎨 **Modern UI** - Clean, SoundCloud-inspired design with Tailwind CSS

## Tech Stack

- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **SoundCloud API** - Official SoundCloud REST API
- **Upstash Redis** - Serverless Redis for token storage
- **React 19** - Latest React features

## Getting Started

### Prerequisites

- Node.js 18+ installed
- SoundCloud API credentials (Client ID and Secret)
- Upstash Redis database

### 1. SoundCloud API Setup

1. Go to [SoundCloud for Developers](https://developers.soundcloud.com/)
2. Create a new app to get your Client ID and Client Secret
3. Note: You'll need both for the Client Credentials flow

### 2. Upstash Redis Setup

1. Sign up at [Upstash](https://upstash.com/)
2. Create a new Redis database
3. Get your Redis REST URL and Token from the dashboard

### 3. Environment Variables

Create a `.env.local` file in the root directory:

```bash
# SoundCloud API credentials
SOUNDCLOUD_CLIENT_ID=your_soundcloud_client_id
SOUNDCLOUD_CLIENT_SECRET=your_soundcloud_client_secret

# Upstash KV for token storage
UPSTASH_REDIS_REST_URL=your_upstash_redis_rest_url
UPSTASH_REDIS_REST_TOKEN=your_upstash_redis_rest_token
```

### 4. Installation

```bash
# Install dependencies
npm install

# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## How It Works

### Authentication Flow

The app uses SoundCloud's **Client Credentials Flow** for authentication:

1. **Token Generation**: App exchanges Client ID + Secret for access token
2. **Token Storage**: Tokens stored in Upstash Redis with expiration
3. **Token Refresh**: Automatic refresh before expiration
4. **Rate Limiting**: Respects SoundCloud's rate limits (50 tokens/12h per app)

### Search & Pagination

- **Server-side Search**: `/search?q=query&page=1` handles search server-side
- **Smart Pagination**: Uses SoundCloud's `linked_partitioning` for efficient pagination
- **25 Results per Page**: Optimized for performance and user experience

## API Routes

- `/` - Homepage with app overview
- `/search` - Search page (supports query parameters)
- `/search?q=hello` - Search for "hello"
- `/search?q=hello&page=2` - Second page of results

## Project Structure

```
src/
├── app/
│   ├── layout.tsx           # Root layout
│   ├── page.tsx            # Homepage
│   └── search/
│       └── page.tsx        # Search page with SSR
├── components/
│   ├── SearchForm.tsx      # Client-side search form
│   ├── TrackCard.tsx       # Individual track display
│   └── Pagination.tsx      # Pagination controls
├── lib/
│   └── soundcloud.ts       # SoundCloud API utilities
└── types/
    └── soundcloud.ts       # TypeScript interfaces
```

## Key Features Explained

### Server-Side Rendering
- Search results are rendered server-side for better SEO and performance
- URL parameters drive the search state
- Supports direct links to search results

### Token Management
- Tokens automatically refresh before expiration
- Uses Redis for persistent storage across deployments
- Handles rate limiting gracefully

### Error Handling
- Graceful fallbacks for API errors
- User-friendly error messages
- Development error details in production

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Deployment

### Vercel (Recommended)

1. Deploy to Vercel:
   ```bash
   npm install -g vercel
   vercel
   ```

2. Add environment variables in Vercel dashboard:
   - `SOUNDCLOUD_CLIENT_ID`
   - `SOUNDCLOUD_CLIENT_SECRET`
   - `UPSTASH_REDIS_REST_URL`
   - `UPSTASH_REDIS_REST_TOKEN`

### Other Platforms

The app can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- Digital Ocean App Platform
- AWS Amplify

## Rate Limits & Considerations

- **SoundCloud API**: 50 tokens per 12 hours per app
- **Search Results**: Up to 200 results per request (we use 25 for optimal UX)
- **Token Lifetime**: ~1 hour (automatically refreshed)

## Troubleshooting

### Common Issues

1. **"Failed to get SoundCloud access token"**
   - Check your Client ID and Secret are correct
   - Ensure environment variables are set

2. **"SoundCloud API error: 401"**
   - Token may have expired, wait for automatic refresh
   - Verify API credentials

3. **Redis connection errors**
   - Check Upstash Redis URL and token
   - Verify Redis instance is active

### Debug Mode

Enable debug logging by adding to your `.env.local`:
```bash
NODE_ENV=development
```

## Support

If you encounter any issues or have questions:

1. Check the [SoundCloud API Documentation](https://developers.soundcloud.com/docs)
2. Review the [Next.js Documentation](https://nextjs.org/docs)
3. Open an issue in this repository

---

**Note**: This application is for educational and personal use. Make sure to comply with SoundCloud's Terms of Service when using their API.
# soundcloud-next-starter
