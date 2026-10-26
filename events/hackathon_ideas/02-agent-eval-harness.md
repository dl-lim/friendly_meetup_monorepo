# 02 · Judge the Agent: Build an Eval Harness 🟡

> Vibes aren't a metric. Build a scorecard that tells you whether an AI assistant is actually any good.

**Great for:** ML/AI engineers, data scientists, QA-minded engineers

## 🌍 Why now

In 2026, agents are moving from demos into production, and the hard question is no longer "can it do it?" but "how often does it get it right, and how do we know?" Teams are combining **deterministic checks** with **LLM-as-judge** scoring and **tracing** (often via OpenTelemetry) to keep agents honest.

## 🎯 The challenge

Pick (or quickly build) a small LLM-powered assistant, e.g. a FAQ bot over a document, a SQL helper or a recipe planner. Then build an evaluation harness that:

1. Runs it against a test set of 20–30 cases.
2. Scores each answer with a mix of rule-based checks and an LLM judge using a clear rubric.
3. Produces a scorecard: pass rate, failure categories, cost and latency.

Then make **one change** (prompt, model, retrieval) and show whether it improved the scores.

## 📦 Suggested data

- A public document to build a Q&A bot on: e.g. the [Highway Code](https://www.gov.uk/guidance/the-highway-code), a council policy PDF, or an open-source project's docs
- Public eval datasets on [Hugging Face](https://huggingface.co/datasets) for inspiration
- Hand-written test cases, including tricky and adversarial ones (great for a team brainstorm!)

## 🛠️ Suggested stack

- Eval frameworks (pick one or roll your own): [promptfoo](https://www.promptfoo.dev/), [DeepEval](https://github.com/confident-ai/deepeval), [Inspect](https://inspect.aisi.org.uk/) (from the UK AI Security Institute)
- Tracing: [Langfuse](https://langfuse.com/) or [Arize Phoenix](https://github.com/Arize-ai/phoenix) (both self-hostable with Docker), or plain OpenTelemetry
- Any LLM provider or a local model; try using a *different* model as the judge

## 🪜 Milestones

**MVP (~90 min)**
1. A working assistant (keep it tiny!).
2. A test set in a CSV/JSONL with inputs and expected behaviour.
3. A script that runs all cases and scores them with at least one deterministic check and one LLM-judge rubric.
4. A summary table of results.

**Stretch**
- Add tracing so you can click into any failure and see what happened.
- Measure judge reliability: hand-label 10 cases and compare with the judge's scores.
- Compare two models on quality vs cost vs latency.

**If you finish early**
- Red-team it: add prompt-injection and off-topic cases and see what breaks.

## 🎤 Demo checklist

- Show the scorecard before and after your change.
- Walk through one interesting failure.
- Tell us whether you trust your judge, and why.
