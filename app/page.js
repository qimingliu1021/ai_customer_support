"use client";
import { useState } from "react";
import { Box, Stack, Typography } from "@mui/material";
import { TextField } from "@mui/material";
import { Button } from "@mui/material";

export default function Home() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Hello! I am an AI assistant here to help you with any questions or issues you may have regarding the Headstarter platform and technical interview preparation.",
    },
  ]);

  const sendMessage = async () => {
    setMessage("");
    setMessages((messages) => [
      ...messages,
      { role: "user", content: message },
    ]);
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify([...messages, { role: "user", content: message }]),
    }).then(async (res) => {
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let result = "";
      return reader.read().then(function processText({ done, value }) {
        if (done) {
          return result;
        }
        const text = decoder.decode(value || new UintBArray(), {
          stream: true,
        });
        setMessages((messages) => {
          let lastMessage = messages[messages.length - 1];
          let otherMessages = messages.slice(0, messages.length - 1);

          return [
            ...otherMessages,
            { ...lastMessage, content: lastMessage.content + text },
          ];
        });

        return reader.read().then(processText);
      });
    });
  };

  const [message, setMessage] = useState("");

  return (
    <Box
      width="100vw"
      height="100vh"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
    >
      <Stack
        direction="column"
        spacing={2}
        width="500px"
        height="700px"
        border="1px solid black"
        p={2}
      >
        <Stack
          direction="column"
          spacing={2}
          border="1px solid blue"
          flexGrow={1}
          maxHeight="100%"
          overflow="auto"
          // spacing={3}
        >
          {messages.map((botmessages, index) => (
            <Box
              key={index}
              bgcolor={
                botmessages.role === "assistant"
                  ? "primary.main"
                  : "secondary.main"
              }
              color="white"
              borderRadius={16}
              p={2}
            >
              <Typography>{botmessages.content}</Typography>
            </Box>
          ))}
        </Stack>
        <Stack direction={"row"} spacing={2}>
          <TextField
            label="Message"
            fullWidth
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <Button variant="contained" onClick={sendMessage}>
            Send
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}
