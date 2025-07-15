import { useCallback, useEffect, useState, useRef } from "react";
import { useSnackbar } from 'notistack';
import { AxiosPromise } from "axios";

import { extractErrorMessage } from ".";

export interface RestRequestOptions<D> {
  read: () => AxiosPromise<D>;
  update?: (value: D) => AxiosPromise<D>;
}

export const useRest = <D>({ read, update }: RestRequestOptions<D>) => {
  const { enqueueSnackbar } = useSnackbar();
  const isMountedRef = useRef(true);

  const [saving, setSaving] = useState<boolean>(false);
  const [data, setData] = useState<D>();
  const [errorMessage, setErrorMessage] = useState<string>();

  const loadData = useCallback(async () => {
    if (!isMountedRef.current) return;
    
    setData(undefined);
    setErrorMessage(undefined);
    try {
      const response = await read();
      if (isMountedRef.current) {
        setData(response.data);
      }
    } catch (error: any) {
      if (isMountedRef.current) {
        const message = extractErrorMessage(error, 'Problem loading data');
        enqueueSnackbar(message, { variant: 'error' });
        setErrorMessage(message);
      }
    }
  }, [read, enqueueSnackbar]);

  const save = useCallback(async (toSave: D) => {
    if (!update || !isMountedRef.current) {
      return;
    }
    setSaving(true);
    setErrorMessage(undefined);
    try {
      const response = await update(toSave);
      if (isMountedRef.current) {
        setData(response.data);
        enqueueSnackbar("Update successful", { variant: 'success' });
      }
    } catch (error: any) {
      if (isMountedRef.current) {
        const message = extractErrorMessage(error, 'Problem saving data');
        enqueueSnackbar(message, { variant: 'error' });
        setErrorMessage(message);
      }
    } finally {
      if (isMountedRef.current) {
        setSaving(false);
      }
    }
  }, [update, enqueueSnackbar]);

  const saveData = () => data && save(data);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Cleanup: Mark component as unmounted to prevent state updates
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  return { loadData, saveData, saving, setData, data, errorMessage } as const;
};
