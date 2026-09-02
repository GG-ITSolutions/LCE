import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import { COMPANY_LINKEDIN } from "../../lib/team";

const ORG = "LU-City Entwicklungs-GmbH (LCE)";

// Die Website zeigt die LCE-Domain überall groß geschrieben an
// (LCE-Ludwigshafen.de). In der vCard bleibt die Domain bewusst klein.
function withLowercaseDomain(email: string): string {
  const at = email.lastIndexOf("@");
  if (at === -1) return email;
  return email.slice(0, at + 1) + email.slice(at + 1).toLowerCase();
}

// Escape a value for a vCard text field (RFC 6350 / 2426).
function esc(value: string): string {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/\n/g, "\\n")
    .replace(/,/g, "\\,")
    .replace(/;/g, "\\;");
}
// Namenszusätze, die zum Nachnamen gehören (niederländisch/deutsch/romanisch).
const NAME_PARTICLES = new Set([
  "van", "von", "vom", "zu", "zum", "zur", "de", "del", "della", "der", "den",
  "des", "di", "da", "dos", "du", "la", "le", "ten", "ter",
]);

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
  // Namenszusätze ("van Vliet", "von der Heide") gehören zum Nachnamen: ab dem
  // ersten Zusatz zählt alles zum Nachnamen, sonst greift das letzte Wort.
  const parts = data.name.trim().split(/\s+/);
  const particleIndex = parts.findIndex((part, i) => i > 0 && NAME_PARTICLES.has(part.toLowerCase()));
  const splitAt = particleIndex === -1 ? parts.length - 1 : particleIndex;
  const last = parts.length > 1 ? parts.slice(splitAt).join(" ") : "";
  const first = parts.slice(0, splitAt).join(" ");

  // CHARSET=UTF-8 an den Textfeldern: Hinweis für Outlook, damit Umlaute
  // korrekt gelesen werden (KEIN BOM – ein BOM vor BEGIN:VCARD macht die
  // Datei für viele Clients ungültig). Moderne Clients ignorieren den Parameter.
  const lines = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    "PRODID:-//LCE//Website vCard//DE",
    `N;CHARSET=UTF-8:${esc(last)};${esc(first)};;;`,
    `FN;CHARSET=UTF-8:${esc(data.name)}`,
    `ORG;CHARSET=UTF-8:${esc(ORG)}`,
    `TITLE;CHARSET=UTF-8:${esc(data.role)}`,
    `EMAIL;TYPE=INTERNET,WORK:${esc(withLowercaseDomain(data.email))}`,
  ];
  if (data.phone) lines.push(`TEL;TYPE=WORK,VOICE:${esc(data.phone)}`);
  if (data.mobile) lines.push(`TEL;TYPE=CELL,VOICE:${esc(data.mobile)}`);
  if (data.linkedin) lines.push(`URL:${esc(data.linkedin)}`);
  // LCE-Unternehmens-LinkedIn (bei allen Mitgliedern gleich)
  lines.push(`URL:${esc(COMPANY_LINKEDIN)}`);
  lines.push(
    `ADR;TYPE=WORK;CHARSET=UTF-8:;;${esc(ADR.street)};${esc(ADR.city)};;${esc(ADR.zip)};${esc(ADR.country)}`,
    "END:VCARD",
  );

  const body = lines.join("\r\n") + "\r\n";
  return new Response(body, {
    headers: {
      "Content-Type": "text/vcard; charset=utf-8",
      "Content-Disposition": `attachment; filename="${props.member.slug}.vcf"`,
    },
  });
};
