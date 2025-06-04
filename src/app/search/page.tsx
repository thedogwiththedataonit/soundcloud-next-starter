import { Suspense } from 'react';
import { searchTracks } from '@/lib/soundcloud';
import SearchForm from '@/components/SearchForm';
import TrackCard from '@/components/TrackCard';
import Pagination from '@/components/Pagination';
import { SoundCloudTrack } from '@/types/soundcloud';

interface SearchPageProps {
  searchParams: Promise<{
    q?: string;
    page?: string;
  }>;
}

function LoadingSpinner() {
  return (
    <div className="flex justify-center items-center py-12">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
    </div>
  );
}

function SearchResults({ query, page }: { query: string; page: number }) {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <SearchResultsContent query={query} page={page} />
    </Suspense>
  );
}

async function SearchResultsContent({ query, page }: { query: string; page: number }) {
  const resultsPerPage = 25;
  const offset = (page - 1) * resultsPerPage;
  

  try {
    const { tracks, nextHref } = await searchTracks(query, resultsPerPage, offset);
    console.log('tracks', tracks);
    const hasNextPage = !!nextHref;

    if (tracks.length === 0) {
      return (
        <div className="text-center py-12">
          <div className="text-gray-500 text-lg">
            No tracks found for "{query}"
          </div>
          <p className="text-gray-400 mt-2">
            Try adjusting your search terms or search for something else.
          </p>
        </div>
      );
    }

    return (
      <>
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            Search results for "{query}"
          </h2>
          <p className="text-gray-600 mt-1">
            Showing {tracks.length} tracks (page {page})
          </p>
        </div>

        <div className="space-y-4">
          {tracks.map((track: SoundCloudTrack) => (
            <TrackCard key={track.id} track={track} />
          ))}
        </div>

        <Pagination
          currentPage={page}
          hasNextPage={hasNextPage}
          resultsPerPage={resultsPerPage}
        />
      </>
    );
  } catch (error) {
    console.error('Search error:', error);
    return (
      <div className="text-center py-12">
        <div className="text-red-600 text-lg font-semibold">
          Error searching tracks
        </div>
        <p className="text-gray-600 mt-2">
          There was an issue searching SoundCloud. Please try again later.
        </p>
        <details className="mt-4 text-sm text-gray-500">
          <summary className="cursor-pointer">Error details</summary>
          <pre className="mt-2 text-left bg-gray-100 p-2 rounded">
            {error instanceof Error ? error.message : 'Unknown error'}
          </pre>
        </details>
      </div>
    );
  }
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  const query = params.q?.trim() || '';
  const page = Math.max(1, parseInt(params.page || '1', 10));

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              SoundCloud Search
            </h1>
            <p className="text-gray-600">
              Discover music from SoundCloud's vast library
            </p>
          </div>

          {/* Search Form */}
          <SearchForm />

          {/* Search Results */}
          {query ? (
            <SearchResults query={query} page={page} />
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-500 text-lg">
                Enter a search term to find tracks on SoundCloud
              </div>
              <p className="text-gray-400 mt-2">
                Search for songs, artists, genres, or any keyword
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 