# Create Discovery Project

Create a new product discovery project in the CRM.

## What this does

Creates a new project for product discovery & experimentation. Each project tracks opportunities, assumptions, experiments, and interviews for a specific product/feature you're building.

## When to use

- Starting discovery for a new product/feature
- Want to validate assumptions before building
- Need to organize user research and experiments

## Usage

```
/create-project
```

Or describe directly:

```
/create-project I want to validate a feature for warehouse operators to commission container returns automatically
```

## Process

1. **Ask for project details:**
   - Project name
   - Description
   - Business goal (what outcome are you trying to achieve?)

2. **Create the project** in the discovery_projects table

3. **Confirm creation** and show:
   - Project ID
   - Next steps: add opportunities, create story maps, define assumptions

## Example

```
User: /create-project
Claude: Let's create a new discovery project. What are you working on?

User: Active Container Leasing - reduce costs by improving return tracking

Claude: Great! What's the business goal?

User: Reduce cost by increasing on-time container returns

Claude: ✅ Project created: "Active Container Leasing"

Next steps:
- Add opportunities with /add-opportunity
- Create story maps to identify assumptions
- Design experiments to test your riskiest assumptions
```

## Implementation notes

- Use `/home/franciscogarcia-sua/auto-crm/src/db/schema-discovery.ts`
- Insert into `discoveryProjects` table
- Default status: 'active'
- Set createdAt and updatedAt to now
