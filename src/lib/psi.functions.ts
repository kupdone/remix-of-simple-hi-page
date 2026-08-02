import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { buildPsiUrl, normalizeUrl, parsePsiPayload, type PsiReport } from "./psi";

export const runPageSpeed = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) =>
    z
      .object({
        url: z.string().min(3).max(2048),
        strategy: z.enum(["mobile", "desktop"]).default("mobile"),
      })
      .parse(data),
  )
  .handler(async ({ data }): Promise<PsiReport> => {
    const target = normalizeUrl(data.url);
    if (!target) throw new Error("That doesn't look like a valid website URL.");

    const apiKey = process.env["PSI_API_KEY"];
    const res = await fetch(buildPsiUrl(target, data.strategy, apiKey));

    if (!res.ok) {
      const body = await res.text();
      console.error(`PageSpeed request failed [${res.status}]: ${body}`);
      if (res.status === 429) {
        throw new Error("Google's API is rate limiting right now. Try again in a minute.");
      }
      throw new Error("Google couldn't analyse that URL. Check it's public and try again.");
    }

    return parsePsiPayload(await res.json(), data.strategy);
  });
