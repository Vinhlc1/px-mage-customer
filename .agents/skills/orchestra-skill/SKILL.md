---
name: orchestra-skill
description: The primary skill for all development tasks. It orchestrates workflows for building features, components, and pages. Use for any coding or multi-step request.
---

# Orchestra Skill

This skill acts as a conductor, coordinating other specialized skills to execute complex development workflows.

## How it Works

When a high-level task is requested (e.g., "create a new feature"), this skill breaks it down into a sequence of sub-tasks and invokes the appropriate skill for each step.

### Example Workflow: Creating a New Page

1.  **Parse Request**: Understand the requirements for the new page.
2.  **Design Phase**: Invoke `frontend-design` to outline the UI/UX.
3.  **Component Scaffolding**: Invoke `shadcn-ui` to add necessary components.
4.  **Code Implementation**: Invoke `vercel-react-best-practices` to write the page code.
5.  **Styling**: Invoke `responsive-design` and `tailwind-design-system` to apply styles.
6.  **Testing**: Invoke `testing-expert` to generate tests.

By defining these workflows, the orchestra skill ensures consistency, quality, and efficiency.

## Core Knowledge & References

This skill relies on several key reference documents. Before performing a task, consult these references if relevant.

- **Backend API:** For any task involving data fetching or submission, refer to `references/backend-api-reference.md` for correct endpoints, request/response structures, and parameters.- **Database Schema:** For tasks involving data models, DTO design, or query logic, refer to `references/database-schema.md` to understand data relationships.- **Token Optimization:** For all interactions, adhere to the principles in `references/token-optimization-guidelines.md`.
