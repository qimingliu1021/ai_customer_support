import { NextResponse } from "next/server";
import OpenAI from "openai";

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
  const openai = new OpenAI();
  const data = await req.json();

  const completion = await openai.chat.completions.create({
    messages: [{ role: "system", content: systemPrompt }, ...data],
    model: "gpt-3.5-turbo",
  });

  return NextResponse.json(
    { message: completion.choices[0].message.content },
    { status: 200 }
  );
}
