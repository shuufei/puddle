import type { FC, ReactNode } from 'react';
import { memo } from 'react';
import { useEffect, useRef, useState } from 'react';
import { MoreHorizontal } from 'react-feather';

export type MenuPorps = { position?: 'left' | 'right' | 'top-left' };

export const Menu: FC<MenuPorps & { children: ReactNode }> = memo(
  function Menu({ children, position = 'right' }) {
    const [isOpened, setOpened] = useState(false);

    const menuRef = useRef<HTMLDivElement>(null);
    const menuButtonRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
      const toggleMenuHandler = (event: MouseEvent) => {
        if (
          menuButtonRef.current?.contains(event.target as Node)
          // ||
          // menuRef.current?.contains(event.target as Node)
        ) {
          return;
        }
        setOpened((current) => {
          return current ? false : current;
        });
      };
      document.addEventListener('click', toggleMenuHandler);
      return () => {
        document.removeEventListener('click', toggleMenuHandler);
      };
    }, []);

    return (
      <div className="relative">
        <button
          ref={menuButtonRef}
          data-dropdown-toggle="menu"
          className="p-1 rounded-sm hover:bg-gray-100 active:bg-gray-200"
          aria-label={isOpened ? 'close menu' : 'open menu'}
          onClick={(event) => {
            event.preventDefault();
            setOpened(!isOpened);
          }}
        >
          <MoreHorizontal size={'1rem'} />
        </button>
        <div
          className={`p-2 z-10 absolute shadow-md bg-white whitespace-nowrap rounded ${
            isOpened ? 'visible' : 'hidden'
          } ${
            position === 'left'
              ? 'right-0'
              : position === 'right'
              ? 'left-0'
              : 'right-0 -top-1 -translate-y-full'
          }`}
          ref={menuRef}
          onClick={(e) => {
            e.preventDefault();
          }}
        >
          {children}
        </div>
      </div>
    );
  }
);
