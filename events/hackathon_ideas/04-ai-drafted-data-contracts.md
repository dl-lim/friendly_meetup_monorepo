# 04 · AI-Drafted Data Contracts 🟡

> Let an LLM draft the rules your data should follow, then break the data and watch the rules catch it.

**Great for:** Data engineers, analytics engineers, data quality fans

## 🌍 Why now

"Shift-left" data quality is a major 2026 theme: catch problems where data is produced, not three dashboards later. **Data contracts** (explicit, versioned agreements on schema, semantics and quality) are how teams do it. Writing them by hand is tedious, and that's a perfect job for an LLM with a human reviewer.

## 🎯 The challenge

Take a messy real-world dataset and build a pipeline that:

1. **Profiles** the data (types, nulls, ranges, distinct values, patterns).
2. Asks an LLM to **draft a data contract** from the profile plus any documentation, e.g. in the [Open Data Contract Standard (ODCS)](https://bitol-io.github.io/open-data-contract-standard/) format.
3. **Turns the contract into executable checks.**
4. Runs the checks against a deliberately **corrupted** copy of the data and reports what was caught.

## 📦 Suggested data

- [Food Standards Agency hygiene ratings](https://api.ratings.food.gov.uk/): lots of real-world messiness
- [data.police.uk](https://data.police.uk/data/) street-level crime CSVs
- [UK Companies House basic company data](https://download.companieshouse.gov.uk/en_output.html)
- Any open CSV from [data.gov.uk](https://www.data.gov.uk/)

## 🛠️ Suggested stack

- Profiling: [ydata-profiling](https://github.com/ydataai/ydata-profiling), DuckDB `SUMMARIZE`, or Polars
- Checks: [Pandera](https://pandera.readthedocs.io/), [Great Expectations](https://greatexpectations.io/), [Soda Core](https://github.com/sodadata/soda-core), or plain SQL assertions
- Any LLM provider or a local model, with structured (JSON/YAML) output

## 🪜 Milestones

**MVP (~90 min)**
1. Profile the dataset and feed the summary to an LLM.
2. Get back a contract (YAML) with at least schema, nullability, allowed values and ranges.
3. Convert it to checks and run them on the clean data (they should pass!).
4. Write a small "chaos" script that injects 5 types of bad data, and show the checks catching them.

**Stretch**
- Score the contract: how many of your injected faults were caught? Which slipped through?
- Add semantic rules the LLM inferred (e.g. "inspection date can't be in the future").
- Detect breaking changes between two versions of a contract.

**If you finish early**
- Add a human-review step: show the drafted contract with the LLM's reasoning for each rule, and accept or reject each.

## 🎤 Demo checklist

- Show the generated contract.
- Run the chaos script live and show the failures being caught.
- Tell us one rule the LLM got wrong (there will be one!).
