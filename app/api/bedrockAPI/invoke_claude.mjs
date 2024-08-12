// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { fileURLToPath } from "url";

import { config } from "dotenv";

config();

import {
  BedrockRuntimeClient,
  InvokeModelCommand,
} from "@aws-sdk/client-bedrock-runtime";

// *********************  separartely set up keys. copy and paste key here to run ******************
export const invokeModel = async (prompt, modelId = "anthropic.claude-v2") => {
  // Create a new Bedrock Runtime client instance.

  const client = new BedrockRuntimeClient({
    region: "us-east-1",
    credentials: {
      accessKeyId: "AKIA37NZM2NM3XJGUPOE",
      secretAccessKey: "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",
    },
  });

  // Prepare the payload for the Messages API request.
  const payload = {
    anthropic_version: "bedrock-2023-05-31",
    max_tokens: 1000,
    messages: [
      {
        role: "user",
        content: [{ type: "text", text: prompt }],
      },
    ],
  };

  // Invoke Claude with the payload and wait for the response.
  const command = new InvokeModelCommand({
    contentType: "application/json",
    body: JSON.stringify(payload),
    modelId,
  });
  const apiResponse = await client.send(command);

  // Decode and return the response(s)
  const decodedResponseBody = new TextDecoder().decode(apiResponse.body);
  /** @type {MessagesResponseBody} */
  const responseBody = JSON.parse(decodedResponseBody);
  return responseBody.content[0].text;
};

export const invokeTextCompletionsApi = async (
  prompt,
  modelId = "anthropic.claude-v2"
) => {
  // Create a new Bedrock Runtime client instance.
  const client = new BedrockRuntimeClient({
    region: "us-east-1",
    credentials: {
      accessKeyId: "AKIA37NZM2NM3XJGUPOE",
      secretAccessKey: "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",
    },
  });

  // Prepare the payload for the Text Completions API, using the required prompt template.
  const enclosedPrompt = `Human: ${prompt}\n\nAssistant:`;
  const payload = {
    prompt: enclosedPrompt,
    max_tokens_to_sample: 500,
    temperature: 0.5,
    stop_sequences: ["\n\nHuman:"],
  };

  // Invoke Claude with the payload and wait for the response.
  const command = new InvokeModelCommand({
    contentType: "application/json",
    body: JSON.stringify(payload),
    modelId,
  });
  const apiResponse = await client.send(command);

  // Decode and return the response.
  const decoded = new TextDecoder().decode(apiResponse.body);
  /** @type {TextCompletionsResponseBody} */
  const responseBody = JSON.parse(decoded);
  return responseBody.completion;
};

// Invoke the function if this file was run directly.
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const prompt =
    'Complete the following in one sentence: "Once upon a time..."';
  const modelId = "anthropic.claude-v2";
  console.log(`Prompt: ${prompt}`);
  console.log(`Model ID: ${modelId}`);

  try {
    console.log("-".repeat(53));
    console.log("Using the Messages API:");
    const response = await invokeModel(prompt, modelId);
    console.log(response);
  } catch (err) {
    console.log(err);
  }

  try {
    console.log("-".repeat(53));
    console.log("Using the Text Completions API:");
    const response = await invokeTextCompletionsApi(prompt, modelId);
    console.log(response);
  } catch (err) {
    console.log(err);
  }
}
