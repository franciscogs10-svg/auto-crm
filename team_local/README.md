# team_local/

Aqui viven los ministros locales de esta ciudad-estado.

Estructura sugerida:

    team_local/
    <dominio>/
        constitution.md       # identidad + dominio + fuentes
        agent.py              # subclase de fbrain_soie.BaseMember
        sources/              # .md con principios de dominio
        dashboard/            # persistido por save_dashboard()

Ejemplo minimo:

```python
# team_local/ventas/agent.py
from fbrain_soie import BaseMember

class VentasLocal(BaseMember):
    name = "ventas"
    dominio = "ventas"

    def retrieve_data(self, question, context=None):
        # Lee desde tu data source (Turso, PG, CSV, etc.)
        return []
```

La ciudad es soberana: decide que ministros existen, que KPIs miden,
cuando auditar. fbrain solo provee el patron.
