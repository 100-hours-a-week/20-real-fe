'use client';

import * as React from 'react';
import { type Editor, isNodeSelection } from '@tiptap/react';

// --- Lib ---
import { isNodeInSchema } from '@/features/editor/lib/tiptap';
// --- Hooks ---
import { useTiptapEditor } from '@/features/editor/model/useTiptapEditor';
// --- Icons ---
import { ChevronDownIcon } from '@/widgets/tiptap-editor/tiptap-icons/chevron-down-icon';
import { HeadingIcon } from '@/widgets/tiptap-editor/tiptap-icons/heading-icon';
// --- Tiptap UI ---
import {
  getFormattedHeadingName,
  HeadingButton,
  headingIcons,
  type Level,
} from '@/widgets/tiptap-editor/tiptap-ui/heading-button/heading-button';
// --- UI Primitives ---
import type { ButtonProps } from '@/widgets/tiptap-editor/tiptap-ui-primitive/button';
import { Button } from '@/widgets/tiptap-editor/tiptap-ui-primitive/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/widgets/tiptap-editor/tiptap-ui-primitive/dropdown-menu';

export interface HeadingDropdownMenuProps extends Omit<ButtonProps, 'type'> {
  editor?: Editor | null;
  levels?: Level[];
  hideWhenUnavailable?: boolean;
  onOpenChange?: (isOpen: boolean) => void;
}

export function HeadingDropdownMenu({
  editor: providedEditor,
  levels = [1, 2, 3, 4, 5, 6],
  hideWhenUnavailable = false,
  onOpenChange,
  ...props
}: HeadingDropdownMenuProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const editor = useTiptapEditor(providedEditor);

  const headingInSchema = isNodeInSchema('heading', editor);

  const handleOnOpenChange = React.useCallback(
    (open: boolean) => {
      setIsOpen(open);
      onOpenChange?.(open);
    },
    [onOpenChange],
  );

  const getActiveIcon = React.useCallback(() => {
    if (!editor) return <HeadingIcon className="tiptap-button-icon" />;

    const activeLevel = levels.find((level) => editor.isActive('heading', { level })) as Level | undefined;

    if (!activeLevel) return <HeadingIcon className="tiptap-button-icon" />;

    const ActiveIcon = headingIcons[activeLevel];
    return <ActiveIcon className="tiptap-button-icon" />;
  }, [editor, levels]);

  const canToggleAnyHeading = React.useCallback((): boolean => {
    if (!editor) return false;
    return levels.some((level) => editor.can().toggleNode('heading', 'paragraph', { level }));
  }, [editor, levels]);

  const isDisabled = !canToggleAnyHeading();
  const isAnyHeadingActive = editor?.isActive('heading') ?? false;

  const show = React.useMemo(() => {
    if (!headingInSchema || !editor) {
      return false;
    }

    if (hideWhenUnavailable) {
      if (isNodeSelection(editor.state.selection) || !canToggleAnyHeading()) {
        return false;
      }
    }

    return true;
  }, [headingInSchema, editor, hideWhenUnavailable, canToggleAnyHeading]);

  if (!show || !editor || !editor.isEditable) {
    return null;
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={handleOnOpenChange}>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          disabled={isDisabled}
          data-style="ghost"
          data-active-state={isAnyHeadingActive ? 'on' : 'off'}
          data-disabled={isDisabled}
          role="button"
          tabIndex={-1}
          aria-label="Format text as heading"
          aria-pressed={isAnyHeadingActive}
          tooltip="Heading"
          {...props}
        >
          {getActiveIcon()}
          <ChevronDownIcon className="tiptap-button-dropdown-small" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent>
        <DropdownMenuGroup>
          {levels.map((level) => (
            <DropdownMenuItem key={`heading-${level}`} asChild>
              <HeadingButton editor={editor} level={level} text={getFormattedHeadingName(level)} tooltip={''} />
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default HeadingDropdownMenu;
