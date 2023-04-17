import React from "react";
import Container from "react-bootstrap/Container";
import Table from "react-bootstrap/Table";

export interface Task {
  id: string;
  name: string;
  priority: number;
  completed: boolean;
}

export interface Category {
  name: string;
  tasks: Task[];
}

interface TrackerAppProps {
  categories: Category[];
}

// Simple todo list task tracker using react-bootstrap
export const TrackerApp: React.FC<TrackerAppProps> = (props) => {
  return (
    <Container>
      <h1>Task Tracker</h1>
      {props.categories.map((category) => (
        <>
          <h2>Category: {category.name}</h2>

          <Table>
            <thead>
              <tr>
                <th>Task</th>
                <th>Priority</th>
              </tr>
            </thead>
            <tbody>
              {category.tasks.map((task) => (
                <tr key={task.id}>
                  <td>{task.name}</td>
                  <td>{task.priority}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </>
      ))}
    </Container>
  );
};
