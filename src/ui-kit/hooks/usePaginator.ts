import { ChatKittyPaginator } from 'chatkitty';
import { RefObject, useEffect, useRef, useState } from 'react';
import { useVisibility } from 'ui-kit/hooks/useVisibility';

const usePaginator = <I>(
  paginator: ChatKittyPaginator<I>,
  isEnabled = true,
  debounce = 500
): {
  loading: boolean;
  results: I[][] | null;
  containerRef: RefObject<HTMLDivElement>;
  endRef: RefObject<HTMLDivElement>;
} => {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<I[][] | null>(null);
  const [prev, setPagination] = useState<ChatKittyPaginator<I> | null>(null);
  // refs and intersection observers for infinite scroll
  const containerRef = useRef<HTMLDivElement>(null);
  const endRef = useRef<HTMLDivElement>(null);
  // TODO: this needs to be a parameter
  const atEnd = useVisibility(endRef, containerRef, 0, '0px 0px 500px 0px');

  useEffect(() => {
    setLoading(false);
  }, []);

  const shouldUpdate =
    !loading && (atEnd || prev === null) && paginator.hasNextPage && isEnabled;

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

        const next = await paginator.nextPage();

        const current = next.items;

        if (current.length > 0) {
          setResults((old) => {
            if (prev && old) {
              return [...old, current];
            } else {
              return [current];
            }
          });
        }

        setPagination(next);

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
  }, [prev, debounce, shouldUpdate]);

  return { loading, results, containerRef, endRef };
};

export { usePaginator };
