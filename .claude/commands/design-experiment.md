# Design Experiment

Design an experiment to test an assumption.

## What this does

Creates a structured experiment to validate an assumption. Uses the framework: Assumption → Simulate → Evaluation (Behavior + Criteria) → Iteration.

## When to use

- After identifying high-priority assumptions (Important + Unknown)
- Before building features - test first
- When you need to validate user behavior or technical feasibility

## Usage

```
/design-experiment
```

Or link to assumption:

```
/design-experiment for assumption #5
```

## Process

1. **Select assumption to test**

2. **Choose experiment method:**
   - Prototype: Clickable mockup
   - Survey: 1-question survey
   - Data Mining: Analyze existing data
   - Research Spike: Interviews/observation
   - Wizard of Oz: Manual behind-the-scenes
   - Concierge: Deliver service manually
   - Landing Page: Test demand
   - Fake Door: Measure interest
   - A/B Test: Compare alternatives

3. **Define experiment:**
   - **Simulate:** How will you test it? (describe the prototype/survey/etc)
   - **Behavior:** What behavior should be shown?
   - **Criteria:** What does success look like? (quantifiable)
   - **Iteration:** What will you do based on results?

4. **Save experiment** and track progress

## Example

```
User: /design-experiment

Claude: Which assumption do you want to test?

1. Warehouse operators will input data immediately (🔴 Priority: TEST FIRST)
2. Auto-calculated dates are accurate (🔴 Priority: TEST FIRST)

User: 1

Claude: Great! What experiment method?

1. Prototype
2. Survey
3. Research Spike
4. Wizard of Oz

User: Prototype

Claude: Describe your prototype:

User: Simple mobile form mockup. Ask 3 operators to simulate inputting 5 container numbers

Claude: What behavior should be shown?

User: They complete input without stopping their workflow

Claude: What's the success criteria?

User: 2 out of 3 complete all 5 inputs within 2 minutes without errors

Claude: If it works, what's next? If it doesn't?

User: If YES → build mobile input. If NO → explore barcode scanner

Claude: ✅ Experiment created!

📊 Experiment #1: Prototype
Assumption: Warehouse operators will input data immediately
Status: planned

Want to mark it as running? Update status in /discovery/experiments
```

## Implementation notes

- Use `experiments` table
- Link to assumptionId
- Status starts as 'planned'
- Can update to 'running' → 'completed'
