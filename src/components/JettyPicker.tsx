"use client";

import { JETTIES } from "@/lib/jetties";
import { useJetty } from "./useJetty";

/**
 * The one question the site asks: where are you staying?
 *
 * Five buttons, no dropdown. A native select hides four of the five answers, and hiding them
 * hides the whole argument — that Vivado calls at five jetties while the competition manages
 * three or four. The control *is* the sales pitch, so all of it stays on screen.
 */
export function JettyPicker({ size = "default" }: { size?: "default" | "compact" }) {
  const { jetty, setJetty } = useJetty();
  const compact = size === "compact";

  return (
    <div
      role="group"
      aria-label="Choose the jetty you are staying near"
      className={`flex flex-wrap ${compact ? "gap-1.5" : "gap-2"}`}
    >
      {JETTIES.map((j) => {
        const active = j.id === jetty;
        return (
          <button
            key={j.id}
            type="button"
            onClick={() => setJetty(j.id)}
            aria-pressed={active}
            className={[
              "rounded-full border transition-colors duration-150",
              compact ? "px-3 py-1.5 text-[0.8125rem]" : "px-4 py-2 text-sm",
              active
                ? "border-ink bg-ink text-paper font-medium"
                : "border-ink/20 text-ink-mid hover:border-ink/45 hover:text-ink",
            ].join(" ")}
          >
            {j.name}
          </button>
        );
      })}
    </div>
  );
}
