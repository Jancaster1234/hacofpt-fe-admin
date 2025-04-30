// src/contexts/WebSocketContext.tsx
import React, { createContext, useContext, useEffect, useState } from "react";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import { useAuth } from "@/hooks/useAuth_v0";
import { toast } from "sonner";

interface WebSocketContextType {
  client: Client | null;
  isConnected: boolean;
}

const WebSocketContext = createContext<WebSocketContextType>({
  client: null,
  isConnected: false,
});

export const useWebSocket = () => useContext(WebSocketContext);

export const WebSocketProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [client, setClient] = useState<Client | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (!user?.id) return;

    // Use environment variable for WebSocket URL with fallback
    const wsUrl = process.env.NEXT_PUBLIC_WS_URL || "http://localhost:8083/ws";
    console.log("Connecting to WebSocket at:", wsUrl);

    const socket = new SockJS(wsUrl);
    const stompClient = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      onStompError: (frame) => {
        console.error("WebSocket STOMP error:", frame);
        toast.error("WebSocket connection error");
        setIsConnected(false);
      },
      onWebSocketError: (event) => {
        console.error("WebSocket connection error:", event);
        toast.error("WebSocket connection error");
        setIsConnected(false);
      },
      onDisconnect: () => {
        console.log("WebSocket disconnected");
        setIsConnected(false);
        //toast.error('Disconnected from WebSocket');
      },
    });

    stompClient.onConnect = () => {
      console.log("Connected to WebSocket successfully");
      setIsConnected(true);
    };

    try {
      stompClient.activate();
      setClient(stompClient);
    } catch (error) {
      console.error("Error activating WebSocket client:", error);
      toast.error("Failed to connect to WebSocket");
    }

    return () => {
      if (stompClient.connected) {
        console.log("Deactivating WebSocket client");
        stompClient.deactivate();
      }
    };
  }, [user?.id]);

  return (
    <WebSocketContext.Provider value={{ client, isConnected }}>
      {children}
    </WebSocketContext.Provider>
  );
};
