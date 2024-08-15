"use client";
import { useState } from "react";
import { Box, Stack, Typography, Alert, Input } from "@mui/material";
import { TextField } from "@mui/material";
import { Button } from "@mui/material";
import { Readex_Pro } from "next/font/google";
import { useStepperContext } from "@mui/material";

import * as React from "react";
import { red } from "@mui/material/colors";
import { width } from "@mui/system";
import { margin } from "@mui/system";
import { border } from "@mui/system";

// ***************************  Images   ***************************
import Image from "next/image";
import SendIcon from "@mui/icons-material/Send";

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
    console.log("Model changed to:", apiEndPoint);
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

          setMessage("");

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
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            zIndex: 1000,
            backgroundColor: "#5E6C9B",
          }}
        >
          Model changed to{" "}
          {apiEndPoint == "api/chat" ? "AWS BedRock" : "OpenAI"}
        </Alert>
      )}
      <Box sx={{ display: "flex", flexDirection: "column" }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "flex-end",
            mt: 3,
            mr: 3,
            mb: -1,
          }}
        >
          <Image
            src="/svg/userProfile.svg"
            alt="assistant chat bot"
            width={50}
            height={50}
            priority
            sx={{ mr: 0 }}
          />
        </Box>
        <Box
          width="100vw"
          height="90vh"
          display="flex"
          flexDirection="row"
          justifyContent="center"
          alignItems="center"
        >
          <Box
            sx={{
              bgcolor: "white",
              width: "250px",
              height: "700px",
              margin: "2 rem",
              borderRadius: 7,
              margin: "0 auto",
              display: "flex",
              flexDirection: "column",
              alignItems: "center", // horizontal
              mr: "10px",
            }}
          >
            <Button
              onClick={changeModel}
              variant="contained"
              sx={{ mt: " 30px", borderRadius: 3, fontWeight: "bold" }}
            >
              chang the model
            </Button>
            <Typography
              sx={{ mt: "50px", color: "#5E6C9B", fontWeight: "bold" }}
            >
              Model using now:
            </Typography>
            {apiEndPoint === "api/chat" ? (
              <Typography
                sx={{ mt: "20px", color: "#5E6C9B", fontWeight: "bold" }}
              >
                OpenAI
              </Typography>
            ) : (
              <Typography
                sx={{ mt: "20px", color: "#5E6C9B", fontWeight: "bold" }}
              >
                AWS Bedrock
              </Typography>
            )}
          </Box>
          <Stack
            direction="column"
            spacing={2}
            width="1100px"
            height="700px"
            sx={{
              backgroundColor: "#ffffff",
              borderRadius: 7,
              margin: "0 auto",
              display: "flex",
              flexDirection: "column",
              alignItems: "center", // horizontal
            }}
            p={2}
          >
            <Stack
              direction="column"
              spacing={2}
              flexGrow={1}
              maxHeight="100%"
              overflow="auto"
              sx={{
                borderRadius: 7,
                backgroundColor: "#93C7EF",
                position: "relative",
                "&::before": {
                  content: '""',
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundImage: "url('/images/plane-flying.jpeg')",
                  backgroundSize: "cover",
                  backgroundRepeat: "no-repeat",
                  opacity: 0.4, // Adjust the opacity of the background image
                  zIndex: 1,
                  borderRadius: 7,
                },
                "& > *": {
                  position: "relative",
                  zIndex: 2, // Ensures content is above the background image
                },
              }}
              p={2}
            >
              {messages.map((message, index) =>
                message.role === "user" ? (
                  <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                    <Box
                      key={index}
                      bgcolor={"primary.main"}
                      color="#ffffff"
                      maxWidth={"25%"}
                      borderRadius={5}
                      p={2}
                      mr={2}
                    >
                      <Typography sx={{ fontWeight: "bold" }}>
                        {message.content}
                      </Typography>
                    </Box>
                    <Image
                      src="/svg/userBot.svg"
                      alt="assistant chat bot"
                      width={40}
                      height={40}
                      priority
                    />
                  </Box>
                ) : (
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "flex-start",
                    }}
                  >
                    <Image
                      src="/svg/chatBot.svg"
                      alt="assistant chat bot"
                      width={40}
                      height={40}
                      priority
                    />
                    <Box
                      key={index}
                      bgcolor={"primary.main"}
                      color="white"
                      borderRadius={5}
                      maxWidth={"60%"}
                      p={2}
                      ml={2}
                    >
                      <Typography sx={{ fontWeight: "bold" }}>
                        {message.content}
                      </Typography>
                    </Box>
                  </Box>
                )
              )}
            </Stack>
            <Box
              sx={{ display: "flex", gap: "20px", width: "100%", height: "7%" }}
            >
              <Input
                placeholder="Message Polkabot"
                fullWidth
                value={message}
                variant="standard"
                sx={{
                  backgroundColor: "#5E6C9B",
                  "& .MuiInputBase-input": {
                    color: "#ffffff", // Set text color to white
                    paddingLeft: "10px",
                  },
                  borderRadius: 3,
                  width: "85%",
                  fontWeight: "bold",
                }}
                onChange={(e) => setMessage(e.target.value)}
              />
              <Button
                variant="contained"
                onClick={sendMessage}
                sx={{ borderRadius: 3, width: "15%", fontWeight: "bold" }}
                endIcon={<SendIcon />}
              >
                Send
              </Button>
            </Box>
          </Stack>
        </Box>
      </Box>
    </Box>
  );
}
