# Learning data model

The screens still show a fixed sample. These tables are the stored shape of that sample. A later task reads them. This note does not connect the pages.

## plans

One row is one roadmap.

Staff Frontend Engineer at Northwind Labs is one row. Senior Full-Stack Engineer at Harbor Payments is another. The Plans screen lists these rows. One plan is the active plan.

## plan_weeks

One row is one block of weeks on a plan.

W3–4, Architecture review practice, belongs to the Staff Frontend plan. The Roadmap screen lists a plan’s weeks in order. The row stores the plan’s id.

## skills

One row is one skill on a plan.

Architecture reviews and RFCs belongs to the Staff Frontend plan. The stage is Studied, Practiced, Applied, or Demonstrated. The row also stores the latest note and the next step. The Progress screen lists a plan’s skills. The row stores the plan’s id.

## sessions

One row is one sitting of study.

It stores the date, the duration, the stage for that sitting, and the note. It stores the plan’s id and the skill’s id. The Sessions screen lists a plan’s sessions. The skill id says which skill that sitting was for.

## How a row points at another

A week points at a plan. A skill points at a plan. A session points at a plan and at a skill. The plan’s id is stored on the week, the skill, and the session, so each plan keeps its own weeks, skills, and sessions.