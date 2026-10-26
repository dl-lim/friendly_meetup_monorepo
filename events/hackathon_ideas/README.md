# 💡 Hackathon Ideas: Data & AI (Late 2026)

A pack of ready-to-go challenge briefs for a Friendly Data Meetup hackathon evening. Each one is designed to be **completable in 2–3 hours** by a small team (2–4 people) with mixed experience.

Pick one, remix one, or use them as inspiration for your own idea. All of them are welcome!

## 🧭 What's hot right now (and why these ideas)

We looked at what the data and AI world has been talking about through 2026 and picked themes that are both current *and* buildable in an evening:

| Theme | What's happening |
|---|---|
| **MCP as the standard tool layer** | The Model Context Protocol is now governed by the Linux Foundation's Agentic AI Foundation and supported across the major AI platforms. It's become the default way to plug data and tools into agents. |
| **Agent evaluation & observability** | Agents are moving from demos to production. Teams now care about scorecards, LLM-as-judge plus deterministic checks, and tracing (OpenTelemetry). |
| **Conversational analytics** | Natural-language questions over warehouses, backed by semantic layers so answers are actually correct. |
| **Data contracts & shift-left quality** | Catching bad data at the source with explicit, versioned agreements between producers and consumers. |
| **Open lakehouse** | Open table formats (Iceberg, Delta) queried by lightweight engines like DuckDB, with "active" metadata catalogues. |
| **Streaming-first** | Real-time pipelines over batch, with AI used to interpret events as they happen. |
| **Small & local models** | Open-weight models small enough to run on a laptop are good enough for lots of structured tasks, privately and cheaply. |
| **Responsible AI & regulation** | The EU AI Act's obligations are phasing in through 2026, and synthetic data is increasingly used to protect privacy. |

Sources: [Joe Reis: Where data engineering is heading](https://joereis.substack.com/p/where-data-engineering-is-heading) · [Kanerika: Data engineering trends](https://kanerika.com/blogs/data-engineering-trends/) · [FutureAGI: Evaluating MCP-connected agents](https://futureagi.com/blog/evaluate-mcp-connected-ai-agents-production/) · [StudioMeyer: AI trends 2026 mid-year](https://studiomeyer.io/en/blog/ai-trends-2026-mid-year) · [AI Agent Rank: State of agentic AI, May 2026](https://aiagentrank.io/blog/state-of-agentic-ai-may-2026)

## 📋 The ideas

**Difficulty:** 🟢 Beginner-friendly · 🟡 Intermediate · 🔴 Advanced

| # | Idea | Difficulty | Great for |
|---|---|---|---|
| 01 | [MCP Server for Open Data](01-mcp-server-for-open-data.md) | 🟡 | AI engineers, software engineers |
| 02 | [Judge the Agent: Build an Eval Harness](02-agent-eval-harness/) 🧰 starter project | 🟡 | ML/AI engineers, data scientists |
| 03 | [Talk to Your Data](03-talk-to-your-data.md) | 🟢 | Analysts, analytics engineers |
| 04 | [AI-Drafted Data Contracts](04-ai-drafted-data-contracts.md) | 🟡 | Data engineers, analytics engineers |
| 05 | [Pocket Lakehouse](05-pocket-lakehouse.md) | 🔴 | Data engineers, platform engineers |
| 06 | [Live Stream Anomaly Explainer](06-live-stream-anomaly-explainer.md) | 🔴 | Data engineers, data scientists |
| 07 | [Small Model, Big Extraction](07-small-model-big-extraction.md) | 🟢 | Anyone curious about local AI |
| 08 | [Synthetic Twin](08-synthetic-twin.md) | 🟡 | Data scientists, quant modellers |
| 09 | [AI Act Readiness Kit](09-ai-act-readiness-kit.md) | 🟢 | Product managers, analysts, newcomers |

## ⏱️ Suggested evening programme (3 hours)

| Time | What |
|---|---|
| 0:00 – 0:15 | Welcome, intros, pitch the ideas, form teams |
| 0:15 – 0:30 | Teams pick an idea, set up environments, agree on an MVP |
| 0:30 – 2:00 | Build the MVP (each brief has a ~90-minute MVP) |
| 2:00 – 2:30 | Stretch goals, polish, prepare the demo |
| 2:30 – 3:00 | 3-minute demos per team, voting, celebrate 🎉 |

## 🏆 Judging criteria

1. **It works:** a live demo beats a perfect slide.
2. **Use of data:** real (or realistically messy) data, used thoughtfully.
3. **Creativity:** a fresh angle, a fun twist, an unexpected dataset.
4. **Clarity:** can the room understand what you built and why it matters in 3 minutes?
5. **Teamwork & learning:** bonus love for teams who tried something new to them.

## 🛠️ General tips

- **Bring your own LLM:** every brief works with any provider (OpenAI, Google, Mistral, etc.) *or* a local open-weight model via [Ollama](https://ollama.com/) or [llama.cpp](https://github.com/ggml-org/llama.cpp). Free tiers and local models are absolutely fine.
- **Keep set-up light:** use Docker (`docker compose`) or [`uv`](https://docs.astral.sh/uv/) for Python so nobody loses an hour to environment issues.
- **Scope ruthlessly:** get the MVP working end to end first, then add stretch goals.
- **Mind the data:** stick to open data or synthetic data. No personal or work-confidential data, please!
