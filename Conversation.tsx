import React, { FormEvent, useState } from "react";
import {
  Container,
  Card,
  Badge,
  Form,
  InputGroup,
  Button,
} from "react-bootstrap";

export const Conversation: React.FC = () => {
  const initialMessages = [
    { role: "assistant", content: "Hello, world!" },
    { role: "user", content: "You too" },
  ];

  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState(initialMessages);
  const appendMessage = (message: { role: string; content: string }) => {
    setMessages([...messages, message]);
  };

  const handleSend = async (event: FormEvent) => {};

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

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
