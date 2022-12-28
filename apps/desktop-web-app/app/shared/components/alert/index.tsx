import type { FC } from 'react';
import { useContext, useMemo } from 'react';
import { useEffect } from 'react';
import { memo } from 'react';
import { X } from 'react-feather';
import { AlertContext } from './alert-context';

export type AlertStatus = 'info' | 'error';

export const Alert: FC<{}> = memo(function Alert() {
  const { alert, setAlert } = useContext(AlertContext);
  const show = useMemo(() => {
    return alert != null;
  }, [alert]);
  useEffect(() => {
    let id: NodeJS.Timeout | undefined;
    if (show) {
      id = setTimeout(() => {
        setAlert(undefined);
      }, 3000);
    }
    return () => {
      id && clearTimeout(id);
    };
  }, [setAlert, show]);
  return alert != null ? (
    <div
      role="alert"
      className={`fixed top-3 right-4 z-30 pl-3 pr-2 py-2 border rounded flex items-center gap-4 ${
        alert.status === 'info'
          ? 'bg-green-100 border-green-500'
          : 'bg-red-100 border-red-500'
      }`}
    >
      <p className="text-xs font-semibold text-gray-900">{alert.message}</p>
      <button
        aria-label="close alert"
        className="p-0.5 hover:bg-gray-100 active:bg-gray-300 rounded-sm"
        onClick={() => {
          setAlert(undefined);
        }}
      >
        <X size={'1rem'} />
      </button>
    </div>
  ) : null;
});
