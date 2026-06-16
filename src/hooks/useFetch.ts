import { useState, useEffect } from 'react';

// Define the blueprint for what this state tracker returns to our pages
interface FetchState<T> {
  data: T | null;
  loading: boolean;
  error: boolean;
}

export function useFetch<T>(url: string): FetchState<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);

  useEffect(() => {
    // 1. Initialize the network cancellation controller engine
    const controller = new AbortController();
    const { signal } = controller;

    const fetchData = async () => {
      setLoading(true);
      setError(false);
      
      try {
        const response = await fetch(url, { signal });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const json = await response.json();
        setData(json);
      } catch (err: unknown) {
        // FIXED HERE: Cast the unknown error to a standard Error object safely without using 'any'
        const errorInstance = err instanceof Error ? err : new Error(String(err));
        
        // CONDITION: Only log error if it wasn't an intentional user abort cancellation
        if (errorInstance.name !== 'AbortError') {
          console.error("Fetch failure error:", errorInstance.message);
          setError(true);
        }
      } finally {
        // This block always executes to cleanly close out tracking animations
        setLoading(false);
      }
    };

    fetchData();

    // THE CRITICAL CLEANUP FUNCTION: Automatically aborts active HTTP requests if user skips the view
    return () => {
      controller.abort();
    };
  }, [url]);

  return { data, loading, error };
}
