import { Suspense } from "react";
import { PlusCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { AlbumArtwork } from "@/components/album-artwork";
import { TrackArtwork } from "@/components/track-artwork";
import { Menu } from "@/components/menu";
import { PodcastEmptyPlaceholder } from "@/components/podcast-empty-placeholder";
import { Sidebar } from "@/components/sidebar";
import SearchInlineForm from "@/components/search-inline-form";
import SearchPagination from "@/components/search-pagination";
import { listenNowAlbums, madeForYouAlbums } from "@/lib/albums";
import { playlists } from "@/lib/playlists";
import { searchTracks } from '@/lib/soundcloud';
import { SoundCloudTrack } from '@/types/soundcloud';

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
  const resultsPerPage = 25;
  const offset = (page - 1) * resultsPerPage;

  try {
    const { tracks, nextHref } = await searchTracks(query, resultsPerPage, offset);
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
        </div>

        <Separator className="my-4" />

            <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {tracks.map((track: SoundCloudTrack) => (
                <TrackArtwork
                  key={track.id}
                  track={track}
                  className="w-[250px]"
                  aspectRatio="portrait"
                  width={250}
                  height={330}
                />
              ))}
            </div>

        <SearchPagination
          currentPage={page}
          hasNextPage={hasNextPage}
        />
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
    <>
      <div className="hidden md:block">
        <Menu />
        <div className="border-t">
          <div className="bg-background">
            <div className="grid lg:grid-cols-5">
              <Sidebar playlists={playlists} className="hidden lg:block" />
              <div className="col-span-3 lg:col-span-4 lg:border-l">
                <div className="h-full px-4 py-6 lg:px-8 ">
                  <Tabs defaultValue="music" className="h-full space-y-6">
                    <div className="space-between flex items-center">
                      <TabsList>
                        <TabsTrigger value="music" className="relative">
                          Music
                        </TabsTrigger>
                        <TabsTrigger value="podcasts">Podcasts</TabsTrigger>
                        <TabsTrigger value="live" disabled>
                          Live
                        </TabsTrigger>
                      </TabsList>
                      
                      {/* Search Form */}
                      <div className="mx-4 flex-1 max-w-md">
                        <SearchInlineForm />
                      </div>
                      
                      <div className="ml-auto">
                        <Button>
                          <PlusCircle />
                          Add music
                        </Button>
                      </div>
                    </div>
                    <TabsContent
                      value="music"
                      className="border-none p-0 outline-none h-[400px] "
                    >
                      {query ? (
                        <SearchResults query={query} page={page} />
                      ) : (
                        <>
                          <div className="flex items-center justify-between">
                            <div className="space-y-1">
                              <h2 className="text-2xl font-semibold tracking-tight">
                                Listen Now
                              </h2>
                              <p className="text-sm text-muted-foreground">
                                Top picks for you. Updated daily.
                              </p>
                            </div>
                          </div>
                          <Separator className="my-4" />
                          <div className="relative">
                            <ScrollArea>
                              <div className="flex space-x-4 pb-4">
                                {listenNowAlbums.map((album) => (
                                  <AlbumArtwork
                                    key={album.name}
                                    album={album}
                                    className="w-[250px]"
                                    aspectRatio="portrait"
                                    width={250}
                                    height={330}
                                  />
                                ))}
                              </div>
                              <ScrollBar orientation="horizontal" />
                            </ScrollArea>
                          </div>
                          <div className="mt-6 space-y-1">
                            <h2 className="text-2xl font-semibold tracking-tight">
                              Made for You
                            </h2>
                            <p className="text-sm text-muted-foreground">
                              Your personal playlists. Updated daily.
                            </p>
                          </div>
                          <Separator className="my-4" />
                          <div className="relative pb-4">
                            <ScrollArea>
                              <div className="flex space-x-4 pb-4">
                                {madeForYouAlbums.map((album) => (
                                  <AlbumArtwork
                                    key={album.name}
                                    album={album}
                                    className="w-[150px]"
                                    aspectRatio="square"
                                    width={150}
                                    height={150}
                                  />
                                ))}
                              </div>
                              <ScrollBar orientation="horizontal" />
                            </ScrollArea>
                          </div>
                        </>
                      )}
                    </TabsContent>
                    <TabsContent
                      value="podcasts"
                      className="h-full flex-col border-none p-0 data-[state=active]:flex"
                    >
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <h2 className="text-2xl font-semibold tracking-tight">
                            New Episodes
                          </h2>
                          <p className="text-sm text-muted-foreground">
                            Your favorite podcasts. Updated daily.
                          </p>
                        </div>
                      </div>
                      <Separator className="my-4" />
                      <PodcastEmptyPlaceholder />
                    </TabsContent>
                  </Tabs>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}