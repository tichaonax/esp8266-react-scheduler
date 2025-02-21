import { AxiosError } from "axios";

export const extractErrorMessage = (error: AxiosError, defaultMessage: string) => (
  error.message || defaultMessage
);
