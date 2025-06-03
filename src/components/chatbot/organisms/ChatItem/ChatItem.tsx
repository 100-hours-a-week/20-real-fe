import choon from '@/assets/choon.png';
import { SafeImage } from '@/components/common/atoms/SafeImage';
import { MarkdownViewer } from '@/components/common/molecules/MarkdownViewer';

function ChatRoot({ children }: { children: React.ReactNode }) {
  return <div className="space-y-4">{children}</div>;
}

function UserMessage({ text }: { text: string }) {
  return (
    <div className="flex justify-end animate-fadeIn">
      {/*<div className="bg-primary-500 rounded-2xl rounded-tr-none shadow-sm w-fit max-w-[85%] break-words">*/}
      <div className="bg-primary-500 rounded-2xl rounded-tr-none shadow-sm w-fit max-w-[85%] break-words">
        <MarkdownViewer text={text} className="text-white pt-2 px-3" />
      </div>
    </div>
  );
}

function BotProfile() {
  return (
    <SafeImage
      src={choon}
      alt="프로필 이미지"
      width={32}
      height={32}
      className="rounded-full object-cover border-gray-400 border-1"
    />
  );
}

function BotMessage({ text }: { text: string }) {
  return (
    <div className="flex items-start animate-fadeIn">
      <div className="mr-2">
        <BotProfile />
      </div>
      {/*<div className="w-fit max-w-[85%] bg-primary-100 text-gray-800 pt-2.5 px-3 rounded-2xl rounded-tl-none shadow-sm text-sm break-words">*/}
      <div className="w-fit max-w-[85%] text-gray-800 pt-2.5 px-3 text-sm break-words">
        <MarkdownViewer text={text} />
      </div>
    </div>
  );
}

function BotLoading() {
  return (
    <div className="flex items-start animate-fadeIn">
      <div className="mr-2">
        <BotProfile />
      </div>
      <div className="flex gap-2 pt-2.5">
        <div className="w-2.5 h-2.5 bg-gray-500 rounded-full animate-bounce-dot [animation-delay:0s]" />
        <div className="w-2.5 h-2.5 bg-gray-500 rounded-full animate-bounce-dot [animation-delay:0.2s]" />
        <div className="w-2.5 h-2.5 bg-gray-500 rounded-full animate-bounce-dot [animation-delay:0.4s]" />
      </div>
    </div>
  );
}

// Compound 패턴으로 묶기
export const Chat = Object.assign(ChatRoot, {
  UserMessage,
  BotMessage,
  BotLoading,
});
