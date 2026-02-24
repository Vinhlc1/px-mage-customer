# Token Optimization Guidelines

This document provides a set of rules and best practices to ensure all interactions are as token-efficient as possible. The goal is to maximize clarity while minimizing token usage.

## Core Principles

1.  **Be Concise and Direct:**
    -   Avoid verbose language. Get straight to the point.
    -   **Bad:** "I was wondering if you could possibly create a new React component for me. It should be a button."
    -   **Good:** "Create a new React component: `Button`."

2.  **Do Not Repeat Context:**
    -   The agent has access to the conversation history. Do not repeat information that has already been provided.
    -   Reference previous messages or files instead of quoting them.

3.  **Use Structured Data:**
    -   Provide requirements in a structured format like lists, JSON, or YAML instead of long descriptive paragraphs.
    -   **Bad:** "The component needs a primary variant which should have a blue background, and a secondary variant that should have a grey background."
    -   **Good:**
        ```json
        {
          "variants": {
            "primary": { "background": "blue" },
            "secondary": { "background": "grey" }
          }
        }
        ```

4.  **Reference, Don't Recite:**
    -   When referring to code, files, or skills, use their names or paths. Do not include their full content in the prompt.
    -   **Bad:** "In the file `src/app/page.tsx` which contains `...`, please change `...` to `...`"
    -   **Good:** "In `src/app/page.tsx`, change the `h1` text to 'Welcome'."

5.  **Leverage Existing Skills:**
    -   Instead of describing a multi-step process, invoke the `orchestra-skill` or another specialized skill that already encapsulates that process.
    -   **Bad:** "First, create a file. Then, add a React component to it. Then, add styles..."
    -   **Good:** "Create a new `UserProfile` component." (The agent will then use the orchestra workflow).

6.  **Incremental Instructions:**
    -   For complex tasks, provide instructions step-by-step. This prevents overly long initial prompts and allows for corrections along the way, which is more token-efficient in the long run than having to fix a large, incorrect output.
