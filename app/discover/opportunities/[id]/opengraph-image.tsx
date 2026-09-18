import { ImageResponse } from "next/og";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const alt = "Opportunity Preview on Launchpad";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const opp = await prisma.opportunity.findUnique({
    where: { id },
  });

  const title = opp?.title || "Career Opportunity";
  const organization = opp?.organization || "Launchpad Partner";
  const type = (opp?.type || "JOB").replace(/_/g, " ");
  const location = opp?.remote ? "Remote" : (opp?.location || "Global");
  const skills = (opp?.requiredSkills || []).slice(0, 5);

  // Compute organization initials
  const initials = organization
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          width: "100%",
          height: "100%",
          backgroundColor: "#080c15",
          backgroundImage: "radial-gradient(ellipse 80% 80% at 50% -20%, rgba(99, 102, 241, 0.25), rgba(255, 255, 255, 0))",
          padding: "60px 70px",
          fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
          color: "#f8fafc",
          position: "relative",
        }}
      >
        {/* Top Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
          }}
        >
          {/* Brand Logo */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "14px",
            }}
          >
            <div
              style={{
                width: "44px",
                height: "44px",
                borderRadius: "12px",
                backgroundColor: "#4f46e5",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#ffffff",
                fontWeight: "900",
                fontSize: "24px",
                boxShadow: "0 0 20px rgba(99, 102, 241, 0.5)",
              }}
            >
              ▲
            </div>
            <div
              style={{
                fontSize: "26px",
                fontWeight: "800",
                letterSpacing: "-0.5px",
                color: "#ffffff",
              }}
            >
              Launchpad
            </div>
          </div>

          {/* Type Badge */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "8px 20px",
              borderRadius: "9999px",
              backgroundColor: "rgba(99, 102, 241, 0.15)",
              border: "1px solid rgba(129, 140, 248, 0.3)",
              color: "#a5b4fc",
              fontSize: "15px",
              fontWeight: "700",
              textTransform: "uppercase",
              letterSpacing: "1px",
            }}
          >
            ● {type}
          </div>
        </div>

        {/* Center: Opportunity Details */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "20px",
            marginTop: "10px",
            marginBottom: "10px",
          }}
        >
          {/* Organization Pill */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "14px",
            }}
          >
            <div
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "14px",
                backgroundColor: "#1e293b",
                border: "2px solid #334155",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "18px",
                fontWeight: "800",
                color: "#38bdf8",
              }}
            >
              {initials}
            </div>
            <div
              style={{
                fontSize: "28px",
                fontWeight: "700",
                color: "#94a3b8",
                letterSpacing: "-0.5px",
              }}
            >
              {organization}
            </div>
          </div>

          {/* Title */}
          <div
            style={{
              fontSize: title.length > 35 ? "48px" : "56px",
              fontWeight: "900",
              lineHeight: 1.1,
              letterSpacing: "-1.5px",
              color: "#ffffff",
              maxWidth: "1000px",
            }}
          >
            {title}
          </div>

          {/* Location & Meta */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "24px",
              color: "#94a3b8",
              fontSize: "20px",
              fontWeight: "500",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span>📍</span>
              <span>{location}</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span>🎯</span>
              <span>Interactive Skill Match Score Available</span>
            </div>
          </div>

          {/* Required Skills Badges */}
          {skills.length > 0 && (
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "10px",
                marginTop: "10px",
              }}
            >
              {skills.map((skill, index) => (
                <div
                  key={index}
                  style={{
                    padding: "8px 18px",
                    borderRadius: "10px",
                    backgroundColor: "rgba(30, 41, 59, 0.8)",
                    border: "1px solid rgba(51, 65, 85, 0.8)",
                    color: "#e2e8f0",
                    fontSize: "16px",
                    fontWeight: "600",
                  }}
                >
                  ✓ {skill}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer Banner */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            paddingTop: "24px",
            borderTop: "1px solid rgba(51, 65, 85, 0.6)",
            width: "100%",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              color: "#6ee7b7",
              fontSize: "18px",
              fontWeight: "700",
            }}
          >
            <span>⚡</span>
            <span>Check your skill game score & readiness plan on Launchpad</span>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              padding: "10px 24px",
              borderRadius: "12px",
              backgroundColor: "#ffffff",
              color: "#0f172a",
              fontSize: "16px",
              fontWeight: "800",
            }}
          >
            View Opportunity →
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
