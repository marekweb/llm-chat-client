import classNames from "classnames";
import React from "react";
import Container from "react-bootstrap/Container";
import Table from "react-bootstrap/Table";

export interface Task {
  id: string;
  item_title: string;
  priority: "low" | "medium" | "high";
  completed: boolean;
}

interface TrackerAppProps {
  tasks: Task[];
}

// Simple todo list task tracker using react-bootstrap
export const TrackerApp: React.FC<TrackerAppProps> = (props) => {
  return (
    <Container style={{ paddingTop: "100px" }}>
      <h1>To Do List</h1>
      <Table>
        <thead>
          <tr>
            <th>Task</th>
            <th>Priority</th>
          </tr>
        </thead>
        <tbody>
          {props.tasks.map((task) => (
            <tr
              key={task.id}
              className={classNames({
                "text-decoration-line-through": task.completed,
              })}
            >
              <td>{task.item_title}</td>
              <td>{task.priority}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};
