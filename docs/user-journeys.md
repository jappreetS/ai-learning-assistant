# v1 user journeys

## Shared rules

- Audience: software engineers.
- Entry points: resume + JD, JD only, or manually entered target role.
- AI proposes a learning roadmap; the user reviews and approves before it becomes active.
- Evidence states for skills: Studied → Practiced → Applied → Demonstrated.
- A user may have multiple independent roadmaps (e.g. two different target roles).

---

## Journey A — Start with resume + JD

1. User uploads or pastes a resume and a job description.
2. System analyzes skills: matches, gaps, and unclear/missing evidence.
3. User reviews the gap summary.
4. System proposes a learning roadmap (topics, order, suggested practice).
5. User edits or approves the roadmap.
6. Approved roadmap becomes the active plan for that target role.

## Journey B — Start with JD only

1. User provides a job description (no resume).
2. System infers required skills from the JD and treats coverage as unknown/gap unless the user adds evidence.
3. User may optionally self-assess skills they already have.
4. System proposes a roadmap from the remaining gaps.
5. User approves (or edits) the roadmap.
6. Roadmap becomes active.

## Journey C — Start with a manually entered target role

1. User enters a target role (e.g. “Staff Frontend Engineer”) and optional notes.
2. System builds an initial skill profile for that role (from role knowledge + optional questions).
3. User confirms or adjusts the skill list / self-assessment.
4. System proposes a roadmap.
5. User approves (or edits) the roadmap.
6. Roadmap becomes active.

## Journey D — Follow the roadmap (evidence loop)

1. User opens an active roadmap item (topic or skill).
2. User studies material → marks or logs **Studied**.
3. User practices (exercises, drills) → **Practiced**.
4. User applies learning in a small project or real task → **Applied**.
5. User produces demonstrable proof (project, write-up, reviewable artifact) → **Demonstrated**.
6. Roadmap progress and priorities update from evidence state changes.

## Journey E — Log a learning session

1. User logs a short session (what they did, topic/skill, time, source type: book / video / practice / project).
2. System attaches the session to the relevant skill(s) and roadmap.
3. Progress, gaps, and weekly priorities refresh from the new evidence.
4. User sees an updated view of what’s done vs what to do next.

## Journey F — Switch between independent roadmaps

1. User has more than one roadmap (e.g. Staff Frontend and Senior Full-Stack).
2. User switches the active roadmap in the product.
3. Progress, gaps, and priorities shown are only for the selected roadmap.
4. Work on one roadmap does not change the other roadmap’s progress.