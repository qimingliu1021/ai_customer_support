"use client";
import { useState } from "react";
import { Box, Stack, Typography, Alert } from "@mui/material";
import { TextField } from "@mui/material";
import { Button } from "@mui/material";
import { Readex_Pro } from "next/font/google";
import { useStepperContext } from "@mui/material";

import * as React from "react";
import { red } from "@mui/material/colors";
import { width } from "@mui/system";
import { margin } from "@mui/system";

export default function Conversation() {
  const [apiEndPoint, setApiEndPoint] = useState("api/chat");
  const [showAlert, setShowAlert] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Hello! I am an AI assistant here to help you with any questions or issues you may have regarding the Headstarter platform and technical interview preparation.",
    },
  ]);

  const changeModel = () => {
    setApiEndPoint((prevEndPoint) => {
      const newEndPoint =
        prevEndPoint === "api/chat" ? "api/bedrockAPI" : "api/chat";
      return newEndPoint;
    });
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 3000);
    // window.location.reload();
    console.log("Model changed to:", apiEndPoint);
    // setShowAlert(false);
  };

  const sendMessage = async () => {
    setMessages((messages) => [
      ...messages,
      { role: "user", content: message },
    ]);

    const response = fetch(apiEndPoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify([...messages, { role: "user", content: message }]),
    }).then(async (res) => {
      setMessages((messages) => [
        ...messages,
        { role: "assistant", content: "" },
      ]);
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
            {
              ...lastMessage,
              content: lastMessage.content + text,
              role: "assistant",
            },
          ];
        });

        return reader.read().then(processText);
      });
    });
  };

  const [message, setMessage] = useState("");

  return (
    <Box>
      {showAlert && (
        <Alert
          variant="filled"
          sx={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000 }}
        >
          Model changed!
        </Alert>
      )}
      <Box
        width="100vw"
        height="100vh"
        display="flex"
        flexDirection="row"
        justifyContent="center"
        alignItems="center"
      >
        <Box sx={{ bgcolor: "white", width: "50 rem", margin: "2 rem" }}>
          <Typography>Model Now using now:</Typography>
          <Button onClick={changeModel}>chang the model</Button>
        </Box>
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
            justifyContent={
              message.role === "assistant" ? "flex.start" : "flex.end"
            }
          >
            {messages.map((message, index) => (
              <Box
                key={index}
                bgcolor={
                  message.role === "assistant"
                    ? "primary.main"
                    : "secondary.main"
                }
                color="white"
                borderRadius={16}
                p={2}
              >
                <Typography>{message.content}</Typography>
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
    </Box>
  );
}
