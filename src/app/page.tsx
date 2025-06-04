import { Suspense } from "react";

import { Separator } from "@/components/ui/separator";

import { TrackArtwork } from "@/components/track-artwork";
import { Menu } from "@/components/menu";
import { Sidebar } from "@/components/sidebar";
import SearchInlineForm from "@/components/search-inline-form";
import SearchPagination from "@/components/search-pagination";
import { playlists } from "@/lib/playlists";
import { searchTracks } from '@/lib/soundcloud';
import { SoundCloudTrack } from '@/types/soundcloud';
import { SongEmptyPlaceholder } from "@/components/song-empty-placeholder";
import { BlurFade } from "@/components/ui/blur-fade";

interface MusicPageProps {
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
  const resultsPerPage = 35;
  const offset = (page - 1) * resultsPerPage;

  try {
    const { tracks, nextHref } = await searchTracks(query, resultsPerPage, offset);
    console.log(tracks);
    const hasNextPage = !!nextHref;

    if (tracks.length === 0) {
      return (
        <div className="text-center py-12">
          <div className="text-muted-foreground text-lg">
            No tracks found for &quot;{query}&quot;
          </div>
          <p className="text-muted-foreground/70 mt-2">
            Try adjusting your search terms or search for something else.
          </p>
        </div>
      );
    }

    return (
      <>
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-2xl font-semibold tracking-tight">
              Search results for &quot;{query}&quot;
            </h2>
            <p className="text-sm text-muted-foreground">
              Showing {tracks.length} tracks (page {page})
            </p>

          </div>
          <SearchPagination
            currentPage={page}
            hasNextPage={hasNextPage}
          />
        </div>


        <Separator className="my-4" />

        <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4 sm:gap-6 overflow-y-auto h-full">
          {tracks.map((track: SoundCloudTrack, index: number) => (
            <BlurFade key={track.id} delay={0.25 + index * 0.05} inView className="w-full h-full">
              <TrackArtwork
                key={track.id}
                track={track}
                aspectRatio="portrait"
              />
            </BlurFade>
          ))}
        </div>
      </>
    );
  } catch (error) {
    console.error('Search error:', error);
    return (
      <div className="text-center py-12">
        <div className="text-destructive text-lg font-semibold">
          Error searching tracks
        </div>
        <p className="text-muted-foreground mt-2">
          There was an issue searching SoundCloud. Please try again later.
        </p>
        <details className="mt-4 text-sm text-muted-foreground">
          <summary className="cursor-pointer">Error details</summary>
          <pre className="mt-2 text-left bg-muted p-2 rounded">
            {error instanceof Error ? error.message : 'Unknown error'}
          </pre>
        </details>
      </div>
    );
  }
}

export default async function MusicPage({ searchParams }: MusicPageProps) {
  const params = await searchParams;
  const query = params.q?.trim() || '';
  const page = Math.max(1, parseInt(params.page || '1', 10));

  return (
    <div className="h-screen w-full">
      <Menu />
      <div className="border-t h-[calc(100vh-40px)]">
        <div className="bg-background">
          <div className="grid lg:grid-cols-5">
            <Sidebar playlists={playlists} className="hidden lg:block" />
            <div className="col-span-3 lg:col-span-4 lg:border-l">
              <div className="h-full px-4 py-6 lg:px-8 ">
                {/* Search Form */}
                <div className="mx-0 flex-1 pb-2 w-full">
                  <SearchInlineForm />
                </div>

                <div
                  className="border-none p-0 outline-none h-[calc(100vh-230px)]"
                >
                  {query ? (
                    <SearchResults query={query} page={page} />
                  ) : (
                    <>
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <h2 className="text-2xl font-semibold tracking-tight">
                            Search to get started
                          </h2>
                          <p className="text-sm text-muted-foreground">
                            Play music from SoundCloud.
                          </p>
                        </div>
                      </div>
                      <Separator className="my-4" />
                      <SongEmptyPlaceholder />
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}