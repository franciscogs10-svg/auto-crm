---
author: Aaron Ross
book: Predictable Revenue
year: 2011
dominio: ventas
aplicabilidad: outbound SDR + separacion de roles
updated: 2026-04-25
---

# Principios nucleares

## 1. El mito del SDR-AE combinado

Aaron Ross fue responsable de llevar Salesforce de $5M a $100M ARR.
Su insight central: **los roles combinados no escalan**. Un mismo
humano no puede prospectar y cerrar al mismo tiempo porque los
incentivos son incompatibles. Cuando el pipeline esta lleno, deja
de prospectar. Cuando esta vacio, prospecta mal porque tiene
urgencia de quota. Separar:

- **SDR (Sales Development Rep)**: solo prospecta, genera reuniones
  calificadas, no toca cierre.
- **AE (Account Executive)**: solo cierra, recibe reuniones
  calificadas.
- **Farmer / Customer Success**: solo expande y retiene cuentas ya
  cerradas.

En auto-crm esto se traduce en campos distintos: `lead_source_rep`
vs `deal_owner`. Y reportes separados.

## 2. Cold Calling 2.0 (Cold email con research)

El cold email masivo sin personalizacion es spam. Cold Calling 2.0
es:

1. Investigar cuenta (10 min maximo).
2. Identificar ejecutivo relevante (no el CEO si la empresa es
   grande, el director del area).
3. Email corto (< 90 palabras) pidiendo referencia dentro de la
   organizacion, no pidiendo reunion.
4. Medir response rate, no open rate.

La magia del "pedir referencia interna" es que invierte el
equilibrio de poder. El ejecutivo que recibe el email no tiene que
decir si/no a una reunion, solo tiene que forwardear. Response rate
sube 3-5x.

## 3. Ideal Customer Profile (ICP) restrictivo

Ross insiste en definir ICP **por exclusion**. No "empresas B2B
SaaS", sino "empresas B2B SaaS, 50-200 empleados, sede USA, ultimo
funding ronda A, stack Salesforce". Cuanto mas estrecho, mejor la
conversion.

En auto-crm el ICP se declara en `crm-config.json` (vertical,
tamano, region). Los leads que no califican se enrutan a nurturing
de bajo toque, no al SDR.

## 4. Pipeline velocity > pipeline volume

La metrica que Ross elevo sobre todas es **velocity**: dias promedio
en mover de "lead" a "closed won". Reducir velocity de 45 dias a
30 dias tiene mas impacto financiero que aumentar 50% el volumen de
leads, porque acorta el cash conversion cycle.
