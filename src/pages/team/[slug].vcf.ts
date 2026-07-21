import type { APIRoute } from "astro";
import { getCollection } from "astro:content";

const ORG = "LU-City Entwicklungs-GmbH (LCE)";
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
    `N:${last};${first};;;`,
    `FN:${data.name}`,
    `ORG:${ORG}`,
    `TITLE:${data.role}`,
    `EMAIL;TYPE=INTERNET,WORK:${data.email}`,
  ];
  if (data.phone) lines.push(`TEL;TYPE=WORK,VOICE:${data.phone}`);
  if (data.linkedin) lines.push(`URL:${data.linkedin}`);
  lines.push(
    `ADR;TYPE=WORK:;;${ADR.street};${ADR.city};;${ADR.zip};${ADR.country}`,
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
