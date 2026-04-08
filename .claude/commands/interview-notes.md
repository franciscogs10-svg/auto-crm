# Interview Notes

Capture user interview notes using the Interview Snapshot framework.

## What this does

Creates structured interview notes following the Interview Snapshot template:
- Quote to remember
- Key Info (demographics, context)
- Insights/Facts (what they DO)
- Opportunities (unmet needs, pain points)

## When to use

- After conducting user interviews
- When gathering qualitative research
- To document insights and identify opportunities

## Usage

```
/interview-notes
```

Or quick capture:

```
/interview-notes Just interviewed warehouse manager - they forget to commission returns because it's not in their daily workflow
```

## Process

1. **Select project**

2. **Capture interview details:**
   - Interviewee name (optional)
   - Role/title
   - Date

3. **Fill Interview Snapshot:**
   - **Quote:** One memorable quote
   - **Key Info:** Demographics, context (family size, role, etc)
   - **Insights/Facts:** Observed behaviors, what they actually do
   - **Opportunities:** Pain points, unmet needs, "I wish..." statements

4. **Extract insights** and optionally link to opportunities

5. **Save and suggest next steps**

## Example

```
User: /interview-notes

Claude: Which project?
1. Active Container Leasing
2. 5-Minute Break App

User: 1

Claude: Who did you interview?

User: Warehouse Manager, Hamburg depot

Claude: Share a memorable quote:

User: "I forget in my daily business to commission the return"

Claude: Key info about them (role, depot size, workflow):

User: Manages 50 containers/month, uses Excel currently, no automated system

Claude: Insights - what did they DO (not what they said they'd do)?

User: - Planning process takes 45 min/week
- Checks containers manually by walking warehouse
- Forgets 20% of returns, discovers when lease bills arrive

Claude: Opportunities - what pain points or needs?

User: - "I wish I had a dashboard showing all containers"
- "I need reminders before deadlines"
- "I want to do bulk commissioning"

Claude: ✅ Interview captured!

I identified 3 opportunities:
1. Dashboard visibility
2. Automated reminders
3. Bulk actions

Want to add these to your Opportunity Solution Tree?
```

## Implementation notes

- Use `interviewNotes` table
- Store keyInfo, insights, opportunities as JSON strings
- Create `insights` records linking to potential `opportunities`
- Tags for easy filtering later
