import type { FC, ReactNode } from 'react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

const FOCUSABLE_ELEMENTS = [
  'a[href]',
  'area[href]',
  'input:not([disabled]):not([type="hidden"]):not([aria-hidden])',
  'select:not([disabled]):not([aria-hidden])',
  'textarea:not([disabled]):not([aria-hidden])',
  'button:not([disabled]):not([aria-hidden])',
  'iframe',
  'object',
  'embed',
  '[contenteditable]',
  '[tabindex]:not([tabindex^="-"])',
];

export const Dialog: FC<{
  children: ReactNode;
  isOpen: boolean;
  onClose: () => void;
}> = ({ children, isOpen, onClose }) => {
  const [dialogTriggerElement, setDialogTriggerElement] =
    useState<HTMLElement>();
  const titleId = useMemo(() => `create-folder-dialog-title`, []);

  const dialogRef = useRef<HTMLDivElement>(null);
  const beforeFocusElementRef = useRef<HTMLElement>();

  const getFocusableElements = () => {
    return dialogRef.current?.querySelectorAll<HTMLElement>(
      FOCUSABLE_ELEMENTS.join(', ')
    );
  };

  const trapFocus = useCallback((event: FocusEvent) => {
    if (dialogRef.current == null) {
      return;
    }
    const focusableElements = getFocusableElements();
    if (focusableElements == null || focusableElements?.length === 0) {
      return;
    }
    const firstFocusableElement = focusableElements[0];
    const lastFocusableElement =
      focusableElements[focusableElements.length - 1];

    // dialogからfocusが外れたら、強制的にdialog内にfocusを戻す
    if (!dialogRef.current.contains(event.target as Node)) {
      if (firstFocusableElement === beforeFocusElementRef.current) {
        lastFocusableElement.focus();
      } else if (lastFocusableElement === beforeFocusElementRef.current) {
        firstFocusableElement.focus();
      } else if (beforeFocusElementRef.current == null) {
        lastFocusableElement.focus();
      }
    }
    beforeFocusElementRef.current = event.target as HTMLElement;
  }, []);

  const closeDialogByEsc = useCallback(
    (event: KeyboardEvent) => {
      if (event.code === 'Escape') {
        onClose();
      }
    },
    [onClose]
  );

  const addEventListeners = useCallback(() => {
    document.addEventListener('focus', trapFocus, true);
    document.addEventListener('keydown', closeDialogByEsc);
  }, [closeDialogByEsc, trapFocus]);
  const removeEventListeners = useCallback(() => {
    document.removeEventListener('focus', trapFocus, true);
    document.removeEventListener('keydown', closeDialogByEsc);
  }, [closeDialogByEsc, trapFocus]);

  const changeBackgroundScrollBehavior = useCallback((isFixed) => {
    if (isFixed) {
      const scrollY = document.documentElement.scrollTop;
      document.body.style.position = 'fixed';
      document.body.style.top = `${scrollY * -1}px`;
      document.body.style.left = '0';
      document.body.style.width = '100%';
      document.body.style.height = '100%';
      document.body.style.overflow = 'hidden';
    } else {
      const top = Number(document.body.style.top.replace('px', ''));
      const scrollY = !Number.isNaN(top) ? top : 0;
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.left = '';
      document.body.style.width = '';
      document.body.style.height = '';
      document.body.style.overflow = '';
      window.scrollTo(0, scrollY * -1);
    }
  }, []);

  /**
   * NOTE:
   * dialogが開かれた時、下記を行う
   * - dialogの先頭要素にfocusする
   * - event listenerを登録
   * - dialogの背後要素をscroll不可にする
   */
  useEffect(() => {
    if (!isOpen) {
      return;
    }
    setDialogTriggerElement(document.activeElement as HTMLElement);
    const focusableElements = getFocusableElements();
    focusableElements?.[0]?.focus();
    addEventListeners();
    changeBackgroundScrollBehavior(true);
  }, [addEventListeners, changeBackgroundScrollBehavior, isOpen]);

  /**
   * NOTE:
   * dialogが閉じられた時、下記を行う
   * - dialogのtriggerボタンにfocusする
   * - event listenerを解除
   * * - dialogの背後要素をscroll可にする
   */
  useEffect(() => {
    if (isOpen) {
      return;
    }
    // dialogTriggerButtonRef.current?.focus();
    dialogTriggerElement?.focus();
    removeEventListeners();
    changeBackgroundScrollBehavior(false);
  }, [
    changeBackgroundScrollBehavior,
    dialogTriggerElement,
    isOpen,
    removeEventListeners,
  ]);

  return (
    <>
      <div className="flex justify-center">
        {isOpen && (
          <div className="fixed top-0 left-0 right-0 bottom-0 bg-gray-800 opacity-60"></div>
        )}
        <div
          ref={dialogRef}
          role={'dialog'}
          aria-modal={'true'}
          className={`${
            isOpen ? 'block' : 'hidden'
          } bg-white border border-gray-600 p-3 absolute top-8 shadow-lg`}
          aria-labelledby={titleId}
        >
          <h2 id={titleId}>Create Folder</h2>
          {children}
          {/* <input type="text" />
          <div>
            <button onClick={onClose}>cancel</button>
            <button>create</button>
          </div> */}
        </div>
      </div>
    </>
  );
};
