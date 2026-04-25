# Data sources — producto

> Configuracion YAML-ish de fuentes de data para este ministro.
> Parser: `fbrain_soie.source_loader.load_yaml_config`.

## Fuentes activas

```yaml
sources:
  - name: placeholder
    kind: csv
    path: data/producto-placeholder.csv
    enabled: false
    notes: |
      STUB generado por `fbrain-soie init`. Conectar fuentes reales
      (Turso, Postgres, CSV, APIs) en iteracion posterior. Mientras
      no haya fuentes, `retrieve_data` retorna [] y el ministro
      degrada a reasoning con solo `sources/` textuales.
```

## KPIs del dominio (a definir)

- kpi_1: <definir>
- kpi_2: <definir>

## Queries tipicas

- <que preguntas debe poder responder este ministro?>
