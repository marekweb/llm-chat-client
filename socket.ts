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

  constructor(url: string, messageHandler: (message: U) => void) {
    this.url = url;
    this.messageHandler = messageHandler;
  }

  connect(): Promise<WebSocket> {
    if (!this.checkInterval) {
      this.checkInterval = window.setInterval(async () => {
        if (this.socketPromise) {
          const socket = await this.socketPromise;
          if (socket.readyState === WebSocket.CLOSED) {
            this.state = "closed";
          } else if (socket.readyState === WebSocket.OPEN) {
            this.state = "open";
          } else {
            this.state = "connecting";
          }
        } else {
          this.state = "empty";
        }
      }, 100);
    }

    if (!this.socketPromise) {
      this.socketPromise = new Promise((resolve, reject) => {
        const socket = new WebSocket(this.url);
        socket.addEventListener("open", () => resolve(socket));
        socket.addEventListener("error", (event) => reject(event));
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
