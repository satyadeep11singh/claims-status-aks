const express = require("express");
const path = require("node:path");
const { DatabaseSync } = require("node:sqlite");
const client = require("prom-client");

const app = express();
const PORT = process.env.PORT || 3000;

const DB_PATH = path.join(__dirname, "db", "claims.db");
const db = new DatabaseSync(DB_PATH, { readOnly: true });

const lookupClaim = db.prepare("SELECT * FROM claims WHERE claim_id = ?");

// --- Prometheus metrics setup ---
const registry = new client.Registry();
client.collectDefaultMetrics({ register: registry });

const claimLookupsTotal = new client.Counter({
  name: "claim_lookups_total",
  help: "Total number of claim lookup requests, labeled by outcome status",
  labelNames: ["status"],
  registers: [registry],
});

const claimLookupDuration = new client.Histogram({
  name: "claim_lookup_duration_seconds",
  help: "Duration of claim lookup requests in seconds",
  buckets: [0.001, 0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1],
  registers: [registry],
});

app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

app.get("/metrics", async (req, res) => {
  res.set("Content-Type", registry.contentType);
  res.end(await registry.metrics());
});

app.get("/claims/:claimId", (req, res) => {
  const endTimer = claimLookupDuration.startTimer();
  const { claimId } = req.params;
  const claim = lookupClaim.get(claimId);

  if (!claim) {
    claimLookupsTotal.inc({ status: "not_found" });
    endTimer();
    return res.status(404).json({
      error: "Claim not found",
      claimId,
    });
  }

  claimLookupsTotal.inc({ status: claim.status });
  endTimer();
  res.status(200).json(claim);
});

app.listen(PORT, () => {
  console.log(`Northwind Mutual claims service listening on port ${PORT}`);
});