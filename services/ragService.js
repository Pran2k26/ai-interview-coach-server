const chunkText = require("../utils/chunkText");
const getEmbedding = require("../utils/embedding");
const similarity = require("cosine-similarity");
const Groq = require("groq-sdk");

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

let vectorStore = [];

/*
--------------------------
Store Resume
--------------------------
*/

async function storeResume(text) {
  vectorStore = [];

  const chunks = chunkText(text);

  for (const chunk of chunks) {
    const embedding = await getEmbedding(chunk);

    vectorStore.push({
      chunk,
      embedding,
    });
  }

  return true;
}

/*
--------------------------
Retrieve Relevant Chunks
--------------------------
*/

async function retrieve(query) {
  const queryEmbedding = await getEmbedding(query);

  const scores = vectorStore.map((item) => ({
    chunk: item.chunk,
    score: similarity(
      queryEmbedding,
      item.embedding
    ),
  }));

  scores.sort((a, b) => b.score - a.score);

  return scores.slice(0, 3);
}

/*
--------------------------
Generate RAG Questions
--------------------------
*/

async function generateRAGQuestions() {
  const retrievedChunks = await retrieve(
    "Generate technical interview questions from this resume"
  );

  const context = retrievedChunks
    .map((item) => item.chunk)
    .join("\n\n");

  const completion =
    await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: `
You are an expert technical interviewer.

Below is the candidate's resume context:

${context}

Generate exactly 2 personalized interview questions based ONLY on the resume.

Focus on:
- Projects
- Skills
- Technologies
- Experience

Return only the questions.
One question per line.
Do not number them.
Do not add any heading.
          `,
        },
      ],
      model: "llama-3.3-70b-versatile",
    });

  const questions = completion.choices[0].message.content
    .split("\n")
    .map((q) => q.trim())
    .filter((q) => q.length > 0);

  return questions;
}

module.exports = {
  storeResume,
  retrieve,
  generateRAGQuestions,
};

