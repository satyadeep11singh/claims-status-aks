const { DatabaseSync } = require("node:sqlite");
const path = require("node:path");

const DB_PATH = path.join(__dirname, "claims.db");
const db = new DatabaseSync(DB_PATH);

db.exec(`
  DROP TABLE IF EXISTS claims;

  CREATE TABLE claims (
    claim_id              TEXT PRIMARY KEY,
    claim_type            TEXT NOT NULL CHECK (claim_type IN ('auto', 'home')),
    status                TEXT NOT NULL CHECK (status IN ('submitted', 'under_review', 'approved', 'paid', 'denied')),
    date_filed            TEXT NOT NULL,
    claimant_name         TEXT NOT NULL,
    incident_description  TEXT NOT NULL,
    last_updated           TEXT NOT NULL
  );
`);

const claims = [
  ["CLM-2026-00101", "auto", "paid",          "2026-01-12", "Jordan Smith",    "Rear-end collision on Hwy 401",                 "2026-02-03"],
  ["CLM-2026-00102", "home", "approved",      "2026-01-20", "Priya Nair",      "Water damage from burst pipe in basement",       "2026-02-10"],
  ["CLM-2026-00103", "auto", "under_review",  "2026-02-01", "Marcus Chen",     "Side-impact collision in parking garage",        "2026-02-15"],
  ["CLM-2026-00104", "home", "denied",        "2026-02-04", "Aisha Bello",     "Roof damage claimed from prior storm season",    "2026-02-20"],
  ["CLM-2026-00105", "auto", "submitted",     "2026-03-01", "Liam O'Connor",   "Windshield cracked by road debris",              "2026-03-01"],
  ["CLM-2026-00106", "home", "paid",          "2026-01-28", "Sofia Rodriguez", "Kitchen fire, smoke damage to adjoining rooms",  "2026-02-25"],
  ["CLM-2026-00107", "auto", "approved",      "2026-02-10", "Noah Williams",   "Vehicle stolen from driveway overnight",         "2026-03-02"],
  ["CLM-2026-00108", "home", "under_review",  "2026-02-18", "Emma Tremblay",   "Hail damage to siding and eavestroughs",         "2026-03-04"],
  ["CLM-2026-00109", "auto", "submitted",     "2026-03-05", "Carlos Mendes",   "Hit and run, rear bumper damage",                "2026-03-05"],
  ["CLM-2026-00110", "home", "approved",      "2026-02-22", "Grace Kim",       "Tree fell on garage during windstorm",           "2026-03-08"],
  ["CLM-2026-00111", "auto", "denied",        "2026-01-15", "Daniel Osei",     "Claim filed for pre-existing transmission issue","2026-02-01"],
  ["CLM-2026-00112", "home", "submitted",     "2026-03-10", "Hannah Petrov",   "Basement flooding after sump pump failure",      "2026-03-10"],
  ["CLM-2026-00113", "auto", "paid",          "2026-01-30", "Ethan Brooks",    "Collision with deer on rural highway",           "2026-02-22"],
  ["CLM-2026-00114", "home", "under_review",  "2026-03-02", "Olivia Tanaka",   "Theft of patio furniture and bicycles",          "2026-03-12"],
];

const insert = db.prepare(`
  INSERT INTO claims (claim_id, claim_type, status, date_filed, claimant_name, incident_description, last_updated)
  VALUES (?, ?, ?, ?, ?, ?, ?)
`);

for (const claim of claims) {
  insert.run(...claim);
}

console.log(`Seeded ${claims.length} claims into ${DB_PATH}`);

db.close();