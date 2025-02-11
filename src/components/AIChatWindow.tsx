"use client";

import { useState, useRef, useEffect } from "react";
import { useChat } from "@ai-sdk/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MatchResult } from "@/components/ChatMatchResult";
import { Dog, User } from "lucide-react";

const INITIAL_MESSAGE =
  "Hi! I'm your AI Dog Matchmaker. I'll help you find your perfect furry friend! To get started, could you tell me your ZIP code?";

function MessageContent({
  content,
  matchId,
}: {
  content: string;
  matchId?: string | null;
}) {
  // If the message contains the matched dog intro, replace it with the card
  if (content.includes("Here's your matched dog:") && matchId) {
    return (
      <MatchResult
        selections={{
          location: "",
          breeds: [],
          ageRange: "",
          matchId: matchId,
        }}
        onClose={() => {}}
        onReset={() => {}}
      />
    );
  }
  return <span>{content}</span>;
}

export default function AIChatWindow() {
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const [matchId, setMatchId] = useState<string | null>(null);
  const [currentSelections, setCurrentSelections] = useState<{
    location: string;
    breeds: string[];
    ageRange: "young" | "adult" | "senior" | "";
  }>({
    location: "",
    breeds: [],
    ageRange: "",
  });

  const { messages, input, handleInputChange, handleSubmit } = useChat({
    initialMessages: [
      {
        id: "initial",
        role: "assistant",
        content: INITIAL_MESSAGE,
      },
    ],
    maxSteps: 5,
    onFinish: (message) => {
      console.log("Message finished:", message);
      // Find tool execution result in message parts
      const toolPart = message.parts?.find(
        (part) => part.type === "tool-invocation",
      );

      if (
        toolPart?.type === "tool-invocation" &&
        (toolPart as any).result?.matchId
      ) {
        // Find corresponding tool call to get parameters
        const toolCallPart = message.parts?.find(
          (part) =>
            part.type === "tool-invocation" &&
            (part as any).tool === "matchDog",
        );

        if (toolCallPart?.type === "tool-invocation") {
          setCurrentSelections((prev) => ({
            ...prev,
            location: (toolCallPart as any).parameters.location,
            breeds: (toolCallPart as any).parameters.breeds || [],
            ageRange: (toolCallPart as any).parameters.ageRange,
          }));
          setMatchId((toolPart as any).result.matchId);
        }
      }
    },
  });

  useEffect(() => {
    const scrollToBottom = () => {
      if (scrollAreaRef.current) {
        const scrollContainer = scrollAreaRef.current.querySelector(
          "[data-radix-scroll-area-viewport]",
        );
        if (scrollContainer) {
          scrollContainer.scrollTop = scrollContainer.scrollHeight;
        }
      }
    };
    // Use RAF for smooth scrolling
    requestAnimationFrame(scrollToBottom);
  }, [messages, matchId]);

  const [isMinimized, setIsMinimized] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    handleSubmit(e);
    setIsLoading(false);
  };

  return (
    <Card className="fixed bottom-4 left-4 w-96 shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 py-2">
        <CardTitle className="text-sm font-medium">AI Dog Matchmaker</CardTitle>
        <Button
          variant="ghost"
          size="sm"
          className="px-2 py-0"
          onClick={() => setIsMinimized(!isMinimized)}
        >
          {isMinimized ? "Maximize" : "Minimize"}
        </Button>
      </CardHeader>
      {!isMinimized && (
        <>
          <CardContent>
            <ScrollArea className="h-[400px] w-full pr-4" ref={scrollAreaRef}>
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`mb-4 flex ${
                    message.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`flex items-end ${
                      message.role === "user" ? "flex-row-reverse" : "flex-row"
                    }`}
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-background">
                        {message.role === "user" ? (
                          <User className="h-4 w-4 text-foreground" />
                        ) : (
                          <Dog className="h-4 w-4 text-foreground" />
                        )}
                      </AvatarFallback>
                    </Avatar>
                    <div
                      className={`mx-2 rounded-lg px-3 py-2 ${
                        message.role === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted"
                      }`}
                    >
                      <MessageContent
                        content={message.content}
                        matchId={
                          message.role === "assistant" ? matchId : undefined
                        }
                      />
                    </div>
                  </div>
                </div>
              ))}
            </ScrollArea>
          </CardContent>
          <CardFooter>
            <form
              onSubmit={onSubmit}
              className="flex w-full items-center space-x-2"
              autoComplete="off"
            >
              <Input
                value={input}
                onChange={handleInputChange}
                placeholder="Enter your message..."
                disabled={isLoading || !!matchId}
                autoComplete="off"
                spellCheck="false"
                data-lpignore="true"
                data-form-type="other"
              />
              <Button type="submit" disabled={isLoading || !!matchId}>
                {isLoading ? "..." : "Send"}
              </Button>
            </form>
          </CardFooter>
        </>
      )}
    </Card>
  );
}
