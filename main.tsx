import React from "react";
import { createRoot } from "react-dom/client";
import { Conversation } from "./Conversation";

const root = createRoot(document.getElementById("root"));
root.render(<Conversation socketUrl="ws://localhost:8080" />);
