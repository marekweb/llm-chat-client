import React, { FormEvent, useEffect, useState } from "react";
import {
  Container,
  Card,
  Badge,
  Form,
  InputGroup,
  Button,
} from "react-bootstrap";
import { SocketConnection } from "./socket";

interface ConversationProps {
  socketUrl: string;
}

interface ConversationMessage {
  role: string;
  content: string;
}

type Message = any; // TODO

export const Conversation: React.FC<ConversationProps> = (props) => {
  const initialMessages = [{ role: "assistant", content: "Hello, world!" }];

  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const [conversationId, setConversationId] = useState<string | null>(null);
  const [socket, setSocket] = useState<SocketConnection<
    Message,
    Message
  > | null>(null);
  const [messages, setMessages] =
    useState<ConversationMessage[]>(initialMessages);
  const appendMessage = (message: ConversationMessage) =>
    setMessages((prevMessages) => [...prevMessages, message]);

  const handleMessage = (event: Message) => {
    if (event?.conversationId) {
      setConversationId(event.conversationId);
    }
    appendMessage({ role: "assistant", content: event.content });
  };

  const handleSend = (event: FormEvent) => {
    event.preventDefault();
    const message: Message = {
      type: "message",
      content: inputValue,
    };

    if (conversationId) {
      message.conversationId = conversationId;
    } else {
      message.agentId = "001";
    }

    if (socket) {
      appendMessage({ role: "user", content: inputValue });
      socket.send(message);
    }

    setInputValue("");
  };

  // connect to websocket
  useEffect(() => {
    const socket = new SocketConnection<Message, Message>(
      props.socketUrl,
      handleMessage
    );
    setSocket(socket);
    return () => {
      socket.close();
    };
  }, [props.socketUrl]);

  return (
    <>
      <Container>
        {messages.map((message, index) => (
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
        {isLoading && (
          <Card className="my-4">
            <Card.Body>
              <Card.Text>Typing...</Card.Text>
            </Card.Body>
          </Card>
        )}
      </Container>
      <Container className="fixed-bottom mb-3">
        <Form onSubmit={handleSend}>
          <InputGroup>
            <Form.Control
              type="text"
              placeholder="Type your message here..."
              value={inputValue}
              onChange={handleInputChange}
              disabled={isLoading}
            />

            <Button variant="primary" type="submit">
              Send
            </Button>
          </InputGroup>
        </Form>
      </Container>
    </>
  );
};
