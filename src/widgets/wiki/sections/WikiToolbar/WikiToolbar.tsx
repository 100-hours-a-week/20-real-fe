'use client';

import {
  forwardRef,
  HTMLAttributes,
  MutableRefObject,
  Ref,
  RefCallback,
  RefObject,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import * as React from 'react';

import { BlockQuoteButton } from '@/widgets/tiptap-editor/tiptap-ui/blockquote-button';
import { CodeBlockButton } from '@/widgets/tiptap-editor/tiptap-ui/code-block-button';
import { HeadingDropdownMenu } from '@/widgets/tiptap-editor/tiptap-ui/heading-dropdown-menu';
import { ImageUploadButton } from '@/widgets/tiptap-editor/tiptap-ui/image-upload-button';
import { LinkPopover } from '@/widgets/tiptap-editor/tiptap-ui/link-popover';
import { ListDropdownMenu } from '@/widgets/tiptap-editor/tiptap-ui/list-dropdown-menu';
import { MarkButton } from '@/widgets/tiptap-editor/tiptap-ui/mark-button';
import { Spacer } from '@/widgets/tiptap-editor/tiptap-ui-primitive/spacer';
import { ToolbarGroup, ToolbarSeparator } from '@/widgets/tiptap-editor/tiptap-ui-primitive/toolbar';

type BaseProps = HTMLAttributes<HTMLDivElement>;

interface ToolbarProps extends BaseProps {
  variant?: 'floating' | 'fixed';
}

const mergeRefs = <T,>(refs: Array<RefObject<T> | Ref<T> | null | undefined>): RefCallback<T> => {
  return (value) => {
    refs.forEach((ref) => {
      if (typeof ref === 'function') {
        ref(value);
      } else if (ref != null) {
        (ref as MutableRefObject<T | null>).current = value;
      }
    });
  };
};

const useObserveVisibility = (ref: RefObject<HTMLElement | null>, callback: () => void): void => {
  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    let isMounted = true;

    if (isMounted) {
      requestAnimationFrame(callback);
    }

    const observer = new MutationObserver(() => {
      if (isMounted) {
        requestAnimationFrame(callback);
      }
    });

    observer.observe(element, {
      childList: true,
      subtree: true,
      attributes: true,
    });

    return () => {
      isMounted = false;
      observer.disconnect();
    };
  }, [ref, callback]);
};

const useToolbarKeyboardNav = (toolbarRef: RefObject<HTMLDivElement | null>): void => {
  useEffect(() => {
    const toolbar = toolbarRef.current;
    if (!toolbar) return;

    const getFocusableElements = () =>
      Array.from(
        toolbar.querySelectorAll<HTMLElement>(
          'button:not([disabled]), [role="button"]:not([disabled]), [tabindex="0"]:not([disabled])',
        ),
      );

    const navigateToIndex = (e: KeyboardEvent, targetIndex: number, elements: HTMLElement[]) => {
      e.preventDefault();
      let nextIndex = targetIndex;

      if (nextIndex >= elements.length) {
        nextIndex = 0;
      } else if (nextIndex < 0) {
        nextIndex = elements.length - 1;
      }

      elements[nextIndex]?.focus();
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      const focusableElements = getFocusableElements();
      if (!focusableElements.length) return;

      const currentElement = document.activeElement as HTMLElement;
      const currentIndex = focusableElements.indexOf(currentElement);

      if (!toolbar.contains(currentElement)) return;

      const keyActions: Record<string, () => void> = {
        ArrowRight: () => navigateToIndex(e, currentIndex + 1, focusableElements),
        ArrowDown: () => navigateToIndex(e, currentIndex + 1, focusableElements),
        ArrowLeft: () => navigateToIndex(e, currentIndex - 1, focusableElements),
        ArrowUp: () => navigateToIndex(e, currentIndex - 1, focusableElements),
        Home: () => navigateToIndex(e, 0, focusableElements),
        End: () => navigateToIndex(e, focusableElements.length - 1, focusableElements),
      };

      const action = keyActions[e.key];
      if (action) {
        action();
      }
    };

    const handleFocus = (e: FocusEvent) => {
      const target = e.target as HTMLElement;
      if (toolbar.contains(target)) {
        target.setAttribute('data-focus-visible', 'true');
      }
    };

    const handleBlur = (e: FocusEvent) => {
      const target = e.target as HTMLElement;
      if (toolbar.contains(target)) {
        target.removeAttribute('data-focus-visible');
      }
    };

    toolbar.addEventListener('keydown', handleKeyDown);
    toolbar.addEventListener('focus', handleFocus, true);
    toolbar.addEventListener('blur', handleBlur, true);

    const focusableElements = getFocusableElements();
    focusableElements.forEach((element) => {
      element.addEventListener('focus', handleFocus);
      element.addEventListener('blur', handleBlur);
    });

    return () => {
      toolbar.removeEventListener('keydown', handleKeyDown);
      toolbar.removeEventListener('focus', handleFocus, true);
      toolbar.removeEventListener('blur', handleBlur, true);

      const focusableElements = getFocusableElements();
      focusableElements.forEach((element) => {
        element.removeEventListener('focus', handleFocus);
        element.removeEventListener('blur', handleBlur);
      });
    };
  }, [toolbarRef]);
};

const useToolbarVisibility = (ref: RefObject<HTMLDivElement | null>): boolean => {
  const [isVisible, setIsVisible] = useState(true);
  const isMountedRef = useRef(false);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const checkVisibility = useCallback(() => {
    if (!isMountedRef.current) return;

    const toolbar = ref.current;
    if (!toolbar) return;

    // Check if any group has visible children
    const hasVisibleChildren = Array.from(toolbar.children).some((child) => {
      if (!(child instanceof HTMLElement)) return false;
      if (child.getAttribute('role') === 'group') {
        return child.children.length > 0;
      }
      return false;
    });

    setIsVisible(hasVisibleChildren);
  }, [ref]);

  useObserveVisibility(ref, checkVisibility);
  return isVisible;
};

export const WikiToolbar = forwardRef<HTMLDivElement, ToolbarProps>(
  ({ children, className, variant = 'fixed', ...props }, ref) => {
    const toolbarRef = useRef<HTMLDivElement>(null);
    const isVisible = useToolbarVisibility(toolbarRef);

    useToolbarKeyboardNav(toolbarRef);

    if (!isVisible) return null;

    return (
      <div
        ref={mergeRefs([toolbarRef, ref])}
        role="toolbar"
        aria-label="toolbar"
        data-variant={variant}
        className={`tiptap-toolbar ${className || ''}`}
        {...props}
      >
        {children}
      </div>
    );
  },
);

WikiToolbar.displayName = 'WikiToolbar';

export const MainToolbarContent = () => {
  return (
    <>
      <Spacer />

      <ToolbarSeparator />

      <ToolbarGroup>
        <HeadingDropdownMenu levels={[1, 2, 3, 4]} />
        <ListDropdownMenu types={['bulletList', 'orderedList', 'taskList']} />
        <BlockQuoteButton />
        <CodeBlockButton />
      </ToolbarGroup>

      <ToolbarSeparator />

      <ToolbarGroup>
        <MarkButton type="bold" />
        <MarkButton type="italic" />
        <MarkButton type="strike" />
        <MarkButton type="code" />
        <MarkButton type="underline" />
        <LinkPopover />
      </ToolbarGroup>

      <ToolbarSeparator />

      <ToolbarGroup>
        <ImageUploadButton text="Add" />
      </ToolbarGroup>

      <Spacer />
    </>
  );
};
