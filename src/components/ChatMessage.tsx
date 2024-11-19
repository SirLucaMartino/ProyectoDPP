import { FC } from 'react';

interface ChatMessageProps {
  content: string;
  type: 'system' | 'user' | 'assistant';
}

export const ChatMessage: FC<ChatMessageProps> = ({ content, type }) => {
  return (
    <div
      className={`max-w-[85%] p-3 rounded-lg ${
        type === 'user'
          ? 'bg-[#003876] text-white ml-auto'
          : type === 'assistant'
          ? 'bg-gray-100'
          : 'bg-gray-50'
      }`}
    >
      {content}
    </div>
  );
};