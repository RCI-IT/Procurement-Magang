import useSWR from 'swr';
import { useEffect } from 'react';
import { getDepartemenData } from '../departemenService';
import { getWithExpiry, setWithExpiry } from '../../../services/localStorage';

const STORAGE_KEY = 'departemen';
const TTL = 3600000;

export const useDepartemenData = () => {
  const cached = getWithExpiry(STORAGE_KEY);

  const { data, error } = useSWR('/departemen', getDepartemenData, {
    fallbackData: cached,
  });

  useEffect(() => {
    if (data) {
      setWithExpiry(STORAGE_KEY, data, TTL);
    }
  }, [data]);

  return {
    data: data || [],
    error,
    isLoading: !data && !error,
  };
};
