const express = require("express");
const path = require("node:path");
const { DatabaseSync } = require("node:sqlite");

const app = express();
const PORT = process.env.PORT || 3000;

const DB_PATH = path.join(__dirname, "db", "claims.db");
const db = new DatabaseSync(DB_PATH, { readOnly: true });

const lookupClaim = db.prepare("SELECT * FROM claims WHERE claim_id = ?");

app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

app.get("/claims/:claimId", (req, res) => {
  const { claimId } = req.params;
  const claim = lookupClaim.get(claimId);

  if (!claim) {
    return res.status(404).json({
      error: "Claim not found",
      claimId,
    });
  }

  res.status(200).json(claim);
});

app.listen(PORT, () => {
  console.log(`Northwind Mutual claims service listening on port ${PORT}`);
});