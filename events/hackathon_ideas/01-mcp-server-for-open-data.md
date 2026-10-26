# 01 · MCP Server for Open Data 🟡

> Turn a UK open dataset into a tool any AI agent can use.

**Great for:** AI engineers, software engineers, data engineers

## 🌍 Why now

The Model Context Protocol (MCP) has become the standard way to connect agents to tools and data. It's now governed by the Linux Foundation's Agentic AI Foundation and supported by the major AI platforms. If you can write an MCP server, you can make your data usable by almost any agent.

## 🎯 The challenge

Build an MCP server that exposes a public dataset or API through a small set of well-designed **tools** (and optionally **resources**). Then connect it to an agent and show it answering real questions that it couldn't answer before.

Example questions to aim for:
- "Which Tube lines have disruptions right now, and what's the best alternative from King's Cross to Waterloo?"
- "Which London boroughs had the biggest rise in average house prices last year?"
- "Find restaurants near E1 with a food hygiene rating below 3."

## 📦 Suggested data

- [TfL Unified API](https://api.tfl.gov.uk/): line status, arrivals, journey planner (free key)
- [HM Land Registry Price Paid Data](https://www.gov.uk/government/statistical-data-sets/price-paid-data-downloads): CSV, load into DuckDB
- [Food Standards Agency hygiene ratings API](https://api.ratings.food.gov.uk/)
- [data.police.uk API](https://data.police.uk/docs/): street-level crime
- [ONS API](https://developer.ons.gov.uk/)

## 🛠️ Suggested stack

- An MCP SDK: official [Python](https://github.com/modelcontextprotocol/python-sdk) or [TypeScript](https://github.com/modelcontextprotocol/typescript-sdk) SDK
- [MCP Inspector](https://github.com/modelcontextprotocol/inspector) for testing your tools without an agent
- Any MCP-capable client or agent framework, with a hosted model or a local one
- DuckDB if you're serving a CSV/Parquet dataset

## 🪜 Milestones

**MVP (~90 min)**
1. One or two tools with clear names, descriptions and typed inputs (e.g. `get_line_status`, `search_prices(borough, year)`).
2. Test them in MCP Inspector.
3. Connect an agent and answer at least one multi-step question.

**Stretch**
- Add a resource (e.g. dataset schema or data dictionary) so the agent understands the data.
- Add input validation and friendly error messages the agent can recover from.
- Combine two datasets in one server (e.g. crime + house prices by postcode).

**If you finish early**
- Write three "tool description" variants and see which one the agent uses most reliably.
- Package it in a `compose.yaml` so others can run it with one command.

## 🎤 Demo checklist

- Show the tool list in the Inspector.
- Ask the agent a question live and show the tool calls it made.
- Tell us one thing you learnt about designing tools for agents.
