import React, { useState } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { Conversation } from "./Conversation";
import { Category, TrackerApp } from "./TrackerApp";

// Use real sounding demo tasks, ja?
const initialCategories = [
  {
    name: "Work",
    tasks: [{ id: "1", name: "Check email", priority: 1, completed: false }],
  },
  {
    name: "Home",
    tasks: [
      {
        id: "2",
        name: "Write down novel ideas",
        priority: 1,
        completed: false,
      },
    ],
  },
];

export const App = () => {
  const [categories] = useState<Category[]>(initialCategories);

  return (
    <Container>
      <Row>
        <Col>
          <Conversation socketUrl="ws://localhost:8080" />
        </Col>
        <Col>
          <TrackerApp categories={categories} />
        </Col>
      </Row>
    </Container>
  );
};
