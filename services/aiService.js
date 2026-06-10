const Groq = require("groq-sdk");


const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const generateQuestions = async (role, level) => {
  const completion = await groq.chat.completions.create({
    messages: [
      {
        role: "user",
        content: `Generate exactly 5 interview questions for a ${level} ${role}. Return only the questions, one per line.`
      }
    ],
    model: "llama-3.3-70b-versatile",
  });

  const questions = completion.choices[0].message.content
    .split("\n")
    .map(q => q.replace(/^\d+\.\s*/, "").trim())
    .filter(q => q.length > 0);

  return questions;
};


const evaluateAnswer = async (question, answer) => {
  const completion = await groq.chat.completions.create({
    messages: [
      {
        role: "user",
        content: `
You are an expert technical interviewer.

Evaluate the candidate's answer.

Return ONLY in the following format exactly.

Score: <number>/10

Feedback:
<Write detailed feedback in 3-5 sentences mentioning strengths and areas of improvement.>

Do not add any introduction or conclusion.

Question:
${question}

Candidate Answer:
${answer}
        `,
      },
    ],
    model: "llama-3.3-70b-versatile",
  });

  return completion.choices[0].message.content;
};

const generateRoadmapAI = async (
  role,
  level,
  duration
) => {

  const completion =
    await groq.chat.completions.create({

      messages: [
        {
          role: "user",

content: `
You are an expert software mentor.

Generate a learning roadmap in VALID JSON format only.

Role: ${role}
Level: ${level}
Duration: ${duration}

Return JSON exactly like this:

{
  "title":"MERN Developer Roadmap",
  "weeks":[
    {
      "week":"Week 1",
      "title":"JavaScript Fundamentals",
      "topics":[
        "Variables",
        "Functions",
        "Objects",
        "Arrays"
      ],
      "project":"Build a Calculator App"
    },
    {
      "week":"Week 2",
      "title":"React Basics",
      "topics":[
        "Components",
        "Props",
        "State",
        "Hooks"
      ],
      "project":"Build Todo App"
    }
  ],
  "finalProjects":[
    "Job Portal",
    "AI Interview Coach",
    "E-commerce Website"
  ],
  "resources":[
    "FreeCodeCamp",
    "Traversy Media",
    "Hitesh Choudhary"
  ],
  "interviewTips":[
    "Practice DSA daily",
    "Build projects",
    "Revise JavaScript",
    "Practice mock interviews"
  ]
}

Return ONLY valid JSON.
Do not use markdown.
Do not add explanations.
`,
        },
      ],

      model:
        "llama-3.3-70b-versatile",
    });

  return completion.choices[0].message.content;
};

//resume analyser


const analyzeResumeAI = async (resumeText) => {
  const completion = await groq.chat.completions.create({
    messages: [
      {
        role: "user",
        content: `
You are an expert ATS Resume Analyzer.

Analyze the following resume.

Return ONLY valid JSON.

{
  "atsScore": 85,
  "strengths": [
    "Strength 1",
    "Strength 2",
    "Strength 3"
  ],
  "missingSkills": [
    "Skill 1",
    "Skill 2",
    "Skill 3"
  ],
  "suggestions": [
    "Suggestion 1",
    "Suggestion 2",
    "Suggestion 3"
  ]
}

Resume:

${resumeText}
        `,
      },
    ],
    model: "llama-3.3-70b-versatile",
  });

  return completion.choices[0].message.content;
};

//job description and resume matchResume
// const matchResumeAI = async (
//   resumeText,
//   jobDescription
// ) => {

//   const completion =
//     await groq.chat.completions.create({

//       messages: [

//         {

//           role: "user",

//           content: `
// You are an ATS Resume Expert.

// Compare the Resume and Job Description.

// Return ONLY valid JSON.

// {
// "matchScore":85,
// "matchingSkills":[
// "React",
// "Node.js"
// ],
// "missingSkills":[
// "Docker",
// "AWS"
// ],
// "suggestions":[
// "Add Docker project",
// "Mention REST APIs"
// ],
// "summary":"Overall resume is good but needs cloud skills."
// }

// Resume:

// ${resumeText}

// Job Description:

// ${jobDescription}
// `,
//         },

//       ],

//       model: "llama-3.3-70b-versatile",

//     });

//   return completion.choices[0].message.content;

// };
const matchResumeAI = async (
  resumeText,
  jobDescription
) => {

  const completion =
    await groq.chat.completions.create({

      messages: [
        {
          role: "user",

          content: `
You are an ATS Resume Expert.

Compare the resume with the job description.

Return ONLY valid JSON.

Do not use markdown.

Do not wrap the response inside \`\`\`json.

Do not write explanations.

Return exactly in this format:

{
  "matchScore": 90,
  "matchingSkills": [
    "React",
    "Node.js",
    "Express",
    "MongoDB"
  ],
  "missingSkills": [
    "Docker",
    "AWS"
  ],
  "suggestions": [
    "Add Docker project",
    "Mention AWS deployment",
    "Highlight REST API experience"
  ],
  "summary": "Your resume matches most requirements but lacks cloud technologies."
}

Resume:

${resumeText}

Job Description:

${jobDescription}
`,
        },
      ],

      model: "llama-3.3-70b-versatile",
    });

  return completion.choices[0].message.content;
};


const evaluateRAGAnswer = async (question, answer) => {

  const completion = await groq.chat.completions.create({

    messages: [
      {
        role: "user",

        content: `
You are an expert technical interviewer.

Evaluate the candidate's answer.

Question:
${question}

Candidate Answer:
${answer}

Return ONLY in this format:

Score: X/10

Feedback:
Write 3-5 lines of constructive feedback.

Do not add anything else.
`,
      },
    ],

    model: "llama-3.3-70b-versatile",
  });

  return completion.choices[0].message.content;
};



module.exports = {
  generateQuestions,
  evaluateAnswer,
  generateRoadmapAI,
  analyzeResumeAI,
  matchResumeAI,
  evaluateRAGAnswer,
};