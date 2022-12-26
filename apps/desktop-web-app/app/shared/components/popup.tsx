import type { FC, ReactNode } from 'react';
import { useEffect, useRef } from 'react';

export type PopupPorps = {
  isOpen: boolean;
  onClose: () => void;
  triggerButton: ReactNode;
  position?: 'left' | 'right' | 'top-left';
};

export const Popup: FC<PopupPorps & { children: ReactNode }> = ({
  children,
  isOpen,
  onClose,
  triggerButton,
  position = 'right',
}) => {
  const menuRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const toggleMenuHandler = (event: MouseEvent) => {
      if (
        menuButtonRef.current?.contains(event.target as Node)
        // ||
        // menuRef.current?.contains(event.target as Node)
      ) {
        return;
      }
      if (isOpen) {
        onClose();
      }
    };
    document.addEventListener('click', toggleMenuHandler);
    return () => {
      document.removeEventListener('click', toggleMenuHandler);
    };
  }, [isOpen, onClose]);

  return (
    <div className="relative leading-none">
      <div ref={menuButtonRef} className={'inline-block'}>
        {triggerButton}
      </div>
      <div
        className={`p-2 z-10 absolute shadow-md bg-white whitespace-nowrap rounded border border-gray-100 ${
          isOpen ? 'visible' : 'hidden'
        } ${
          position === 'left'
            ? 'right-0 -bottom-1 translate-y-full'
            : position === 'right'
            ? 'left-0 -bottom-1 translate-y-full'
            : 'right-0 -top-1 -translate-y-full'
        }`}
        ref={menuRef}
      >
        {children}
      </div>
    </div>
  );
};
