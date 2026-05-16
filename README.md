AI Study Group Chat
A realistic AI-powered group chat where three student personas — Maya, Leo, and Sam — respond to your messages like real people in a group chat. Built with a FastAPI backend and a React + Vite frontend.

How it works

When you send a message, a coordinator model first decides which agents would realistically reply (sometimes just one, sometimes two, rarely all three). The agents then respond sequentially so each one can "read" what the others said. Every agent has full conversation history for context. Total of 4 different AI model ws used all free through OpenRouter.


I orginally planned on creating a debate system where different AI models answers the same question and critiques the others answer, and later came with this idea.
