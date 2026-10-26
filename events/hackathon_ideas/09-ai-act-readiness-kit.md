# 09 · AI Act Readiness Kit 🟢

> Describe an AI system in plain English and get back a model card plus a first-pass EU AI Act risk assessment.

**Great for:** Product managers, analysts, governance folk, newcomers. Low-code friendly!

## 🌍 Why now

The EU AI Act's obligations are phasing in through 2026 and beyond (some high-risk rules may be delayed by proposed amendments, so check the latest timeline). Teams building or buying AI need to know which risk category a system falls into and what documentation they need. For most organisations, including UK ones selling into the EU, this is a very real, very current headache.

## 🎯 The challenge

Build a tool that takes a short description of an AI system (what it does, who uses it, what data it uses) and produces:

1. A **risk tier assessment** (prohibited / high-risk / limited-risk transparency obligations / minimal) with reasoning that cites the relevant parts of the Act.
2. A draft **model card** or system documentation.
3. A **checklist** of next steps for the team.

Test it on a handful of example systems and see if humans in the room agree with its classifications.

> ⚠️ This is a learning exercise, not legal advice. Make sure your tool says so too!

## 📦 Suggested data

- The [EU AI Act text](https://eur-lex.europa.eu/eli/reg/2024/1689/oj) (especially Article 5, Article 6, Annex III and Article 50)
- The [EU AI Act Explorer and Compliance Checker](https://artificialintelligenceact.eu/) for reference
- [Hugging Face model card guidance](https://huggingface.co/docs/hub/model-cards)
- 10 example AI systems you write yourselves, e.g. CV-screening tool, chatbot for a bank, spam filter, emotion detection at work, credit scoring model

## 🛠️ Suggested stack

- No-/low-code: a well-crafted prompt plus the Act's key articles pasted in as context, in any chat assistant or notebook
- Code: retrieval over the Act's text (chunk by article) with any LLM provider or a local model; Streamlit or Gradio UI
- Output templates in Markdown

## 🪜 Milestones

**MVP (~90 min)**
1. Write 10 example system descriptions and agree on the "correct" tier as a team.
2. Build the prompt/pipeline that classifies a system and explains why, citing articles.
3. Run all 10 and compare with your team's answers.
4. Generate a model card for at least one.

**Stretch**
- Retrieval over the Act so citations are accurate and quoted, not guessed.
- Ask clarifying questions when the description is ambiguous, instead of guessing.
- Compare UK guidance (principles-based approach) with the EU rules for the same system.

**If you finish early**
- Export a nicely formatted PDF "readiness report".

## 🎤 Demo checklist

- Classify a system suggested by the audience live.
- Show your accuracy against the team's answers.
- Tell us the case where the humans disagreed with each other. 😉
