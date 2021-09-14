import { ChatKittyPaginator } from 'chatkitty';
import { RefObject, useEffect, useRef, useState } from 'react';
import { useVisibility } from 'ui-kit/hooks/useVisibility';

interface UsePaginatorProps<I> {
  paginator: () => Promise<ChatKittyPaginator<I> | null> | void;
  dependencies: unknown[];
  onInitialPageFetched?: (items: I[]) => void;
  onPageFetched?: (items: I[]) => void;
  debounce?: number;
  isEnabled?: boolean;
}

const usePaginator = <I>({
  paginator,
  dependencies,
  onInitialPageFetched = () => {},
  onPageFetched = () => {},
  debounce = 500,
  isEnabled = true,
}: UsePaginatorProps<I>): {
  loading: boolean;
  items: I[];
  prepend: (newItems: I[]) => void;
  append: (newItems: I[]) => void;
  containerRef: RefObject<HTMLDivElement>;
  boundaryRef: RefObject<HTMLDivElement>;
} => {
  const [loading, setLoading] = useState(false);

  const [currentPaginator, setCurrentPagination] =
    useState<ChatKittyPaginator<I> | null>(null);

  const [items, setItems] = useState<I[]>([]);

  // refs and intersection observers for infinite scroll
  const containerRef = useRef<HTMLDivElement>(null);
  const boundaryRef = useRef<HTMLDivElement>(null);

  const atEnd = useVisibility(boundaryRef, containerRef, 0, '0px 0px 0px 0px');

  useEffect(() => {
    const p = paginator();

    setLoading(true);

    if (!p) {
      return;
    }

    p.then((p) => {
      setCurrentPagination(p);

      if (p) {
        setItems(p.items);

        onInitialPageFetched(p.items);

        onPageFetched(p.items);
      }

      setLoading(false);
    });
  }, dependencies);

  const shouldUpdate =
    !loading && atEnd && currentPaginator?.hasNextPage && isEnabled;

  // infinite scroll
  useEffect(() => {
    let scheduled: ReturnType<typeof setTimeout> | null = null;

    if (shouldUpdate) {
      // fetch next page
      (async () => {
        if (scheduled !== null) {
          clearTimeout(scheduled);
        }

        setLoading(true);

        if (currentPaginator) {
          const next = await currentPaginator.nextPage();

          setItems((old) => [...old, ...next.items]);

          setCurrentPagination(next);

          onPageFetched(next.items);
        }

        // enforce a delay between fetching pages
        scheduled = setTimeout(() => {
          setLoading(false);
        }, debounce);
      })();
    }

    return () => {
      if (scheduled !== null) {
        clearTimeout(scheduled);
      }
    };
  }, [loading, atEnd, currentPaginator, isEnabled]);

  const prepend = (newItems: I[]) => {
    setItems((current) => [...newItems, ...current]);
  };

  const append = (newItems: I[]) => {
    setItems((current) => [...current, ...newItems]);
  };

  return { loading, items, prepend, append, containerRef, boundaryRef };
};

export { usePaginator };
