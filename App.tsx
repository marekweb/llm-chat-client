import React, { useState } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { Conversation } from "./Conversation";
import { Task, TrackerApp } from "./TrackerApp";
import { socketUrl } from "./config";

const initialTasks: Task[] = [];

export const App = () => {
  const [tasks, updateAppState] = useState<Task[]>(initialTasks);

  return (
    <Container>
      <Row>
        <Col>
          <Conversation updateAppState={updateAppState} socketUrl={socketUrl} />
        </Col>
        <Col>
          <TrackerApp tasks={tasks} />
        </Col>
      </Row>
    </Container>
  );
};
