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

const MessageItem: React.FC<MessageItemProps> = ({
  message,
  isLastMessage,
  isLoading,
  onRefresh,
  onRemove,
}) => {
  const isUser = message.role === 'user';
  const utteranceRef = useRef(null);

  useEffect(() => {
    if (isLastMessage && !isUser && !isLoading) {
      // Create a new SpeechSynthesisUtterance instance with the message content
      const utterance = new SpeechSynthesisUtterance(message.content);

      // Set the desired language for the speech synthesis
      utterance.lang = 'en-US';

      // Store the utterance instance in the utteranceRef
      utteranceRef.current = utterance;

      // Get the available voices from the window.speechSynthesis.getVoices() method
      const voices = window.speechSynthesis.getVoices();

      // If there are available voices
      if (voices.length > 0) {
        // Set the first available voice to the utterance
        utterance.voice = voices[0];

        // Call window.speechSynthesis.speak(utterance) to start speaking the message content
        window.speechSynthesis.speak(utterance);
      } else {
        // If there are no available voices initially
        // Add an event listener to the 'voiceschanged' event
        window.speechSynthesis.addEventListener('voiceschanged', () => {
          // Get the available voices again when the voices are loaded
          const voices = window.speechSynthesis.getVoices();

          // If there are available voices now
          if (voices.length > 0) {
            // Set the first available voice to the utterance
            utterance.voice = voices[0];

            // Call window.speechSynthesis.speak(utterance) to start speaking the message content
            window.speechSynthesis.speak(utterance);
          }
        });
      }
    }

    // Cleanup function of the useEffect hook
    return () => {
      // If the utteranceRef has a value
      if (utteranceRef.current) {
        // Cancel any ongoing speech synthesis
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

export default MessageItem;
