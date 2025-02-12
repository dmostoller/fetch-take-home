"use client";

import { useState, useRef, useEffect } from "react";
import { useChat } from "@ai-sdk/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ReactMarkdown from "react-markdown";
import { MatchedDog } from "./MatchedDog";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Dog, User } from "lucide-react";
import type { Dog as DogType } from "@/lib/types";

interface MessageContentProps {
  content: string;
  dogDetails?: DogType | null;
  showModal?: boolean;
}

interface UserSelections {
  location: string;
  breeds: string[];
  ageRange: "young" | "adult" | "senior" | "";
}

interface ToolInvocationResult {
  matchId: string;
  dogDetails: DogType;
  showModal: boolean;
}

interface ToolInvocationParameters {
  location: string;
  breeds: string[];
  ageRange: UserSelections["ageRange"];
}

const INITIAL_MESSAGE =
  "Hi! I'm your AI Dog Matchmaker. I'll help you find your perfect furry friend! To get started, could you tell me your ZIP code?";

function MessageContent({
  content,
  dogDetails,
  showModal,
}: MessageContentProps) {
  return (
    <>
      <div className="prose prose-invert max-w-none">
        <ReactMarkdown>{content}</ReactMarkdown>
      </div>

      {dogDetails && showModal && (
        <MatchedDog dog={dogDetails} onReset={() => null} />
      )}
    </>
  );
}

function useScrollPosition() {
  const [isBottom, setIsBottom] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrolledToBottom =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 100;
      setIsBottom(scrolledToBottom);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Check initial position

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return isBottom;
}

export default function AIChatWindow() {
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const [matchId, setMatchId] = useState<string | null>(null);
  const [, setCurrentSelections] = useState<UserSelections>({
    location: "",
    breeds: [],
    ageRange: "",
  });
  const [dogDetails, setDogDetails] = useState<DogType | null>(null);
  const [showModal, setShowModal] = useState(false);
  const isBottom = useScrollPosition();
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
        (toolPart as { result?: ToolInvocationResult }).result?.matchId
      ) {
        // Handle both match ID and dog details
        const result = (toolPart as unknown as { result: ToolInvocationResult })
          .result;

        // Find corresponding tool call to get parameters
        const toolCallPart = message.parts?.find(
          (part) =>
            part.type === "tool-invocation" &&
            (part as { tool?: string }).tool === "matchDog",
        );

        if (toolCallPart?.type === "tool-invocation") {
          const params = (
            toolCallPart as unknown as { parameters: ToolInvocationParameters }
          ).parameters;
          // Update selections
          setCurrentSelections((prev) => ({
            ...prev,
            location: params.location,
            breeds: params.breeds || [],
            ageRange: params.ageRange,
          }));

          // Update match related state
          setMatchId(result.matchId);
          setDogDetails(result.dogDetails);
          setShowModal(result.showModal);
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
    <Card
      className={`fixed left-4 shadow-lg z-10 w-96 transition-all duration-200 ${
        isBottom ? "bottom-24" : "bottom-4"
      }`}
    >
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
                        dogDetails={
                          message.role === "assistant" ? dogDetails : undefined
                        }
                        showModal={
                          message.role === "assistant" ? showModal : undefined
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
