# Product Discovery & Experimentation Module

## Overview

This module brings structured product discovery and experimentation into Auto-CRM. Validate assumptions before building features, test fast, learn faster.

Based on the "Increasing the Odds" training framework combining:
- Opportunity Solution Tree
- Story Mapping
- Assumption Testing
- Experiment Design
- Interview Capture

## What's Included

### 📊 Database Schema
- **Projects**: Discovery projects for each product/feature
- **Opportunities**: Problems identified from user research
- **Solutions**: Proposed solutions to opportunities
- **Story Maps**: User journey mapping
- **Assumptions**: Hypotheses to validate (Value/Usability/Feasibility)
- **Experiments**: Structured tests (Prototype, Survey, Data Mining, etc.)
- **Interview Notes**: User research using Interview Snapshot framework
- **Insights**: Extracted learnings linking interviews to opportunities

### 🎯 Commands (Claude Code)

| Command | Purpose |
|---------|---------|
| `/create-project` | Start a new discovery project |
| `/add-assumption` | Define assumptions to test |
| `/design-experiment` | Create structured experiments |
| `/interview-notes` | Capture user interviews |

### 🖥️ UI Pages

- `/discovery` - Dashboard and getting started
- `/discovery/projects` - List of all projects
- `/discovery/projects/[id]` - Project detail with tabs for tree/assumptions/experiments

## Quick Start

1. **Create a project:**
```bash
# In Claude Code
/create-project
```

2. **Conduct user interviews:**
```bash
/interview-notes
```

3. **Define assumptions:**
```bash
/add-assumption
```

4. **Design experiments:**
```bash
/design-experiment
```

## Methodology

### Opportunity Solution Tree

```
Business Goal
    ↓
Outcome (user need)
    ↓
Opportunity (problem)
    ↓
Solution (how to solve)
    ↓
Experiment (how to validate)
```

### Assumption Prioritization

Classify by **Type**:
- 🔵 **Value**: Does it create value for users?
- 🟣 **Usability**: Can users use it easily?
- 🟡 **Feasibility**: Can we build it with available tech/resources?

Prioritize by **Importance × Certainty**:
- 🔴 **Important + Unknown** = TEST FIRST
- 🟡 **Important + Known** = Low risk, proceed
- 🔵 **Unimportant + Unknown** = Test if time allows
- ⚪ **Unimportant + Known** = Don't test

### Experiment Framework

**Structure:**
1. **Assumption**: What do we believe?
2. **Simulate**: How will we test it?
3. **Evaluation**:
   - Behavior: What should be shown?
   - Criteria: What does success look like?
4. **Iteration**: What's next based on results?

**Methods:**
- Prototype (clickable mockup)
- Survey (1-question survey)
- Data Mining (analyze existing data)
- Research Spike (interviews, observation)
- Wizard of Oz (manual behind-the-scenes)
- Concierge (deliver manually first)
- Landing Page (test demand)
- Fake Door (measure interest)
- A/B Test (compare alternatives)

### Interview Snapshot Framework

Capture interviews with:
- **Quote**: One memorable statement
- **Key Info**: Demographics, context
- **Insights/Facts**: What they DO (not what they say)
- **Opportunities**: Unmet needs, pain points, desires

## Example Workflow

### Scenario: Container Return Feature

1. **Create Project**
```
/create-project Active Container Leasing
Goal: Reduce cost by increasing on-time container returns
```

2. **Conduct Interviews**
```
/interview-notes
- Warehouse Manager: "I forget in my daily business to commission the return"
- Pain point: Manual tracking, no reminders
- Opportunity: Automated dashboard with alerts
```

3. **Define Assumptions**
```
/add-assumption
- "Warehouse operators will input container # immediately after unloading"
- Type: Usability
- Priority: Important + Unknown = 🔴 TEST FIRST
```

4. **Design Experiment**
```
/design-experiment
- Method: Prototype
- Simulate: Simple mobile form, 3 operators test with 5 containers
- Behavior: Complete without errors
- Criteria: 2/3 complete in <2 minutes
- Iteration: If yes → build. If no → barcode scanner
```

5. **Run & Learn**
- Mark experiment as 'running'
- Capture results
- Iterate based on learnings

## Database Initialization

The schema will be created when you run:

```bash
npm run init
```

Or manually create tables from `src/db/schema-discovery.ts`.

## Integration with CRM

This module is **project-agnostic**:
- Works for any product/feature (not just CRM features)
- Can be used for casino platform, SaaS products, internal tools, etc.
- Treat it as a separate "workspace" within Auto-CRM

## Why This Matters

Traditional approach:
```
Idea → Build → Launch → Realize it's wrong → Waste time/money
```

Discovery approach:
```
Idea → Interview → Identify assumptions → Test → Learn → Build right thing
```

**Benefits:**
- ✅ Build the right features (validated by users)
- ✅ Reduce waste (don't build unused features)
- ✅ Increase confidence (data-driven decisions)
- ✅ Faster learning (small experiments beat big launches)
- ✅ Better outcomes (solve real problems)

## Prototyping with AI

The module leverages AI (Claude, v0.dev, etc.) for rapid prototyping:

```
/design-experiment
Method: Prototype

Claude: Here's a prompt to generate it with AI:
"Create a mobile app for warehouse operators to input container numbers..."
```

Copy prompt → Generate in v0.dev → Test with users → Learn fast.

## Future Enhancements

- [ ] Visual Opportunity Solution Tree builder
- [ ] Drag-and-drop Story Mapping canvas
- [ ] Assumption matrix visualization
- [ ] Experiment templates library
- [ ] AI-powered insight extraction from interviews
- [ ] Integration with prototyping tools (Figma, v0.dev)
- [ ] Analytics dashboard for experiment results

## Learn More

This module is based on:
- **Continuous Discovery Habits** by Teresa Torres
- **Lean Startup** by Eric Ries
- **Sprint** by Jake Knapp (Google Ventures)
- **Interviewing Users** by Steve Portigal
- **Testing Business Ideas** by David J. Bland

## Support

Questions? Issues? Improvements?
- GitHub Issues: [auto-crm/issues](https://github.com/Hainrixz/auto-crm/issues)
- Tag with `discovery` label

---

Built with ❤️ for makers who want to build the right thing, not just build things right.
