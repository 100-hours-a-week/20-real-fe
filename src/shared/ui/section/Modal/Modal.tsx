import { X } from 'lucide-react';

import React, { ReactNode, useEffect } from 'react';

import { Button, ButtonVariant } from '../../component/Button';

export interface ModalAction {
  label: string;
  variant: ButtonVariant;
  onClick?: () => void;
  autoClose?: boolean;
}

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children?: ReactNode;
  actions?: ModalAction[];
  showCloseButton?: boolean;
}

export function Modal({ isOpen, onClose, title, children, actions = [], showCloseButton = true }: ModalProps) {
  // ESC 키로 모달 닫기
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  // 모달 열릴 때 애니메이션 설정
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'; // 배경 스크롤 방지
    } else {
      document.body.style.overflow = ''; // 스크롤 복원
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // 모달이 닫혀있을 때는 렌더링하지 않음
  if (!isOpen) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-300 backdrop-blur-sm ${isOpen ? 'bg-black/20' : 'bg-transparent pointer-events-none'}`}
      onClick={onClose}
    >
      <div
        className={`overflow-hidden w-full max-w-sm bg-white/90 backdrop-blur-md rounded-xl 
        shadow-[0_10px_25px_rgba(0,0,0,0.1),inset_0_1px_1px_rgba(255,255,255,0.4)] 
        transition-all duration-300 transform
        ${isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0 pointer-events-none'}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* 모달 헤더 */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h3 className="text-lg font-medium text-gray-800">{title}</h3>
          {showCloseButton && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="rounded-full hover:bg-gray-100 transition-colors duration-200 focus:outline-none"
            >
              <X size={20} className="text-gray-500" />
            </Button>
          )}
        </div>

        {/* 모달 내용 */}
        <div className="p-6">{children}</div>

        {/* Actions */}
        {actions.length > 0 && (
          <div className="flex justify-end gap-2 px-6 pb-6">
            {actions.map(({ label, variant = 'primary', onClick, autoClose = true }, idx) => (
              <Button
                key={idx}
                variant={variant}
                onClick={() => {
                  if (onClick) onClick();
                  if (autoClose) onClose();
                }}
                data-testid={`modal-button-${idx}`}
              >
                {label}
              </Button>
            ))}
          </div>
        )}

        {/* 바닥 그래디언트 효과 */}
        <div className="h-1 bg-gradient-to-r gradient-lg rounded-b-xl opacity-75"></div>
      </div>
    </div>
  );
}
