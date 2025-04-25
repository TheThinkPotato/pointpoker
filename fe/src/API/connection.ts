import * as signalR from "@microsoft/signalr";

export const webSocketConnection = new signalR.HubConnectionBuilder()
  .withUrl("http://localhost:5051/packethub", {
    transport: signalR.HttpTransportType.WebSockets,
    withCredentials: true, // CORS support
  })
  .withAutomaticReconnect()
  .build();

export const isWebSocketConnectionStateDisconnected =
  signalR.HubConnectionState.Disconnected;

export const establishConnection = async (
  connection: signalR.HubConnection
) => {
  if (connection.state !== signalR.HubConnectionState.Connected) {
    try {
      await connection.start();
      console.log("Successfully connected to SignalR");
    } catch (error) {
      console.error("Error connecting to SignalR:", error);
      alert("Unable to connect to the server. Please try again later.");
      return;
    }
  }
  return true;
};
