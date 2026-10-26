# 05 · Pocket Lakehouse 🔴

> Build a mini open lakehouse on your laptop, complete with time travel and an AI-written data catalogue.

**Great for:** Data engineers, platform engineers

## 🌍 Why now

Lakehouse consolidation on **open table formats** (Apache Iceberg, Delta Lake) is one of the defining data engineering trends of 2026, along with lightweight engines like DuckDB and **active metadata** catalogues that actually describe the data. You don't need a cloud account to learn how it all fits together.

## 🎯 The challenge

Build a local lakehouse that:

1. Ingests a dataset into **Iceberg tables** (with a local catalogue).
2. Appends new data over a few "days" so the tables have multiple snapshots.
3. Queries the tables with DuckDB, including **time travel** ("what did this table look like before the last load?").
4. Uses an LLM to generate a **catalogue page** for each table: description, column docs, example queries and likely data quality concerns.

## 📦 Suggested data

Anything that arrives in batches works well:
- [TfL cycle hire journey data](https://cycling.data.tfl.gov.uk/), released weekly
- [NYC Taxi trip data (Parquet)](https://www.nyc.gov/site/tlc/about/tlc-trip-record-data.page), monthly files
- [Land Registry Price Paid](https://www.gov.uk/government/statistical-data-sets/price-paid-data-downloads), monthly updates

## 🛠️ Suggested stack

- [PyIceberg](https://py.iceberg.apache.org/) with a SQL catalogue (SQLite) on local disk, or [MinIO](https://min.io/) + a REST catalogue via `docker compose` if you're feeling brave
- [DuckDB](https://duckdb.org/) with the `iceberg` extension
- Any LLM provider or a local model for catalogue generation
- Optional: [Delta Lake](https://delta-io.github.io/delta-rs/) via `delta-rs` if your team prefers it

## 🪜 Milestones

**MVP (~90 min)**
1. Create an Iceberg table and load the first batch.
2. Append two more batches (at least three snapshots).
3. Query the latest data and a previous snapshot from DuckDB.
4. Generate a Markdown catalogue page for the table with an LLM.

**Stretch**
- Schema evolution: add a column in a later batch and show old snapshots still work.
- Feed table statistics and snapshot history to the LLM so the catalogue mentions freshness and volume trends.
- Partition the table and compare query performance.

**If you finish early**
- Ask questions about the catalogue itself ("which tables have postcode data?").
- Show the whole thing starting from scratch with a single `docker compose up`.

## 🎤 Demo checklist

- Show the snapshot history and a time-travel query.
- Show the generated catalogue page.
- Tell us what surprised you about how Iceberg stores data on disk.
