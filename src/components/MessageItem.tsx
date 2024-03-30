import React, { useEffect, useRef } from 'react';
import { Message } from "ai/react";
import { Bot, RefreshCw, Trash, User } from "lucide-react";
import { MarkdownViewer } from "./markdown-viewer/MarkdownViewer";
import { Button } from "./ui/button";

type MessageItemProps = {
  message: Message;
  isLastMessage: boolean;
  isLoading: boolean;
  onRefresh: () => void;
  onRemove: () => void;
};

export const MessageItem: React.FC<MessageItemProps> = ({
  message,
  isLastMessage,
  isLoading,
  onRefresh,
  onRemove,
}) => {
  const isUser = message.role === 'user';
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    if (isLastMessage && !isUser && !isLoading) {
      const utterance = new SpeechSynthesisUtterance(message.content);
      utterance.lang = 'en-US';
      utteranceRef.current = utterance;

      const voices = window.speechSynthesis.getVoices();
      if (voices.length > 0) {
        utterance.voice = voices[0];
        window.speechSynthesis.speak(utterance);
      } else {
        window.speechSynthesis.addEventListener('voiceschanged', () => {
          const voices = window.speechSynthesis.getVoices();
          if (voices.length > 0) {
            utterance.voice = voices[0];
            window.speechSynthesis.speak(utterance);
          }
        });
      }
    }

    return () => {
      if (utteranceRef.current) {
        window.speechSynthesis.cancel();
      }
    };
  }, [isLastMessage, isUser, isLoading, message.content]);

  return (
    <div className="flex">
      <div
        className={`${
          isUser ? "" : "bg-primary/10 dark:bg-primary/10"
        } px-4 py-4 w-full`}
      >
        <div className="my-4 flex justify-between">
          <div className="flex space-x-4 font-medium">
            {isUser ? <User /> : <Bot />}
            <div>{isUser ? "You" : "Gemini Pro"}</div>
          </div>
          <div className={`space-x-6`}>
            {!isLoading && isLastMessage && isUser && (
              <Button
                variant="icon"
                type="button"
                size="sm"
                onClick={onRefresh}
              >
                <RefreshCw className="w-4 h-4" />
              </Button>
            )}
            {!isLoading && isLastMessage && (
              <Button
                variant="icon"
                type="button"
                size="sm"
                onClick={onRemove}
              >
                <Trash className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
        <MarkdownViewer text={message.content} />
      </div>
    </div>
  );
};
