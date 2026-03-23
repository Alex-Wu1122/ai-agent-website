import type { Experience, Education } from "@/types";

export const experience: Experience[] = [
  {
    company: "HD Renewable Energy Co., Ltd.",
    role: "Backend / AI Systems Engineer Intern",
    period: "Jul. 2024 – Feb. 2025",
    bullets: [
      "Developed an image preprocessing pipeline for license plate datasets using computer vision techniques to prepare training data for model development.",
      "Implemented a YOLO-based license plate recognition system on EV charging station footage to track vehicle behavior and potential misuse.",
      "Integrated credit card payment workflows into the automated reconciliation system, expanding platform support for multiple payment methods.",
      "Designed and implemented an error-attention email filtering system that reduced redundant alerts by 90%, allowing RD and QE teams to focus on newly emerging issues.",
      "Implemented a Redis-based module to optimize error notification handling and reduce storage overhead for the alert filtering system.",
    ],
  },
  {
    company: "iKala Interactive Media Inc.",
    role: "Software Development Engineer in Test Intern",
    period: "Nov. 2023 – Jul. 2024",
    bullets: [
      "Built the automation infrastructure for iKala Cloud services, including test environments, user-role switching mechanisms, and modular framework design for future expansion.",
      "Integrated the testing framework with GitLab CI/CD pipelines to enable automated test execution.",
      "Refactored the automated testing framework using object-oriented design principles to improve code scalability and maintainability while enhancing the effectiveness of Copilot-assisted test generation.",
      "Improved automation testing efficiency by 5× through framework refactoring and modular test design.",
      "Automated 125 of 156 test cases, achieving 80% test coverage across E2E, Web, and API testing workflows.",
    ],
  },
];

export const education: Education[] = [
  {
    institution: "University of Illinois Urbana-Champaign",
    degree: "Master of Computer Science (GPA: 3.78)",
    year: "2025 – 2027",
  },
  {
    institution: "National Central University",
    degree: "B.S. in Computer Science (GPA: 3.94 / 4.3)",
    year: "2020 – 2024",
  },
];

export const summary =
  "Chat with my AI agent — it updates the UI to highlight what matters 🔥🔥🔥";
