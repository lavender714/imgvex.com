/**
 * Build-time validation: ensure every non-comingSoon model in MODEL_REGISTRY
 * has a corresponding entry in MODEL_CREDIT_COSTS.
 *
 * This script runs automatically before `npm run build` (via the `prebuild`
 * hook in package.json). If any model is missing a price, the build fails
 * loud and clear, preventing undercharging bugs from reaching production.
 *
 * Usage:
 *   npm run prebuild        # manual run
 *   npm run build           # runs automatically via prebuild hook
 */

import { MODEL_REGISTRY } from "../lib/providers/config";
import { MODEL_CREDIT_COSTS } from "../lib/credits/model-costs";

function main(): void {
  const missing: string[] = [];

  for (const model of MODEL_REGISTRY) {
    if (model.comingSoon) continue;
    if (!(model.id in MODEL_CREDIT_COSTS)) {
      missing.push(model.id);
    }
  }

  if (missing.length > 0) {
    console.error("\n❌ [validate-model-costs] Build failed:");
    console.error(
      `   Missing credit cost entries for ${missing.length} model(s):\n   ` +
        missing.join(", ")
    );
    console.error(
      "\n   Every non-comingSoon model in MODEL_REGISTRY must have a " +
        "matching key in MODEL_CREDIT_COSTS.\n"
    );
    process.exit(1);
  }

  const activeCount = MODEL_REGISTRY.filter((m) => !m.comingSoon).length;
  console.log(
    `✅ [validate-model-costs] All ${activeCount} active models have credit costs defined.`
  );
}

main();
