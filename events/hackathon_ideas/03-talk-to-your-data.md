# 03 · Talk to Your Data 🟢

> Ask questions in plain English, get correct answers from a real dataset, and know when *not* to answer.

**Great for:** Data analysts, analytics engineers, newcomers to AI

## 🌍 Why now

Conversational analytics is everywhere in 2026. Most data platforms now offer some form of "ask your data". The difference between a toy and something people trust is **guardrails**: a semantic layer that defines metrics properly, SQL that gets validated before it runs, and an assistant that says "I don't know" instead of making things up.

## 🎯 The challenge

Build a natural-language Q&A tool over a dataset loaded into DuckDB. Users type a question; the tool generates SQL, checks it, runs it and returns an answer (and ideally a chart).

The twist: build a **mini semantic layer**, a small YAML or Markdown file that defines tables, columns and key metrics (e.g. "average price means the median of `price` excluding new builds"). Show that it makes answers more accurate.

## 📦 Suggested data

- [HM Land Registry Price Paid Data](https://www.gov.uk/government/statistical-data-sets/price-paid-data-downloads)
- [TfL open data](https://tfl.gov.uk/info-for/open-data-users/our-open-data), e.g. cycle hire journeys
- [NYC Taxi trip data (Parquet)](https://www.nyc.gov/site/tlc/about/tlc-trip-record-data.page), a classic for DuckDB
- [ONS datasets](https://www.ons.gov.uk/datasets)

## 🛠️ Suggested stack

- [DuckDB](https://duckdb.org/) (reads CSV/Parquet directly)
- A simple UI: [Streamlit](https://streamlit.io/), [Gradio](https://www.gradio.app/) or just a notebook
- Any LLM provider, or a local model good at code
- `sqlglot` or DuckDB's `EXPLAIN` for validating generated SQL

## 🪜 Milestones

**MVP (~90 min)**
1. Load the dataset into DuckDB.
2. Prompt an LLM with the schema plus a question → SQL → run → answer.
3. Write 10 test questions with known answers and check how many it gets right.

**Stretch**
- Add the semantic layer and re-run your 10 questions. Did the score go up?
- Guardrails: read-only queries only, row limits, refuse questions the data can't answer.
- Auto-generate a chart for each answer.

**If you finish early**
- Show the SQL alongside each answer so users can verify it.
- Add a "follow-up question" mode that keeps context.

## 🎤 Demo checklist

- Ask a question from the audience live! 😬
- Show a question it correctly refuses.
- Share your before/after accuracy on the test questions.
