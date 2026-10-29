# Learning data model

These tables are what the screens store. A week, a skill, and a session belong to a plan. A job application may point at a plan.

## plans

One row is one roadmap.

Staff Frontend Engineer at Northwind Labs is one row. Senior Full-Stack Engineer at Harbor Payments is another. The Plans screen lists these rows. One plan is the active plan.

A plan also records whether the model wrote its weeks.

## plan_weeks

One row is one block of weeks on a plan.

W3–4, Architecture review practice, belongs to the Staff Frontend plan. The Roadmap screen lists a plan’s weeks in order. The row stores the plan’s id.

## skills

One row is one skill on a plan.

Architecture reviews and RFCs belongs to the Staff Frontend plan. The stage is Studied, Practiced, Applied, or Demonstrated. The row also stores the latest note and the next step. The Progress screen lists a plan’s skills. The row stores the plan’s id.

## sessions

One row is one sitting of study.

It stores the date, the duration, the stage for that sitting, and the note. It stores the plan’s id and the skill’s id. The Sessions screen lists a plan’s sessions. The skill id says which skill that sitting was for.

## job_applications

One row is one application.

Staff Frontend Engineer at Northwind Labs can be one row. The stage is Saved, Applied, or Interviewing. The row may store a plan’s id. Job Applications lists these rows. When the plan is deleted, the application remains and its plan id becomes empty.

## How a row points at another

A week points at a plan. A skill points at a plan. A session points at a plan and at a skill. The plan’s id is stored on the week, the skill, and the session, so each plan keeps its own weeks, skills, and sessions.

An application may point at a plan. The plan does not own the application, so deleting the plan only clears that id.