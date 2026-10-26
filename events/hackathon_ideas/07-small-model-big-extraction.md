# 07 · Small Model, Big Extraction 🟢

> Can a model running on your laptop pull clean, structured data out of messy documents as well as a big hosted model?

**Great for:** Anyone curious about local AI; analysts, data scientists, engineers

## 🌍 Why now

Small open-weight models have improved enormously and now run comfortably on a laptop. For lots of everyday data tasks, like turning messy text into structured records, they're private, free to run and often good enough. 2026's question isn't "can they do it?" but "**where's the trade-off** between local and hosted?"

## 🎯 The challenge

Pick a pile of messy documents, define a target schema, and extract structured records using:
1. A **small local model** (e.g. 1–8B parameters), and
2. A **larger hosted model** of your choice.

Compare them head-to-head on **accuracy, speed and cost**, and present your verdict.

## 📦 Suggested data

- Receipts: [CORD](https://huggingface.co/datasets/naver-clova-ix/cord-v2) or [SROIE](https://huggingface.co/datasets?search=sroie) on Hugging Face (with ground truth!)
- Job adverts: scrape a handful, or use a Kaggle job postings dataset, and extract title, salary, location, remote/hybrid, skills
- UK council meeting minutes or planning applications (PDFs) → extract decisions, addresses and dates
- Your own: everyone writes 5 fake "messy" emails to extract data from 😄

## 🛠️ Suggested stack

- Local: [Ollama](https://ollama.com/) or [llama.cpp](https://github.com/ggml-org/llama.cpp) (both run happily in Docker), with small models from families like Qwen, Llama, Gemma, Phi or Mistral
- Hosted: any provider you have access to
- Structured output: [Pydantic](https://docs.pydantic.dev/) schemas with [Instructor](https://python.useinstructor.com/) or [Outlines](https://github.com/dottxt-ai/outlines), or each provider's JSON mode
- PDFs: `pypdf`, [Docling](https://github.com/docling-project/docling) or [MarkItDown](https://github.com/microsoft/markitdown)

## 🪜 Milestones

**MVP (~90 min)**
1. Define a Pydantic schema for the record you want.
2. Run extraction on 20–30 documents with a local model.
3. Run the same with a hosted model.
4. Score both against ground truth (or hand-labelled answers) field by field.

**Stretch**
- Try 2–3 local model sizes and plot accuracy vs speed.
- Prompt tricks: few-shot examples, field descriptions, and see how much they help the small model.
- A "cascade": use the small model first, and only escalate to the big one when confidence is low.

**If you finish early**
- Estimate cost per 10,000 documents for each approach.

## 🎤 Demo checklist

- Show one document going in and a clean record coming out.
- Show your comparison table (accuracy / speed / cost).
- Give your verdict: when would you use local vs hosted?
