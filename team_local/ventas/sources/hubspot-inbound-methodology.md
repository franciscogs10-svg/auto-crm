---
author: HubSpot (Brian Halligan + Dharmesh Shah)
book: Inbound Methodology (framework publico)
year: 2006-2020
dominio: ventas
aplicabilidad: inbound + lifecycle marketing + scoring
updated: 2026-04-25
---

# Principios nucleares

## 1. Attract / Engage / Delight (el nuevo flywheel)

HubSpot reemplazo el embudo clasico por un flywheel en 2018. La
tesis: los clientes satisfechos son el motor del crecimiento, no
un *output* del embudo. Tres fases:

- **Attract**: contenido educativo, SEO, social organico. El
  prospecto llega por voluntad, no por intrusion. KPI clave:
  organic traffic + conversion rate visitor-to-lead.
- **Engage**: nutrir al lead con recursos relevantes a su stage,
  scoring, enrutamiento a ventas cuando esta listo. KPI: lead-to-MQL
  conversion + response time.
- **Delight**: el cliente actual se convierte en promotor,
  referrals bajan el CAC. KPI: NPS + referral-sourced revenue.

## 2. Lifecycle stages como contrato

HubSpot definio una taxonomia que se volvio estandar de industria:

1. Subscriber
2. Lead
3. MQL (Marketing Qualified Lead)
4. SQL (Sales Qualified Lead)
5. Opportunity
6. Customer
7. Evangelist

Cada stage tiene criterios de entrada y salida explicitos. En
auto-crm el `lifecycle_stage` es un campo canonico. Un lead no pasa
de MQL a SQL sin que el SDR valide fit (BANT o similar).

## 3. Inbound es permiso (Seth Godin + HubSpot)

La tesis de *Permission Marketing* (Godin 1999) que HubSpot
operacionalizo: el prospecto elige el contenido. Cada email
outbound sin permiso degrada el dominio; cada interaccion con
permiso lo fortalece. En auto-crm:

- `lead_source=inbound` tiene score inicial alto.
- `lead_source=cold` tiene score inicial bajo y requiere research
  manual antes de escalar.
- Unsubscribes bajan el sender reputation, deben trackearse.

## 4. Smarketing (SLA entre marketing y ventas)

HubSpot acuno el termino "smarketing": marketing y ventas con un
SLA escrito. Marketing se compromete a entregar N MQLs/mes con
calidad Q; ventas se compromete a contactar en < 5 minutos cuando
el lead llega a SQL. Response time < 5 min eleva conversion 9x vs
> 1 hora (estudio InsideSales).

En auto-crm esto se implementa con alertas automaticas cuando un
lead pasa a SQL y nadie lo toca en 5 min.

## 5. Content as asset (no campaign)

Un blog post bien hecho genera leads durante 3+ anos. Un anuncio
paga deja de funcionar el dia que se apaga el presupuesto. HubSpot
demostro que el 70% de sus leads nuevos venia de posts publicados
hace > 6 meses. En auto-crm: priorizar biblioteca de case studies
evergreen sobre campanas de paid.
