'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface SearchPaginationProps {
  currentPage: number;
  hasNextPage: boolean;
}

export default function SearchPagination({ 
  currentPage, 
  hasNextPage
}: SearchPaginationProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const navigateToPage = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    if (page > 1) {
      params.set('page', page.toString());
    } else {
      params.delete('page');
    }
    router.push(`/?${params.toString()}`);
  };

  return (
    <div className="flex items-center justify-between pt-6 border-t">
      <div className="flex flex-1 justify-between sm:hidden">
        <Button
          variant="outline"
          onClick={() => navigateToPage(currentPage - 1)}
          disabled={currentPage <= 1}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          onClick={() => navigateToPage(currentPage + 1)}
          disabled={!hasNextPage}
        >
          Next
        </Button>
      </div>
      <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-muted-foreground">
            Page <span className="font-medium">{currentPage}</span>
          </p>
        </div>
        <div>
          <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigateToPage(currentPage - 1)}
              disabled={currentPage <= 1}
              className="rounded-r-none"
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="sr-only">Previous</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigateToPage(currentPage + 1)}
              disabled={!hasNextPage}
              className="rounded-l-none -ml-px"
            >
              <span className="sr-only">Next</span>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </nav>
        </div>
      </div>
    </div>
  );
} 