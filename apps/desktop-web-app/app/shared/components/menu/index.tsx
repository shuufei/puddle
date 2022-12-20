import type { FC, ReactNode } from 'react';
import { useEffect, useRef, useState } from 'react';
import { MoreHorizontal } from 'react-feather';

export type MenuPorps = { position?: 'left' | 'right' };

export const Menu: FC<MenuPorps & { children: ReactNode }> = ({
  children,
  position = 'right',
}) => {
  const [isOpened, setOpened] = useState(false);

  const menuRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const toggleMenuHandler = (event: MouseEvent) => {
      if (
        menuButtonRef.current?.contains(event.target as Node) ||
        menuRef.current?.contains(event.target as Node)
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
        } ${position === 'left' ? 'right-0' : 'left-0'}`}
        ref={menuRef}
        onClick={(e) => {
          e.preventDefault();
        }}
      >
        {children}
      </div>
    </div>
  );
};
