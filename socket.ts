function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

interface SocketMessageFromClient {
  type: "message";
  agentId?: string;
  conversationId?: string;
  content: string;
}

interface SocketMessageFromServer {
  type: "message";
  conversationId?: string;
  state?: string;
  content?: string;
}

export class SocketConnection<
  T extends SocketMessageFromClient,
  U extends SocketMessageFromServer
> {
  private url: string;
  private messageHandler: (message: U) => void;
  private socketPromise?: Promise<WebSocket>;
  private id: string | undefined;

  constructor(url: string, messageHandler: (message: U) => void) {
    this.url = url;
    this.messageHandler = messageHandler;
  }

  connect(): Promise<WebSocket> {
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
