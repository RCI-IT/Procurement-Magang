import useSWR from 'swr';
import { useEffect } from 'react';
import { fetcherWithToken } from '../../../services/fetcher';
import { apiURL } from '../../../services/apiURL';
import { setWithExpiry, getWithExpiry, getTokenWithExpiry } from '../../../services/localStorage';
import { Employee, ErrorResponse } from '../../../types';

const STORAGE_KEY = 'employees';
const TTL = 3600000; // 1 jam

export const useKaryawanData = () => {
  const token = getTokenWithExpiry();
  const cached = getWithExpiry(STORAGE_KEY);
  const shouldFetch = !!token;

  const { data, error } = useSWR<Employee[] | ErrorResponse>(
    shouldFetch ? `${apiURL}/api/employees` : null,
    fetcherWithToken,
    { fallbackData: cached }
  );

  useEffect(() => {
    if (data && !('message' in data)) {
      setWithExpiry(STORAGE_KEY, data, TTL);
    }
  }, [data]);

  const isNotFound =
    data && 'message' in data && data.message?.includes('not found');

  return {
    data: data && !('message' in data) ? data : [],
    error,
    isLoading: shouldFetch && !data && !error,
    isNotFound,
  };
};
