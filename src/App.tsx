import {
  Button,
  Alert,
  Input,
  Box,
  ListItem,
  List,
  ListIcon,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { CheckCircleIcon } from "@chakra-ui/icons";

import { io } from "socket.io-client";

const socket = io("http://localhost:3000");

function App() {
  const [isConnected, setIsConnected] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  const handleMessage = () => {
    socket.emit("chat_message", {
      user: socket.id,
      message,
    });
    setMessage("");
  };

  useEffect(() => {
    socket.on("connect", () => {
      setIsConnected(true);
    });

    socket.on("chat_message", (data) => {
      setMessages((messages) => [...messages, data]);
    });

    return () => {
      socket.off();
    };
  }, []);

  const handleDisconnect = () => {
    socket.disconnect();
    setIsConnected(false);
  };

  return (
    <>
      <Box display={"flex"} alignItems={"center"} gap={4} p={4} m={4}>
        {isConnected ? (
          <Alert status="success" variant="subtle">
            <strong>Conectado!</strong>
          </Alert>
        ) : (
          <Alert status="error" variant="subtle">
            <strong>Desconectado!</strong>
          </Alert>
        )}

        <Button colorScheme="teal" onClick={handleDisconnect}>
          Desconectar
        </Button>
      </Box>
      <Box display={"flex"} alignItems={"center"} gap={2} p={2} m={2}>
        <Box
          display={"flex"}
          alignItems={"center"}
          flexDir={"column"}
          gap={2}
          p={2}
          m={2}
          width={"100%"}
        >
          <Input
            placeholder="Escribe tu mensaje"
            onChange={(e) => setMessage(e.target.value)}
            value={message}
          />
          <Button colorScheme="teal" width={"100%"} onClick={handleMessage}>
            Enviar
          </Button>
        </Box>
        <Box
          display={"flex"}
          alignItems={"center"}
          flexDir={"column"}
          gap={2}
          p={2}
          m={2}
          width={"100%"}
        >
          <List spacing={2}>
            {messages.map((item) => (
              <ListItem key={item.user}>
                <ListIcon as={CheckCircleIcon} color="green.500" />
                {item.user} : {item.message}
              </ListItem>
            ))}
          </List>
        </Box>
      </Box>
    </>
  );
}

export default App;
