// app/api/bedrockAPI/route.js

import { NextResponse } from "next/server";

import { config } from "dotenv";

config();

// Use the Conversation API to send a text message to Anthropic Claude.

import {
  BedrockRuntimeClient,
  InvokeModelCommand,
} from "@aws-sdk/client-bedrock-runtime";

const systemPrompt = `
How can I assist you today? Here are some ways I can help:

Getting Started:

How to sign up and create an account.
Navigating the Headstarter platform.
Setting up your first AI interview.
Interview Practice:

Scheduling a practice session.
Types of technical interviews available.
Tips for effective interview practice.
Using the Platform:

Understanding your practice session feedback.
Reviewing and analyzing past interviews.
Customizing your interview settings.
Technical Support:

Troubleshooting login or account issues.
Resolving technical problems during an AI interview.
Reporting bugs or issues with the platform.
Additional Resources:

Accessing study materials and resources.
Connecting with the Headstarter community.
Information about subscription plans and billing.
Feel free to ask me any questions or describe the issue you're facing, and I'll do my best to assist you!
`;

export async function POST(req) {
  const data = await req.json;
  const client = new BedrockRuntimeClient({
    region: process.env.AWS_REGION,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
  });

  const userPrompt = data.userPrompt;

  const enclosedPrompt = `${systemPrompt}\n\nHuman: ${userPrompt}\n\nAssistant:`;
  const payload = {
    // userPrompt: enclosedPrompt,
    prompt: enclosedPrompt,
    max_tokens_to_sample: 500,
    // temperature: 0.5,
    stop_sequences: ["\n\nHuman:"],
  };

  const command = new InvokeModelCommand({
    contentType: "application/json",
    body: JSON.stringify(payload),
    modelId: "anthropic.claude-v2",
  });
  const apiResponse = await client.send(command);

  const decoded = new TextDecoder().decode(apiResponse.body);
  const responseBody = JSON.parse(decoded);

  return NextResponse.json(responseBody.completion);
}
