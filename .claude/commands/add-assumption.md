# Add Assumption

Add a new assumption to test for your product discovery project.

## What this does

Creates an assumption about your solution that needs validation. Classifies it by type (value/usability/feasibility) and priority (important/unimportant + known/unknown) to help you decide what to test first.

## When to use

- After creating a story map and identifying assumptions in each step
- When you have a hypothesis about user behavior or technical feasibility
- Before building features - validate assumptions first

## Usage

```
/add-assumption
```

Or directly:

```
/add-assumption Warehouse operators will input data immediately after unloading
```

## Process

1. **Select project** (if multiple exist)

2. **Describe the assumption**

3. **Classify it:**
   - Type: Value (creates value?), Usability (user-friendly?), Feasibility (can we build it?)
   - Importance: Important or Unimportant
   - Certainty: Known or Unknown

4. **Prioritize automatically:**
   - 🔴 Important + Unknown = TEST FIRST
   - 🟡 Important + Known = Low risk
   - 🔵 Unimportant + Unknown = Test if time
   - ⚪ Unimportant + Known = Don't test

5. **Suggest experiments** based on the assumption type

## Example

```
User: /add-assumption

Claude: Which project?
1. Active Container Leasing
2. 5-Minute Break App

User: 1

Claude: What's your assumption?

User: Warehouse operators will input container numbers immediately after unloading

Claude: Let me classify this:
- Type: Usability (can they do it easily?)
- Importance? (important/unimportant)

User: important

Claude: Certainty? (known/unknown)

User: unknown

Claude: 🔴 Priority: TEST FIRST (Important + Unknown)

✅ Assumption added!

Suggested experiments:
- Prototype: Simple mobile form mockup
- Research Spike: Shadow 3 operators for a day
- Wizard of Oz: Paper form for 1 week

Want to design an experiment? Use /design-experiment
```

## Implementation notes

- Use `assumptions` table from schema-discovery.ts
- Link to projectId and optionally solutionId/storyMapId
- Default status: 'untested'
