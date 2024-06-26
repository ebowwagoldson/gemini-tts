// https://claude.ai/chat/040cf6f7-0754-48fc-9a05-0ed0729d0ea5
// src/components/MessageItem.tsx
import React, { useEffect, useRef, useState } from 'react';
import { Message } from "ai/react";
import { Bot, RefreshCw, Trash, User, Volume2 } from "lucide-react";
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
  const [isSpeaking, setIsSpeaking] = useState(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  const handleSpeak = () => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(message.content);
      utterance.lang = 'en-US';
      utteranceRef.current = utterance;

      utterance.onstart = () => {
        setIsSpeaking(true);
      };

      utterance.onend = () => {
        setIsSpeaking(false);
      };

      window.speechSynthesis.speak(utterance);
    }
  };

  const handleStopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  useEffect(() => {
    return () => {
      if (utteranceRef.current) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

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
            {!isLoading && isLastMessage && !isUser && (
              <Button
                variant="icon"
                type="button"
                size="sm"
                onClick={isSpeaking ? handleStopSpeaking : handleSpeak}
              >
                <Volume2 className={`w-4 h-4 ${isSpeaking ? 'text-green-500' : ''}`} />
              </Button>
            )}
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