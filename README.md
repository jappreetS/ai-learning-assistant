# AI Learning Assistant

Personal AI-powered learning and career development platform for software engineers.

## Problem

Engineers learn from books, videos, practice sites, and projects, but progress is hard to track and turn into demonstrable skill. Job descriptions expose skill gaps; closing those gaps needs a clear path from learning → practice → progress.

## What this product does (v1 direction)

- Analyze a target role (resume + JD, JD only, or a manually entered role)
- Surface skill matches and gaps
- Propose an adaptive learning roadmap (user reviews and approves)
- Guide learning and practical mini-projects
- Track progress: Studied → Practiced → Applied → Demonstrated

## Docs

- [Problem statement](docs/problem-statement.md)
- [v1 user journeys](docs/user-journeys.md)
- [v1 MVP feature list](docs/mvp-feature-list.md)

## Run locally

Requires Node.js, Postgres, and [Ollama](https://ollama.com). Pull the model once:

```bash
ollama pull llama3.2

npm install
cp .env.example .env
npx drizzle-kit migrate
npm run dev

```

`DATABASE_URL` is the Postgres database. `OLLAMA_URL` is the model. When `OLLAMA_URL` is missing, the app calls Ollama at `http://127.0.0.1:11434`.

A production build:

```bash
npm run build
npm run start
```

The model runs on the machine where Ollama is installed. Skill gaps and a proposed plan need that model.

## Demo

1. Open **Target role**. Choose a resume and job description, a job description only, or a role you write. Click **Skill gaps**.
2. **Skill gaps** lists matches, gaps, and skills that still need proof. Click **Review plan**.
3. **Review plan** lists the weeks. If the model does not answer, the weeks use the gap names, and the page says the model did not write the plan. Click **Approve**.
4. **Roadmap** shows that plan. **Sessions** and **Progress** follow the active plan. **Plans** switches to another approved plan.
5. **Job Applications** opens a job's plan. A job with no plan opens **Target role**. After **Approve**, that job opens **Roadmap**.

The stages on Progress are Studied, Practiced, Applied, and Demonstrated.