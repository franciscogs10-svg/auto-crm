"""Ministro de Ventas — auto-crm (Ciudad-Estado SaaS-CRM).

Heredado de fbrain_soie.BaseMember (kit S.O.I.E. v0.1.0).

Este ministro observa el pipeline del CRM local (Turso / PG / CSV),
detecta leads en riesgo, y recomienda siguiente contacto. La ciudad
es soberana: Aaron-IA (alcalde) decide KPIs y politicas, fbrain solo
provee el patron via el kit.
"""

from __future__ import annotations

from typing import Any, Dict, List, Optional

from fbrain_soie import BaseMember, Evidence


class VentasLocal(BaseMember):
    name = "ventas"
    dominio = "ventas"

    def __init__(self):
        # Constitution.md se agregara en la siguiente iteracion cuando
        # definamos principios de dominio de auto-crm.
        self.name = "ventas"
        self.dominio = "ventas"

    def retrieve_data(
        self,
        question: str,
        context: Optional[Dict[str, Any]] = None,
    ) -> List[Evidence]:
        """Domain-specific data retrieval.

        TODO: conectar a Turso/PG del CRM cuando este listo el schema.
        Por ahora devuelve evidencia vacia — degrada a template reason.
        """
        return []


__all__ = ["VentasLocal"]
