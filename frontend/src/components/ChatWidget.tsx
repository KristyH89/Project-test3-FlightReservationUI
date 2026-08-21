import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Minus } from "lucide-react";
import { getFlightRecommendation, ChatApiError } from "../api/aiApi";

interface ChatMessage {
    role: "user" | "assistant";
    text: string;
}

export function ChatWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<ChatMessage[]>([
        {
            role: "assistant",
            text: "Hi! Tell me what kind of trip you're in the mood for, and I'll suggest a Fly Orange destination for you.",
        },
    ]);
    const [inputValue, setInputValue] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to the latest message whenever the conversation grows
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    async function handleSend(e: React.FormEvent) {
        e.preventDefault();
        const trimmed = inputValue.trim();
        if (!trimmed || isLoading) return;

        setMessages((current) => [...current, { role: "user", text: trimmed }]);
        setInputValue("");
        setIsLoading(true);

        try {
            const reply = await getFlightRecommendation({ preference: trimmed });
            setMessages((current) => [...current, { role: "assistant", text: reply }]);
        } catch (err) {
            const message =
                err instanceof ChatApiError
                    ? "Sorry, I couldn't reach the assistant right now. Please try again."
                    : "Something went wrong. Please try again.";
            setMessages((current) => [...current, { role: "assistant", text: message }]);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <>
            <button
                type="button"
                className="chat-bubble-button"
                onClick={() => setIsOpen((current) => !current)}
                aria-label={isOpen ? "Close chat" : "Open chat"}
            >
                {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
            </button>

            {isOpen && (
                <div className="chat-window">
                    <div className="chat-window-header">
                        <span>Fly Orange Assistant</span>
                        <div className="chat-window-header-actions">
                            <button
                                type="button"
                                className="chat-header-button"
                                onClick={() => setIsOpen(false)}
                                aria-label="Minimize chat"
                            >
                                <Minus size={18} />
                            </button>
                            <button
                                type="button"
                                className="chat-header-button"
                                onClick={() => setIsOpen(false)}
                                aria-label="Close chat"
                            >
                                <X size={18} />
                            </button>
                        </div>
                    </div>

                    <div className="chat-window-messages">
                        {messages.map((msg, index) => (
                            <div key={index} className={`chat-message chat-message-${msg.role}`}>
                                {msg.text}
                            </div>
                        ))}
                        {isLoading && (
                            <div className="chat-message chat-message-assistant chat-message-loading">
                                Thinking...
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    <form onSubmit={handleSend} className="chat-window-input">
                        <input
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            placeholder="e.g. somewhere warm and relaxing"
                            disabled={isLoading}
                        />
                        <button type="submit" disabled={isLoading || !inputValue.trim()} aria-label="Send">
                            <Send size={18} />
                        </button>
                    </form>
                </div>
            )}
        </>
    );
}