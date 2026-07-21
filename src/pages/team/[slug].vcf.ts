import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import { COMPANY_LINKEDIN } from "../../lib/team";

const ORG = "LU-City Entwicklungs-GmbH (LCE)";

// Escape a value for a vCard text field (RFC 6350 / 2426).
function esc(value: string): string {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/\n/g, "\\n")
    .replace(/,/g, "\\,")
    .replace(/;/g, "\\;");
}
const ADR = {
  street: "Mundenheimer Str. 182",
  city: "Ludwigshafen am Rhein",
  zip: "67061",
  country: "Deutschland",
};

export async function getStaticPaths() {
  const team = await getCollection("team", ({ data }) => data.hasProfile);
  return team.map((member) => ({
    params: { slug: member.slug },
    props: { member },
  }));
}

export const GET: APIRoute = ({ props }) => {
  const { data } = props.member as { data: Record<string, string> };

  // Split "Vorname(n) Nachname" → N:Nachname;Vorname
  const parts = data.name.trim().split(/\s+/);
  const last = parts.length > 1 ? parts.pop()! : "";
  const first = parts.join(" ");

  const lines = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    "PRODID:-//LCE//Website vCard//DE",
    `N:${esc(last)};${esc(first)};;;`,
    `FN:${esc(data.name)}`,
    `ORG:${esc(ORG)}`,
    `TITLE:${esc(data.role)}`,
    `EMAIL;TYPE=INTERNET,WORK:${esc(data.email)}`,
  ];
  if (data.phone) lines.push(`TEL;TYPE=WORK,VOICE:${esc(data.phone)}`);
  if (data.linkedin) lines.push(`URL:${esc(data.linkedin)}`);
  // LCE-Unternehmens-LinkedIn (bei allen Mitgliedern gleich)
  lines.push(`URL:${esc(COMPANY_LINKEDIN)}`);
  lines.push(
    `ADR;TYPE=WORK:;;${esc(ADR.street)};${esc(ADR.city)};;${esc(ADR.zip)};${esc(ADR.country)}`,
    "END:VCARD",
  );

  // UTF-8-BOM voranstellen: Outlook liest heruntergeladene .vcf sonst als
  // Windows-1252 → falsch dargestellte Umlaute (z. B. "Köhler").
  const body = "﻿" + lines.join("\r\n") + "\r\n";
  return new Response(body, {
    headers: {
      "Content-Type": "text/vcard; charset=utf-8",
      "Content-Disposition": `attachment; filename="${props.member.slug}.vcf"`,
    },
  });
};
