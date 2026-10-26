# 08 · Synthetic Twin 🟡

> Create a fake dataset that's useful like the real one, but leaks nothing about real people. Then prove it.

**Great for:** Data scientists, quant and financial modellers, privacy-minded engineers

## 🌍 Why now

Synthetic data is increasingly used to share, test and train on data that would otherwise be locked away for privacy reasons, especially as AI regulation and data protection scrutiny tighten. But synthetic doesn't automatically mean safe *or* useful. You have to measure both.

## 🎯 The challenge

Take a "sensitive-looking" open dataset and generate a synthetic twin. Then evaluate it on two axes:

1. **Fidelity / utility:** do distributions and correlations match? Does a model trained on synthetic data perform well on real data?
2. **Privacy:** could someone re-identify real rows? How close are synthetic rows to real ones?

Find the sweet spot, and present the trade-off.

## 📦 Suggested data

- [UCI Adult (Census Income)](https://archive.ics.uci.edu/dataset/2/adult): the classic
- [UCI Default of Credit Card Clients](https://archive.ics.uci.edu/dataset/350/default+of+credit+card+clients): nice for the finance folk
- [Kaggle insurance charges dataset](https://www.kaggle.com/datasets/mirichoi0218/insurance)
- Any tabular dataset with demographic-style columns

## 🛠️ Suggested stack

- Generators: [SDV (Synthetic Data Vault)](https://sdv.dev/) (Gaussian copula, CTGAN), [synthcity](https://github.com/vanderschaarlab/synthcity), or simply an LLM prompted to generate rows (a fun baseline to compare!)
- Evaluation: SDV's quality reports, scikit-learn for train-on-synthetic / test-on-real (TSTR), distance-to-closest-record for privacy
- pandas / Polars, plus matplotlib or Plotly for comparison charts

## 🪜 Milestones

**MVP (~90 min)**
1. Train one synthesiser and generate a synthetic dataset of the same size.
2. Compare distributions of 3–4 key columns (charts!).
3. TSTR: train a classifier on synthetic, test on real; compare with train-on-real.
4. Compute distance-to-closest-record to check for near-copies.

**Stretch**
- Compare 2–3 generators (including an LLM-based one) on a single fidelity vs privacy chart.
- Run a simple membership inference attack: can you tell whether a real row was in the training set?
- Add differential privacy and show how it shifts the trade-off.

**If you finish early**
- Check fairness: does the synthetic data preserve or distort relationships for minority groups?

## 🎤 Demo checklist

- Show real vs synthetic distributions side by side.
- Show your utility and privacy numbers.
- Tell us: would you be comfortable sharing your synthetic dataset publicly? Why or why not?
