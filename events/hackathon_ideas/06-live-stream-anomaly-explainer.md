# 06 · Live Stream Anomaly Explainer 🔴

> Watch Wikipedia change in real time, spot when something unusual is happening, and have AI explain why.

**Great for:** Data engineers, data scientists, real-time enthusiasts

## 🌍 Why now

Streaming-first architectures continue to replace batch in 2026, and the next step is pairing real-time detection with AI that can **explain** what's happening in plain English rather than just firing an alert.

## 🎯 The challenge

Consume a live public event stream, compute rolling metrics, detect anomalies (e.g. an edit spike on a particular article or topic), and when one fires, have an LLM produce a short human-readable explanation using the events that caused it.

Breaking news, sporting events and viral moments all show up as Wikipedia edit spikes, so you'll almost certainly catch something during the evening!

## 📦 Suggested data

- [Wikimedia EventStreams](https://stream.wikimedia.org/v2/stream/recentchange): every edit across Wikimedia projects, as Server-Sent Events (no key needed)
- Alternatives: [Bluesky Jetstream](https://github.com/bluesky-social/jetstream) (public firehose), or the [TfL arrivals API](https://api.tfl.gov.uk/) polled every few seconds

## 🛠️ Suggested stack

- Python with an SSE client (`httpx-sse`, `sseclient-py`) or Node
- Rolling windows: plain Python, [Polars](https://pola.rs/), or [Bytewax](https://bytewax.io/) / [Quix Streams](https://github.com/quixio/quix-streams) for a "proper" stream processor
- Optional broker: [Redpanda](https://www.redpanda.com/) or Kafka via `docker compose`
- Detection: z-scores over rolling windows, EWMA, or [River](https://riverml.xyz/) for online ML
- Any LLM provider or a local model for explanations
- Live dashboard: Streamlit or a simple web page

## 🪜 Milestones

**MVP (~90 min)**
1. Consume the stream and filter to something focused (e.g. English Wikipedia, article namespace).
2. Compute edits per article per minute over a rolling window.
3. Flag anomalies with a simple statistical rule.
4. On each anomaly, send the article title, recent edit summaries and the stats to an LLM and print an explanation.

**Stretch**
- Group related articles into topics so you catch "a football match is happening", not just one page.
- Rate-limit and de-duplicate alerts so the LLM isn't called on every blip.
- Push it through a broker so detection and explanation are separate services.

**If you finish early**
- Live dashboard with a ticker of explained anomalies.
- Spot bot edits vs human edits and see how it changes your anomalies.

## 🎤 Demo checklist

- Show it running live during the demo.
- Show the best (and funniest) anomaly explanation you caught tonight.
- Tell us how you tuned the threshold to avoid alert spam.
