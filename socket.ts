import { EventEmitter } from "./EventEmitter";

const SOCKET_PING_INTERVAL = 5500;

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export interface SocketMessageFromClient {
  type: "message";
  agentId?: string;
  conversationId?: string;
  content: string;
}

export interface SocketMessageFromServer {
  type: "message";
  conversationId?: string;
  state?: string;
  content?: string;
}

export class SocketConnection<
  T extends SocketMessageFromClient = SocketMessageFromClient,
  U extends SocketMessageFromServer = SocketMessageFromServer
> {
  private url: string;
  private messageHandler: (message: U) => void;
  private socketPromise?: Promise<WebSocket>;
  private id: string | undefined;
  private checkInterval: number | undefined;
  public state = "empty";
  public stateChange = new EventEmitter<string>();

  constructor(url: string, messageHandler: (message: U) => void) {
    this.url = url;
    this.messageHandler = messageHandler;
  }

  private setState(state: string) {
    console.log("Socket state changed to", state);
    if (this.state === state) {
      return;
    }
    this.state = state;
    this.stateChange.emit(state);
  }

  /**
   * Connect to the socket if not already connected.
   */
  connect(): Promise<WebSocket> {
    if (!this.socketPromise) {
      this.socketPromise = new Promise((resolve, reject) => {
        const socket = new WebSocket(this.url);
        console.log("The socket state is ", socket.readyState);
        socket.addEventListener("open", () => resolve(socket));
        socket.addEventListener("error", (event) => {
          console.log('The "error" event occurred.', event);
          console.log("The socket's state is", socket.readyState);
          if (socket.readyState === WebSocket.CLOSED) {
            console.log("the socket is now closed");
          }
          reject(event);
        });
        socket.addEventListener("message", (event) => {
          const message = JSON.parse(event.data);
          this.messageHandler(message as U);
        });
        socket.addEventListener("close", async () => {
          this.socketPromise = undefined;
        });
      });
    }
    return this.socketPromise;
  }

  async send(message: T): Promise<void> {
    const socket = await this.connect();
    socket.send(JSON.stringify(message));
  }

  async close(): Promise<void> {
    if (this.socketPromise) {
      const socket = await this.socketPromise;
      socket.close();
    }
  }
}
