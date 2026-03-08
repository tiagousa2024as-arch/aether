# Agent architecture

Modular system for executing user commands via a pipeline of specialized agents.

## Agents

| Agent | Role | Location |
|-------|------|----------|
| **PlannerAgent** | Converts user command → execution plan (ordered steps) | `planner-agent.ts` |
| **ResearchAgent** | Simulated research step; future: search/RAG/LLM | `research-agent.ts` |
| **CodeAgent** | Simulated code/content generation; future: LLM or sandbox | `code-agent.ts` |
| **AutomationAgent** | Simulated automation/export; future: workflows, integrations | `automation-agent.ts` |
| **MemoryAgent** | Simulated memory/outline; future: vector store, knowledge base | `memory-agent.ts` |

## Flow

1. **Plan**: User command → `generatePlan(command)` → `ExecutionPlan` (steps with `type` and `order`).
2. **Run**: Runner picks the right agent per step (`getAgent(step.type)`), passes `ExecutionContext` (previous results, command), and returns `StepResult`.

## Scalability for real AI

- **PlannerAgent**: Replace keyword templates in `planner-agent.ts` with an LLM call (e.g. “Given this command, return a JSON list of steps with type and title”).
- **Execution agents**: In each agent’s `execute()`, replace `sleep()` + static text with:
  - Research: search API + LLM summarization.
  - Code: LLM with code model or code execution API.
  - Automation: trigger real workflows (Stripe, Notion, etc.).
  - Memory: read/write to your vector DB or memory API.
- **Context**: `ExecutionContext.previousResults` and `metadata` already support chaining and user/workspace context for RAG or prompt building.

## Usage

- **tRPC**: `agent.createPlan({ command })`, `agent.executeStep({ step, context })`.
- **Server**: `import { generatePlan, executeStep, executePlan } from "@/server/agents"`.
