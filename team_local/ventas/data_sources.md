---
ministro: ventas
dominio: ventas
updated: 2026-04-25
status: draft
---

# Data sources — ministro ventas auto-crm

Declaracion de que lee `retrieve_data()` para formar evidencia. Por
ahora retorna lista vacia (TODO). Roadmap de conexion a continuacion.

```yaml
data_sources:
  primary:
    - name: turso_crm
      kind: database
      driver: libsql
      env_var: TURSO_DATABASE_URL
      status: pending
      tables:
        - leads
        - deals
        - contacts
        - activities
      notes: "Schema canonico de auto-crm. Pipeline principal."
  fallback:
    - name: csv_export
      kind: file
      path: data/pipeline_export.csv
      status: available
      notes: "Export manual cuando Turso no este accesible."
  external:
    - name: hubspot_sync
      kind: api
      env_var: HUBSPOT_API_KEY
      status: deferred
      notes: "Solo si Francisco mueve inbound a HubSpot oficial."
kpis_observados:
  - name: pipeline_velocity_days
    formula: avg(days(closed_at - created_at))
    fuente: turso_crm.deals
  - name: icp_fit_rate
    formula: count(lifecycle_stage >= SQL) / count(lifecycle_stage >= MQL)
    fuente: turso_crm.leads
  - name: response_time_p50_min
    formula: median(first_contact_at - lead_created_at)
    fuente: turso_crm.activities
  - name: cac_inbound_vs_outbound
    formula: spend / new_customers by lead_source
    fuente: turso_crm.deals + marketing_spend
```
