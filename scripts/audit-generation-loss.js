/**
 * Audit script: Calculate revenue loss from mispriced video generations.
 *
 * Context:
 *   MODEL_CREDIT_COSTS used providerModelId as keys, but
 *   calculateGenerationCost() received MODEL_REGISTRY id.
 *   All video models with mismatched keys fell back to the
 *   default 10 credits instead of their true price (35~240).
 *
 * Usage:
 *   node scripts/audit-generation-loss.js
 *
 * Requires:
 *   SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY env vars
 */

const { createClient } = require("@supabase/supabase-js");

const CORRECT_COSTS = {
  // text-to-video
  "seedance-2.0": 155,
  "seedance-2.0-fast": 50,
  "kling-3.0": 35,
  "kling-2.6-motion": 35,
  "kling-o3": 35,
  "veo-3.1-lite": 75,
  "veo-3.1-fast": 163,
  "veo-3.1-quality": 163,
  "veo-3.1-lite-4k": 120,
  "veo-3.1-fast-4k": 120,
  "veo-3.1-quality-4k": 240,
  "sora-2": 75,
  "sora-2-pro": 165,
  "grok-video": 50,
  "runway-gen4": 6,
  "hailuo-02": 15,
  "hailuo-02-pro": 23,
  // image-to-video
  "seedance-2.0-image-video": 155,
  "seedance-2.0-fast-image-video": 155,
  "wan-2.7-image-video": 60,
  "kling-3.0-image-video": 35,
  "kling-2.6-motion-image-video": 35,
  "kling-o3-image-video": 35,
  "grok-image-video": 50,
  "sora-2-image-video": 75,
  "sora-2-pro-image-video": 165,
  "runway-gen4-image-video": 6,
  "hailuo-02-image-video": 15,
  "hailuo-02-pro-image-video": 23,
  "veo-3.1-fast-ref": 75,
  "veo-3.1-lite-image-video": 75,
  "veo-3.1-fast-image-video": 163,
  "veo-3.1-quality-image-video": 163,
};

async function main() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
    process.exit(1);
  }

  const supabase = createClient(url, key);

  const { data, error } = await supabase
    .from("generation_logs")
    .select("model, task_type, credits_cost, created_at, user_id")
    .like("task_type", "%video%")
    .gte("created_at", "2026-06-01")
    .lt("created_at", "2026-06-09")
    .eq("status", "completed")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Query failed:", error);
    process.exit(1);
  }

  let totalRequests = 0;
  let totalCharged = 0;
  let totalCorrect = 0;
  const byModel = {};
  const affectedUsers = new Set();

  for (const row of data) {
    const model = row.model;
    const correct = CORRECT_COSTS[model] ?? 10;
    const charged = row.credits_cost ?? 0;
    const loss = Math.max(0, correct - charged);

    totalRequests++;
    totalCharged += charged;
    totalCorrect += correct;

    if (!byModel[model]) {
      byModel[model] = { count: 0, charged: 0, correct: 0, loss: 0 };
    }
    byModel[model].count++;
    byModel[model].charged += charged;
    byModel[model].correct += correct;
    byModel[model].loss += loss;

    if (loss > 0) {
      affectedUsers.add(row.user_id);
    }
  }

  const totalLoss = totalCorrect - totalCharged;

  console.log("\n========================================");
  console.log("  VIDEO GENERATION LOSS AUDIT REPORT");
  console.log("  Period: 2026-06-01 ~ 2026-06-08");
  console.log("========================================\n");

  console.log(`Total completed video requests : ${totalRequests}`);
  console.log(`Total credits actually charged : ${totalCharged}`);
  console.log(`Total credits should have been : ${totalCorrect}`);
  console.log(`Total credit loss              : ${totalLoss}`);
  console.log(`Estimated USD loss (@$0.01/cr) : $${(totalLoss * 0.01).toFixed(2)}`);
  console.log(`Affected unique users          : ${affectedUsers.size}\n`);

  console.log("Breakdown by model:");
  console.log("-".repeat(90));
  console.log(
    `${"Model".padEnd(36)} ${"Reqs".padStart(6)} ${"Charged".padStart(9)} ${"Correct".padStart(9)} ${"Loss".padStart(9)} ${"USD".padStart(8)}`
  );
  console.log("-".repeat(90));

  const sorted = Object.entries(byModel).sort((a, b) => b[1].loss - a[1].loss);
  for (const [model, stat] of sorted) {
    const usd = (stat.loss * 0.01).toFixed(2);
    console.log(
      `${model.padEnd(36)} ${String(stat.count).padStart(6)} ${String(stat.charged).padStart(9)} ${String(stat.correct).padStart(9)} ${String(stat.loss).padStart(9)} $${usd.padStart(7)}`
    );
  }
  console.log("-".repeat(90));

  if (totalLoss > 0) {
    console.log("\n⚠️  ACTION REQUIRED:");
    console.log(`   ${affectedUsers.size} users were undercharged.`);
    console.log(`   Consider disabling accounts or sending top-up notices.`);
  } else {
    console.log("\n✅ No loss detected for the queried period.");
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
