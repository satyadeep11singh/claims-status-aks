# Changelog

## Attempt 1 (tagged `attempt-1`)
Initial build: Node.js claims-status API, SQLite, Docker, AKS deployment,
Azure DevOps Build + Release Pipelines, Azure Managed Prometheus + Grafana
for monitoring. Fully manual `kubectl`/`az` workflow, single environment,
no automated testing or security scanning.

## Attempt 2 (in progress)
Maturing the same pipeline rather than starting over:
- Simple claim-lookup UI (served by the existing Express app)
- Separate backend and frontend test suites, each gating the Build Pipeline
- Trivy vulnerability scanning of the Docker image
- Self-hosted SonarQube code quality analysis
- Self-managed Prometheus (Helm, in-cluster) replacing Azure Managed Prometheus
- Grafana Cloud (free, persistent, off-Azure) replacing Azure Managed Grafana —
  chosen specifically so dashboards survive cluster teardown and can be reused
  across future BootAzure projects
- Dev → Staging namespaces with a manual approval gate in the Release Pipeline
- Resource tagging for cost tracking

See README.md for full architecture details once attempt 2 is complete.