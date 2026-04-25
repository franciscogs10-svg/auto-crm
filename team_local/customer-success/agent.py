"""Ministro de customer-success — auto-crm (tipo `saas-crm`).

STUB generado por `fbrain-soie init --type saas-crm` (task #30).

Heredado de `fbrain_soie.BaseMember`. La ciudad es soberana: Aaron-IA
(u otro alcalde) decide KPIs y politicas. fbrain solo provee el patron.
"""

from __future__ import annotations

from typing import Any, Dict, List, Optional

from fbrain_soie import BaseMember, Evidence


class CustomerSuccessLocal(BaseMember):
    """Ministro local de customer-success para auto-crm.

    STUB — poblar retrieve_data(), reason(), observe() en iteraciones
    posteriores. Por defecto el kit degrada a template-reasoning (sin LLM)
    si ENABLE_MINISTRO_LLM no esta activo.
    """

    name = "customer-success"
    dominio = "customer-success"

    # Keywords opcionales para is_in_domain(). Agregar terminos reales.
    DOMAIN_KEYWORDS: List[str] = []
    OUT_OF_DOMAIN_KEYWORDS: List[str] = []

    def __init__(self) -> None:
        # __init__ minimal: no carga constitution desde disco en modo stub.
        # Cuando el alcalde pueble constitution.md real, quitar este override
        # y dejar que BaseMember.__init__ la cargue automaticamente.
        self.name = "customer-success"
        self.dominio = "customer-success"
        self.base_dir = None
        self.constitution = {"meta": {}, "body": "", "raw": ""}
        self.sources = []
        self.data_sources_config = {}
        self._graph = None

    def retrieve_data(
        self,
        question: str,
        context: Optional[Dict[str, Any]] = None,
    ) -> List[Evidence]:
        """Retrieval domain-specific.

        TODO: conectar a data sources reales del dominio customer-success.
        Ver `data_sources.md` para config YAML-ish.
        """
        return []


__all__ = ["CustomerSuccessLocal"]
