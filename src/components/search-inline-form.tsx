'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function SearchInlineForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState('');
  const [mounted, setMounted] = useState(false);

  // Handle hydration
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      const q = searchParams.get('q');
      if (q) {
        setQuery(q);
      }
    }
  }, [searchParams, mounted]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      const params = new URLSearchParams(searchParams.toString());
      params.set('q', query.trim());
      params.delete('page'); // Reset to first page on new search
      router.push(`/?${params.toString()}`);
    } else {
      // Clear search if empty
      const params = new URLSearchParams(searchParams.toString());
      params.delete('q');
      params.delete('page');
      router.push(`/?${params.toString()}`);
    }
  };

  const handleClear = () => {
    setQuery('');
    const params = new URLSearchParams(searchParams.toString());
    params.delete('q');
    params.delete('page');
    router.push(`/?${params.toString()}`);
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2 w-full">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          type="text"
          value={mounted ? query : ''}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for songs..."
          className="pl-10 pr-10 h-10 w-full"
        />
        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            ×
          </button>
        )}
      </div>
      <Button type="submit"  className="h-10">
        Search
      </Button>
    </form>
  );
} 