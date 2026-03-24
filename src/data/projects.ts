import type { Project } from "@/types";

export const projects: Project[] = [
  {
    id: "1",
    title: "Portfolio AI Agent (This Site)",
    description:
      "This portfolio — a Next.js site where an AI agent (Groq + local LLM fallback) answers recruiter questions in real-time and dynamically updates the UI via structured tool calls and SSE streaming.",
    tech: [
      "Next.js",
      "TypeScript",
      "AI Agent",
      "LLM",
      "System Design",
      "Full Stack",
      "Frontend",
      "Backend",
      "Real-time",
      "API"
    ],
    tags: [
      "AI Agent",
      "LLM",
      "Full Stack",
      "Real-time Systems",
      "System Architecture",
      "Web App"
    ],
  },
  {
    id: "2",
    title: "Code LLM and Agent Evaluation Pipeline",
    description:
      "Built a Python pipeline to evaluate code LLMs and analyze SWE-Agent trajectories across code generation, reasoning, test generation, translation, and bug detection tasks. Implemented automated prompt evaluation and trajectory analysis using correctness, pass@1, and coverage metrics.",
    tech: [
      "Python",
      "LLM",
      "Agent Systems",
      "Evaluation Pipeline",
      "Backend",
      "Data Pipeline",
      "API",
      "AI",
      "Automation"
    ],
    tags: [
      "LLM",
      "AI",
      "Model Evaluation",
      "Prompt Engineering",
      "Backend",
      "Data Pipeline"
    ],
  },
  {
    id: "3",
    title: "Secure Hierarchical Authentication for IoT Cameras",
    description:
      "Top 6 in CSIE Capstone Project Competition. Built a prototype IoT camera system using STM32 and Raspberry Pi with secure communication implemented via OP-TEE (ARM TrustZone) and RSA-based encryption.",
    tech: [
      "C/C++",
      "Embedded Systems",
      "IoT",
      "Security",
      "ARM TrustZone",
      "Backend",
      "Edge Computing",
      "Systems Programming"
    ],
    tags: [
      "IoT",
      "Embedded Systems",
      "Cybersecurity",
      "Edge Computing",
      "Systems"
    ],
  },
  {
    id: "4",
    title: "BERT Film Review Sentiment Analyzer",
    description:
      "Built a BERT-based app to analyze online movie reviews from user-inputted titles. Collected movie review data via web scraping and constructed a dataset for fine-tuning the sentiment classification model.",
    tech: [
      "Python",
      "PyTorch",
      "BERT",
      "NLP",
      "Deep Learning",
      "Machine Learning",
      "Data Processing",
      "AI"
    ],
    tags: [
      "NLP",
      "Deep Learning",
      "BERT",
      "Machine Learning",
      "AI",
      "Data"
    ],
  },
  {
    id: "5",
    title: "Applied Machine Learning Models",
    description:
      "Applied Bayesian models and missing-data methods for PM2.5 prediction and meteorological feature analysis. Implemented RBFN, K-Means, and Hopfield networks for autonomous vehicle control and image recall tasks.",
    tech: [
      "Python",
      "Machine Learning",
      "Data Analysis",
      "Statistical Modeling",
      "Data Science",
      "AI",
      "Modeling"
    ],
    tags: [
      "Machine Learning",
      "Data Science",
      "Predictive Modeling",
      "AI",
      "Analytics"
    ],
  },
];