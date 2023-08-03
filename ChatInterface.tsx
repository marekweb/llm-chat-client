import React, {
  FormEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
} from "react";
import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import FormControl from "react-bootstrap/FormControl";
import Button from "react-bootstrap/Button";
import { ConversationMessage } from "./ConversationMessage";

interface ChatInterfaceProps {
  messages: ConversationMessage[];
  isWaiting: boolean;
  handleSend: () => void;
  inputValue: string;
  handleInputChange: (value: string) => void;
  status: string;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = (props) => {
  const handleSubmit = useCallback(
    (event: FormEvent) => {
      event.preventDefault();
      props.handleSend();
    },
    [props.handleSend]
  );

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      props.handleInputChange(event.target.value);
    },
    [props.handleInputChange]
  );

  const messagesRef = useRef<HTMLDivElement>(null);

  // Scroll the last message into view when new messages are added.
  useEffect(() => {
    const messagesContainer = messagesRef.current as HTMLDivElement;
    const lastMessage = messagesContainer.lastElementChild;

    if (lastMessage) {
      const lastMessageTop = lastMessage.getBoundingClientRect().top;
      const messagesContainerTop =
        messagesContainer.getBoundingClientRect().top;
      const lastMessageHeight = lastMessage.getBoundingClientRect().height;
      const messagesContainerHeight =
        messagesContainer.getBoundingClientRect().height;

      if (lastMessageHeight > messagesContainerHeight) {
        lastMessage.scrollIntoView({ behavior: "smooth", block: "start" });
      } else if (lastMessageTop > messagesContainerTop) {
        messagesContainer.scrollTop =
          messagesContainer.scrollHeight - messagesContainer.clientHeight;
      }
    }
  }, [props.messages]);

  return (
    <div className="d-flex flex-column vh-100">
      <Navbar bg="primary" variant="dark" sticky="top">
        <Container>
          <Navbar.Brand>Chat Interface ({props.status})</Navbar.Brand>
        </Container>
      </Navbar>

      <div className="flex-grow-1 overflow-auto" ref={messagesRef}>
        {props.messages.map((message, index) => (
          <div key={index} className="d-flex flex-column p-3">
            <div>
              <strong>{message.role}:</strong>{" "}
              <span style={{ whiteSpace: "pre-wrap" }}>{message.content}</span>
            </div>
            <small className="text-muted">Timestamp</small>
          </div>
        ))}
        {props.isWaiting && (
          <div className="d-flex flex-column p-3">
            <div className="text-muted">Typing...</div>
          </div>
        )}
      </div>

      <div className="bg-light py-3 px-4 sticky-bottom">
        <Form onSubmit={handleSubmit}>
          <div className="d-flex">
            <FormControl
              type="text"
              className="me-3"
              disabled={props.isWaiting}
              value={props.inputValue}
              onChange={handleChange}
            />
            <Button
              disabled={props.isWaiting}
              type="submit"
              className="align-self-end"
            >
              Send
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
};
