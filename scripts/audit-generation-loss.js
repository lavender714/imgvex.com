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
  const byUser = {};
  const allUsers = new Set();
  const affectedUsers = new Set();

  for (const row of data) {
    const model = row.model;
    const correct = CORRECT_COSTS[model] ?? 10;
    const charged = row.credits_cost ?? 0;
    const loss = Math.max(0, correct - charged);
    const uid = row.user_id;

    totalRequests++;
    totalCharged += charged;
    totalCorrect += correct;
    allUsers.add(uid);

    // per-model stats
    if (!byModel[model]) {
      byModel[model] = { count: 0, charged: 0, correct: 0, loss: 0 };
    }
    byModel[model].count++;
    byModel[model].charged += charged;
    byModel[model].correct += correct;
    byModel[model].loss += loss;

    // per-user stats
    if (!byUser[uid]) {
      byUser[uid] = {
        count: 0,
        charged: 0,
        correct: 0,
        loss: 0,
        models: new Set(),
        firstAt: row.created_at,
        lastAt: row.created_at,
      };
    }
    const u = byUser[uid];
    u.count++;
    u.charged += charged;
    u.correct += correct;
    u.loss += loss;
    u.models.add(model);
    if (row.created_at < u.firstAt) u.firstAt = row.created_at;
    if (row.created_at > u.lastAt) u.lastAt = row.created_at;

    if (loss > 0) {
      affectedUsers.add(uid);
    }
  }

  const totalLoss = totalCorrect - totalCharged;

  // Build sorted user array with uid preserved
  const userEntries = Object.entries(byUser).map(([uid, stats]) => ({ uid, ...stats }));
  const sortedByLoss = userEntries.sort((a, b) => b.loss - a.loss);
  const topUser = sortedByLoss[0];

  console.log("\n========================================");
  console.log("  VIDEO GENERATION LOSS AUDIT REPORT");
  console.log("  Period: 2026-06-01 ~ 2026-06-08");
  console.log("========================================\n");

  // ─── Overall Summary ───
  console.log("【总体概览】");
  console.log(`  总完成视频请求数 : ${totalRequests}`);
  console.log(`  实际扣除积分     : ${totalCharged}`);
  console.log(`  应扣除积分       : ${totalCorrect}`);
  console.log(`  积分损失         : ${totalLoss}`);
  console.log(`  预估 USD 损失    : $${(totalLoss * 0.01).toFixed(2)}`);
  console.log(`  涉及总用户数     : ${allUsers.size}`);
  console.log(`  受损失影响用户数 : ${affectedUsers.size}`);
  if (topUser && totalLoss > 0) {
    console.log(`  最大损失用户损失 : ${topUser.loss} 积分 ($${(topUser.loss * 0.01).toFixed(2)})`);
    console.log(`  最大损失用户占比 : ${((topUser.loss / totalLoss) * 100).toFixed(1)}%`);
  }
  console.log();

  // ─── User Analysis ───
  console.log("【用户维度分析】");
  if (affectedUsers.size === 0) {
    console.log("  ✅ 无损失记录\n");
  } else if (affectedUsers.size === 1) {
    console.log("  ⚠️  这是一个单用户行为！仅 1 个用户产生了全部损失。\n");
  } else {
    console.log(`  ⚠️  这是多用户行为，共 ${affectedUsers.size} 个用户产生了损失。`);
    const singleUserDominance = topUser && totalLoss > 0
      ? (topUser.loss / totalLoss) * 100
      : 0;
    if (singleUserDominance > 70) {
      console.log(`     但高度集中：最大损失用户占全部损失的 ${singleUserDominance.toFixed(1)}%。`);
    } else if (singleUserDominance > 40) {
      console.log(`     相对集中：最大损失用户占全部损失的 ${singleUserDominance.toFixed(1)}%。`);
    } else {
      console.log(`     分布较分散：最大损失用户仅占 ${singleUserDominance.toFixed(1)}%。`);
    }
    console.log();
  }

  // ─── Per-User Breakdown (top 20) ───
  if (affectedUsers.size > 0) {
    console.log("【用户损失排行 Top 20】");
    console.log("-".repeat(120));
    console.log(
      `${"Rank".padStart(4)} ${"User ID".padEnd(36)} ${"Reqs".padStart(5)} ${"Charged".padStart(8)} ${"Correct".padStart(8)} ${"Loss".padStart(8)} ${"USD".padStart(8)} ${"Models".padStart(6)} ${"First".padStart(16)} ${"Last".padStart(16)}`
    );
    console.log("-".repeat(120));
    for (let i = 0; i < Math.min(20, sortedByLoss.length); i++) {
      const u = sortedByLoss[i];
      const usd = (u.loss * 0.01).toFixed(2);
      const first = new Date(u.firstAt).toLocaleString("zh-CN", { month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" });
      const last = new Date(u.lastAt).toLocaleString("zh-CN", { month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" });
      console.log(
        `${String(i + 1).padStart(4)} ${u.uid.padEnd(36)} ${String(u.count).padStart(5)} ${String(u.charged).padStart(8)} ${String(u.correct).padStart(8)} ${String(u.loss).padStart(8)} $${usd.padStart(7)} ${String(u.models.size).padStart(6)} ${first.padStart(16)} ${last.padStart(16)}`
      );
    }
    console.log("-".repeat(120));
    console.log();
  }

  // ─── Per-Model Breakdown ───
  console.log("【模型维度损失排行】");
  console.log("-".repeat(90));
  console.log(
    `${"Model".padEnd(36)} ${"Reqs".padStart(6)} ${"Charged".padStart(9)} ${"Correct".padStart(9)} ${"Loss".padStart(9)} ${"USD".padStart(8)}`
  );
  console.log("-".repeat(90));

  const sortedModel = Object.entries(byModel).sort((a, b) => b[1].loss - a[1].loss);
  for (const [model, stat] of sortedModel) {
    const usd = (stat.loss * 0.01).toFixed(2);
    console.log(
      `${model.padEnd(36)} ${String(stat.count).padStart(6)} ${String(stat.charged).padStart(9)} ${String(stat.correct).padStart(9)} ${String(stat.loss).padStart(9)} $${usd.padStart(7)}`
    );
  }
  console.log("-".repeat(90));

  // ─── Action Items ───
  console.log();
  if (totalLoss > 0) {
    console.log("⚠️  ACTION REQUIRED:");
    console.log(`   ${affectedUsers.size} 个用户被少扣积分。`);
    if (affectedUsers.size === 1 && topUser) {
      console.log(`   唯一受影响用户 ID: ${topUser.uid}`);
      console.log(`   建议：直接封禁该账户或发送补款通知。`);
    } else {
      console.log(`   建议：对 Top 3 用户优先处理（追缴 / 封禁 / 通知）。`);
    }
  } else {
    console.log("✅ No loss detected for the queried period.");
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
