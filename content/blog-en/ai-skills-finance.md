---
title: "Skills and AI agents in finance: what they are and how to start"
slug: "ai-skills-finance"
description: "A guide to turning a recurring finance process into an AI Skill: choosing a process, testing with dummy data, permissions, controls and measuring results."
publishedAt: "2026-06-01"
updatedAt: "2026-08-04"
lastVerifiedAt: "2026-08-04"
author: "roei"
category: "financial-automation"
tags:
  - "ai-skills"
  - "ai-agents"
  - "claude"
  - "plugins"
  - "finance-automation"
featuredImage: "/images/blog/ai-skills-finance.png"
featuredImageAlt: "Unstructured financial documents pass through an AI engine to become a reviewed and approved report"
status: "published"
pillar: true
featured: true
relatedSlugs:
  - "scheduled-ai-tasks-finance"
  - "synthetic-data-ai-finance"
---

# Skills and AI agents in finance: what they are and how to start

An AI Skill is a package of instructions, knowledge and sometimes code that teaches an AI system how to perform a defined, recurring task. An AI agent uses a model, tools and permissions to plan and execute several steps toward an outcome. The practical difference: a Skill describes “how we do the work”; an agent receives a goal, selects steps and uses the Skill and connections to carry them out.

Neither is a “virtual CFO.” They can shorten tasks, produce documents and run checks, but need boundaries, valid input, minimal permissions and human oversight.

## Who is this for?

Skills and agents suit a process that:

- Repeats in a similar way each week or month.
- Follows rules that can be documented.
- Has defined inputs and outputs.
- Can be checked using control totals.
- Does not rely entirely on undocumented judgment.
- Starts with reading, analysis or preparing a draft.

Examples include preparing a close checklist, preliminary receivables aging analysis, collecting documents, checking file completeness, creating a reporting package and summarizing commercial contract terms.

## Skill, Plugin, Connector and Agent: what is the difference?

**Skill:** Task-specific instructions. It may include `skill.md`, examples, templates and scripts.

**Connector:** A connection to a service or information source, such as Drive, Microsoft 365 or a business system. The connection determines what the system can access.

**Plugin:** A broader package that can include Skills, connectors and subagents.

**Agent:** A component that receives a goal, plans steps and uses tools and connections to make progress.

Installing a Skill does not itself grant access to a bank account or ERP. Conversely, an Agent with an overly broad connector may receive more access than necessary. Instructions and permissions are therefore two separate layers.

## How do you build a good financial Skill?

### 1. Choose a narrow process

Do not start with “close the month.” Start with “check the bank reconciliation file for completeness and prepare an exceptions list.” A narrow process is easier to test and reverse.

### 2. Document the existing work

Write down:

- When the process starts.
- Which files are required.
- Which fields must be present.
- Which calculations are performed.
- Which exceptions stop the process.
- The output format.
- Who approves it.

A screen recording can help capture the workflow but does not replace a process document. Recordings can expose data, passwords and messages; make them only in an approved environment using dummy data.

### 3. Add examples

A good Skill includes valid input, invalid input and expected output. Examples reduce interpretation and support regression testing.

### 4. Set boundaries

For example:

- Do not change the source file.
- Do not send external messages.
- Do not guess missing values.
- Stop when the control total does not match.
- State every assumption.

### 5. Connect tools only after the logic works

First run the Skill on a local, synthetic file. Consider a connector to an organizational source only after output is stable. See [synthetic data for financial AI experiments](/en/blog/synthetic-data-ai-finance/) for a guide to building a suitable file.

## Worked example: Month-End Prep Skill

### Inputs

- An approved close checklist.
- A reconciliation status file.
- A list of entities and deadlines.
- A status report template.

### Skill steps

1. Check that every file has a current refresh timestamp.
2. Verify that all entities are included.
3. Classify tasks as “completed,” “open,” “blocked” and “overdue.”
4. Identify missing fields and inconsistencies.
5. Calculate completion rates by entity and task owner.
6. Create an exceptions table.
7. Draft a management update.
8. Request approval before saving a final file or sending it.

### Acceptance checks

- The output task count equals the source count.
- Every task has an entity and owner.
- Every exception links to a source row.
- The source file is unchanged.
- Output includes a timestamp and Skill version.

### Measuring success

Measure preparation time, genuine exceptions detected, false positives, manual corrections and the share of runs completed without failure. If the process is inconsistent, improve the Skill before adding autonomy.

## What is currently available in Claude?

According to Anthropic, Custom Skills are available in Claude on Free, Pro, Max, Team and Enterprise plans, subject to enabling code execution. They are also available in Claude Code and the API in the documented configurations. Team and Enterprise support organizational sharing or provisioning depending on settings.

Plugins are available on paid plans and can include Skills, connectors and subagents. In Cowork, connections to external services pass through Anthropic's cloud; do not assume they automatically access the local network.

Anthropic also offers Claude for Small Business, with ready-made workflows for areas such as month-end, invoice chasing and cash position. Availability and connections focus on global systems such as QuickBooks and PayPal; Israeli organizations should check compatibility with their local systems.

## Risks and controls

- **Malicious Skill:** Review code and packages before installation.
- **Secrets in files:** Do not store API keys or passwords in a Skill.
- **Broad connector:** Grant minimum permissions.
- **Irreversible action:** Require approval before sending, paying, deleting or posting.
- **Process changes:** Assign an owner and Skill version.
- **Conflicting instructions:** Define one authoritative source.
- **Convincing but incorrect results:** Use control totals and source references.
- **Screen recording:** Use a dummy environment and clear notifications and identifying details.

## Alternatives

Not every process needs an agent. Sometimes these are preferable:

- A macro or Power Query for a deterministic process.
- Power Automate or a workflow tool.
- A script with checks.
- A manual prompt template.
- A scheduled task that produces a draft. See [how to schedule AI tasks](/en/blog/scheduled-ai-tasks-finance/).

For a comparison of work environments, see [ChatGPT, Claude or Gemini for finance professionals](/en/blog/chatgpt-claude-gemini-finance/).

## Frequently asked questions

### Is a Skill just a saved prompt?

It sometimes starts that way, but can include files, examples, templates, code and dependencies. Its main value is a consistent, tested process.

### Can an agent handle month-end close alone?

It can help with defined parts. A full close involves sources, exceptions, approvals and judgment, so it is not a “set and forget” task.

### Which process should we start with?

Choose a frequent, rules-based, low-risk process whose result can be checked quickly.

## Sources and verification date

Information checked on August 4, 2026:

- [Anthropic — How to create custom skills](https://support.claude.com/en/articles/12512198-how-to-create-custom-skills)
- [Anthropic — Use skills in Claude](https://support.claude.com/en/articles/12512180-use-skills-in-claude)
- [Anthropic — Use plugins in Claude](https://support.claude.com/en/articles/13837440-use-plugins-in-claude)
- [Anthropic — Claude for Small Business](https://www.anthropic.com/news/claude-for-small-business)

## Want to turn a financial SOP into a Skill?

In AI Finance workshops, we choose a process, document it, build checks and define approval points before connecting it to systems. [Learn about AI workshops for finance teams](/en/services/ai-workshops-for-finance/).

## About the author

**Roei Wallenstein** is an AI Finance co-founder and community manager. His work connects financial processes with AI tools, evaluates technology solutions and turns general use cases into practical workflows. [Roei's LinkedIn profile](https://il.linkedin.com/in/roei-wallenstein).
