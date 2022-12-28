import { createContext } from 'react';
import type { AlertStatus } from '.';

export type AlertData = { id: string; message: string; status: AlertStatus };

export const AlertContext = createContext<{
  alert: AlertData | undefined;
  setAlert: (alertData: AlertData | undefined) => void;
}>({
  alert: undefined,
  setAlert: () => {},
});
