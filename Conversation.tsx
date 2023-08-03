import React, { useCallback, useEffect, useState } from "react";
import Container from "react-bootstrap/Container";
import Card from "react-bootstrap/Card";
import Badge from "react-bootstrap/Badge";
import {
  SocketConnection,
  SocketMessageFromClient,
  SocketMessageFromServer,
} from "./socket";
import { ConversationMessage } from "./ConversationMessage";
import { ChatInterface } from "./ChatInterface";
import { Task } from "./TrackerApp";
interface ConversationProps {
  socketUrl: string;
  updateAppState: (tasks: Task[]) => void;
}

export const Conversation: React.FC<ConversationProps> = (props) => {
  const initialMessages = [{ role: "assistant", content: "Hello, world!" }];

  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = useCallback(
    (value: string) => {
      setInputValue(value);
    },
    [setInputValue]
  );

  const [conversationId, setConversationId] = useState<string | undefined>();
  const [socket, setSocket] = useState<SocketConnection | null>(null);
  const [messages, setMessages] =
    useState<ConversationMessage[]>(initialMessages);
  const appendMessage = (message: ConversationMessage) =>
    setMessages((prevMessages) => [...prevMessages, message]);

  const handleMessage = (message: SocketMessageFromServer) => {
    if (message?.conversationId) {
      setConversationId(message.conversationId);
    }

    if (message?.state === "typing") {
      setIsLoading(true);
    } else if (message?.state === "update") {
      // Update state message is
      //   state: "update"
      //   content: JSON.stringify(state)
      // which is not the best way to do this, but it works for now.
      props.updateAppState(JSON.parse(message.content ?? ""));
    } else {
      setIsLoading(false);
      appendMessage({ role: "assistant", content: message.content ?? "" });
    }
  };

  const handleSend = useCallback(() => {
    const message: SocketMessageFromClient = {
      type: "message",
      content: inputValue,
      conversationId: conversationId,
      agentId: conversationId ? undefined : "001",
    };

    if (conversationId) {
      message.conversationId = conversationId;
    } else {
      message.agentId = "001";
    }

    if (socket) {
      appendMessage({ role: "user", content: inputValue });
      socket.send(message);
      setIsLoading(true); // TODO: need a timeout for loading state
    }

    setInputValue("");
  }, [inputValue, conversationId, socket]);

  // Connect to socket
  useEffect(() => {
    const socket = new SocketConnection(props.socketUrl, handleMessage);
    appendMessage({
      role: "debug",
      content: `Creating connection to ${props.socketUrl}`,
    });
    socket.stateChange.addEventListener((state) => {
      appendMessage({ role: "debug", content: `Socket state: ${state}` });
    });
    setSocket(socket);
    return () => {
      socket.close();
    };
  }, [props.socketUrl]);

  const status = socket ? socket.state : "disconnected";

  return (
    <ChatInterface
      status={status}
      messages={messages}
      isWaiting={isLoading}
      handleSend={handleSend}
      inputValue={inputValue}
      handleInputChange={handleInputChange}
    />
  );
};

interface ConversationMessagesProps {
  messages: ConversationMessage[];
  isWaiting: boolean;
}
const ConversationMessages: React.FC<ConversationMessagesProps> = (props) => (
  <Container>
    {props.messages.map((message, index) => (
      <Card className="my-4" key={index}>
        <Card.Header>
          <Badge bg={message.role === "user" ? "primary" : "success"}>
            {message.role}
          </Badge>
        </Card.Header>
        <Card.Body>
          <Card.Text>{message.content}</Card.Text>
        </Card.Body>
      </Card>
    ))}
    {props.isWaiting && (
      <Card className="my-4">
        <Card.Body>
          <Card.Text>Typing...</Card.Text>
        </Card.Body>
      </Card>
    )}
  </Container>
);
