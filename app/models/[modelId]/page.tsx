import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";

interface ModelInfo {
  name: string;
  type: "image" | "video";
  description: string;
  features: string[];
  speed: string;
  bestFor: string[];
}

const MODEL_DATA: Record<string, ModelInfo> = {
  flux: {
    name: "Flux",
    type: "image",
    description:
      "Flux is a state-of-the-art text-to-image model known for exceptional prompt adherence and photorealistic output. It handles complex compositions, multiple subjects, and detailed scenes with remarkable accuracy.",
    features: [
      "Exceptional prompt adherence",
      "Photorealistic output",
      "Complex multi-subject scenes",
      "Detailed texture rendering",
    ],
    speed: "Fast (~15s)",
    bestFor: ["Product photography", "Concept art", "Realistic portraits"],
  },
  "gpt-image-2": {
    name: "GPT Image 2.0",
    type: "image",
    description:
      "OpenAI's latest image generation model. GPT Image 2.0 delivers ultra-realistic images with deep understanding of natural language prompts, supporting intricate details and coherent text rendering within images.",
    features: [
      "Ultra-realistic rendering",
      "Natural language understanding",
      "Text-in-image generation",
      "Consistent style across generations",
    ],
    speed: "Standard (~25s)",
    bestFor: ["Marketing visuals", "Illustrations", "Editorial images"],
  },
  "nano-banana-2": {
    name: "Nano Banana 2",
    type: "image",
    description:
      "A fast and efficient image generation model optimized for quick iterations. Nano Banana 2 balances speed and quality, making it ideal for rapid prototyping and creative exploration.",
    features: ["Fast generation", "Balanced quality", "Low latency", "Cost efficient"],
    speed: "Very Fast (~18s)",
    bestFor: ["Rapid prototyping", "Social media", "Quick drafts"],
  },
  "nano-banana-pro": {
    name: "Nano Banana Pro",
    type: "image",
    description:
      "The premium variant of Nano Banana with enhanced detail and coherence. Pro delivers higher fidelity results while maintaining the speed advantages of the Nano Banana series.",
    features: [
      "Enhanced detail",
      "Improved coherence",
      "Fast generation",
      "Professional quality",
    ],
    speed: "Fast (~22s)",
    bestFor: ["Professional work", "Client deliverables", "High-res outputs"],
  },
  "gpt-image-1-5": {
    name: "GPT Image 1.5",
    type: "image",
    description:
      "OpenAI's GPT Image 1.5 offers reliable image generation with broad style support. A solid choice for consistent, high-quality results across diverse use cases.",
    features: [
      "Broad style support",
      "Reliable consistency",
      "Good prompt following",
      "Versatile output",
    ],
    speed: "Standard (~25s)",
    bestFor: ["General purpose", "Batch generation", "Style exploration"],
  },
  "grok-imagine": {
    name: "Grok Imagine",
    type: "image",
    description:
      "xAI's image generation model with a distinctive creative flair. Grok Imagine excels at artistic and imaginative outputs, often producing unexpected and visually striking results.",
    features: [
      "Creative flair",
      "Artistic outputs",
      "Unique visual style",
      "Imaginative rendering",
    ],
    speed: "Standard (~25s)",
    bestFor: ["Art projects", "Creative exploration", "Unique visuals"],
  },
  ideogram: {
    name: "Ideogram",
    type: "image",
    description:
      "Ideogram specializes in rendering text within images with exceptional accuracy. The go-to model for posters, logos, memes, and any design requiring readable typography.",
    features: [
      "Best-in-class text rendering",
      "Typography accuracy",
      "Poster and logo design",
      "Clean graphic output",
    ],
    speed: "Standard (~20s)",
    bestFor: ["Posters", "Logos", "Memes", "Graphic design"],
  },
  "flux-2": {
    name: "Flux 2",
    type: "image",
    description:
      "The next generation of Flux with improved detail, coherence, and style versatility. Flux 2 pushes the boundaries of what's possible in AI image generation.",
    features: [
      "Next-gen architecture",
      "Improved coherence",
      "Enhanced detail",
      "Wide style range",
    ],
    speed: "Fast (~18s)",
    bestFor: ["High-end art", "Commercial work", "Detailed illustrations"],
  },
  "flux-kontext": {
    name: "Flux Kontext",
    type: "image",
    description:
      "Flux Kontext extends the Flux architecture with enhanced contextual understanding. It better grasps narrative and scene context for more coherent storytelling images.",
    features: [
      "Enhanced context understanding",
      "Narrative coherence",
      "Storytelling visuals",
      "Scene consistency",
    ],
    speed: "Standard (~20s)",
    bestFor: ["Story illustrations", "Sequential art", "Narrative scenes"],
  },
  "wan-2.7-image-video": {
    name: "Wan 2.7 Image Edit",
    type: "image",
    description:
      "A specialized model for image editing and manipulation. Wan 2.7 excels at inpainting, outpainting, and style transfer tasks with precise control.",
    features: [
      "Image editing",
      "Inpainting / Outpainting",
      "Style transfer",
      "Precise control",
    ],
    speed: "Standard (~20s)",
    bestFor: ["Photo editing", "Style transfer", "Image restoration"],
  },
  midjourney: {
    name: "Midjourney",
    type: "image",
    description:
      "The iconic AI art model known for its distinctive aesthetic and artistic quality. Midjourney produces images with a unique painterly, dreamlike quality that has defined the AI art movement.",
    features: [
      "Iconic artistic style",
      "Dreamlike aesthetics",
      "Rich color palettes",
      "Painterly textures",
    ],
    speed: "Slow (~30s)",
    bestFor: ["Fine art", "Concept art", "Editorial illustrations"],
  },
  "seedance-2.0": {
    name: "Seedance 2.0 T2V",
    type: "video",
    description:
      "Seedance 2.0 generates expressive dance and motion videos from text prompts. Specialized in human movement, choreography, and dynamic action sequences.",
    features: [
      "Human motion generation",
      "Choreography visualization",
      "Dynamic action",
      "Expressive movement",
    ],
    speed: "Slow (~75s)",
    bestFor: ["Dance videos", "Motion visualization", "Action scenes"],
  },
  "seedance-2.0-fast": {
    name: "Seedance 2.0 Fast",
    type: "video",
    description:
      "The accelerated version of Seedance 2.0, delivering motion videos in under a minute. Ideal for quick iterations and rapid prototyping of video concepts.",
    features: [
      "Fast generation",
      "Motion consistency",
      "Quick iteration",
      "Good quality",
    ],
    speed: "Standard (~45s)",
    bestFor: ["Rapid prototyping", "Quick previews", "Iterative design"],
  },
  "seedance-2.0-r2v": {
    name: "Seedance 2.0 R2V",
    type: "video",
    description:
      "Reference-to-video variant of Seedance 2.0. Upload a reference image and generate a video that follows the visual style and composition of your reference.",
    features: [
      "Reference image input",
      "Style consistency",
      "Composition matching",
      "Visual coherence",
    ],
    speed: "Slow (~75s)",
    bestFor: ["Style matching", "Reference-based video", "Consistent branding"],
  },
  "veo3-1-lite": {
    name: "Veo 3.1 Lite",
    type: "video",
    description:
      "Google's lightweight video generation model. Veo 3.1 Lite offers efficient video creation with good quality, optimized for cost-effective production at scale.",
    features: [
      "Cost efficient",
      "Good quality",
      "Fast generation",
      "Scalable production",
    ],
    speed: "Standard (~60s)",
    bestFor: ["Batch production", "Cost-sensitive projects", "Quick videos"],
  },
  "veo-3.1-fast": {
    name: "Veo 3.1 Fast",
    type: "video",
    description:
      "The speed-optimized variant of Google's Veo 3.1. Delivers video generation results in under a minute without sacrificing visual quality.",
    features: [
      "Ultra-fast generation",
      "Quality preservation",
      "Quick turnaround",
      "Reliable output",
    ],
    speed: "Fast (~45s)",
    bestFor: ["Time-sensitive projects", "Rapid iteration", "Daily content"],
  },
  "veo-3.1-quality": {
    name: "Veo 3.1 Quality",
    type: "video",
    description:
      "Google's highest-quality video generation model. Veo 3.1 Quality produces cinematic, detailed videos with excellent motion coherence and visual fidelity.",
    features: [
      "Cinematic quality",
      "Excellent motion coherence",
      "High visual fidelity",
      "Detailed rendering",
    ],
    speed: "Slow (~90s)",
    bestFor: ["Cinematic content", "High-end productions", "Premium deliverables"],
  },
  "sora-2": {
    name: "Sora 2 VIP",
    type: "video",
    description:
      "OpenAI's premium video generation model. Sora 2 VIP delivers cinematic-quality videos with exceptional physical simulation, realistic motion, and coherent long-form sequences.",
    features: [
      "Cinematic quality",
      "Physical simulation",
      "Realistic motion",
      "Long-form coherence",
    ],
    speed: "Slow (~90s)",
    bestFor: ["Film production", "Commercials", "High-end content"],
  },
  // Sora 2 Pro removed - offline on APIPod
  "runway-gen4": {
    name: "Runway Gen-4",
    type: "video",
    description:
      "Runway's latest generative video model. Gen-4 excels at creative video generation with strong artistic control, motion brush capabilities, and cinematic aesthetics.",
    features: [
      "Creative control",
      "Motion brush",
      "Cinematic aesthetics",
      "Artistic versatility",
    ],
    speed: "Standard (~60s)",
    bestFor: ["Creative videos", "Artistic projects", "Experimental content"],
  },
  "kling-3.0": {
    name: "Kling 3",
    type: "video",
    description:
      "Kling 3 delivers highly realistic human and object motion in video generation. Known for its exceptional handling of human figures, facial expressions, and natural movement.",
    features: [
      "Realistic human motion",
      "Natural expressions",
      "Object physics",
      "Smooth transitions",
    ],
    speed: "Standard (~60s)",
    bestFor: ["Human-centric videos", "Character animation", "Realistic scenes"],
  },
  "kling-2.6-motion": {
    name: "Kling 2.6 Motion Control",
    type: "video",
    description:
      "Kling 2.6 with advanced motion control features. Fine-tune camera movements, object trajectories, and character actions with precise parameter control.",
    features: [
      "Motion control",
      "Camera path editing",
      "Trajectory control",
      "Precise parameters",
    ],
    speed: "Standard (~60s)",
    bestFor: ["Controlled motion", "Camera work", "Technical videos"],
  },
  "hailuo-02": {
    name: "Hailuo 02",
    type: "video",
    description:
      "Hailuo's video generation model with strong motion dynamics and scene composition. Excels at creating videos with complex camera movements and environmental effects.",
    features: [
      "Motion dynamics",
      "Scene composition",
      "Camera movements",
      "Environmental effects",
    ],
    speed: "Standard (~60s)",
    bestFor: ["Dynamic scenes", "Environmental videos", "Action sequences"],
  },
  "hailuo-02-pro": {
    name: "Hailuo 02 Pro",
    type: "video",
    description:
      "The professional variant of Hailuo 02 with enhanced resolution, longer duration support, and improved consistency across video frames.",
    features: [
      "Higher resolution",
      "Longer duration",
      "Frame consistency",
      "Professional output",
    ],
    speed: "Standard (~60s)",
    bestFor: ["Professional deliverables", "Long-form content", "High-res video"],
  },
  "grok-video": {
    name: "Grok Imagine T2V",
    type: "video",
    description:
      "xAI's text-to-video model with a distinctive creative approach. Grok Imagine T2V produces visually unique videos with unexpected artistic touches and imaginative scene compositions.",
    features: [
      "Creative approach",
      "Artistic touches",
      "Unique visuals",
      "Imaginative scenes",
    ],
    speed: "Standard (~60s)",
    bestFor: ["Creative projects", "Artistic video", "Unique content"],
  },
};

const RELATED_MODELS_COUNT = 3;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ modelId: string }>;
}): Promise<Metadata> {
  const { modelId } = await params;
  const model = MODEL_DATA[modelId];
  if (!model) {
    return { title: "Model Not Found | imgvex.AI" };
  }

  const typeLabel = model.type === "image" ? "Image" : "Video";
  return {
    title: `${model.name} AI ${typeLabel} Generator`,
    description: model.description.slice(0, 160),
    alternates: {
      canonical: `/models/${modelId}`,
    },
  };
}

export default async function ModelPage({
  params,
}: {
  params: Promise<{ modelId: string }>;
}) {
  const { modelId } = await params;
  const model = MODEL_DATA[modelId];

  if (!model) {
    notFound();
  }

  const allModels = Object.entries(MODEL_DATA);
  const related = allModels
    .filter(([id, info]) => id !== modelId && info.type === model.type)
    .slice(0, RELATED_MODELS_COUNT);

  const toolPath =
    model.type === "image"
      ? "/tools/text-to-image"
      : "/tools/text-to-video";

  return (
    <main className="min-h-full bg-[#0B0817] text-[#F8FAFC]">
      <section className="px-6 pt-24 pb-16">
        <div className="mx-auto max-w-4xl">
          <div className="flex items-center gap-3">
            <span
              className={`rounded-full px-3 py-1 text-xs font-medium ${
                model.type === "image"
                  ? "bg-[#6366F1]/20 text-[#818CF8]"
                  : "bg-[#EC4899]/20 text-[#F472B6]"
              }`}
            >
              {model.type === "image" ? "Image Model" : "Video Model"}
            </span>
            <span className="text-sm text-[#64748B]">{model.speed}</span>
          </div>
          <h1 className="mt-4 text-4xl font-bold">{model.name}</h1>
          <p className="mt-4 text-lg text-[#94A3B8]">{model.description}</p>
          <div className="mt-8">
            <Link
              href={toolPath}
              className="inline-block rounded-lg bg-[#6366F1] px-8 py-3 font-medium text-white hover:bg-[#5558E0]"
            >
              Generate with {model.name}
            </Link>
          </div>
        </div>
      </section>

      <section className="px-6 py-12">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-xl font-semibold">Key Features</h2>
          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {model.features.map((f) => (
              <div
                key={f}
                className="flex items-center gap-2 rounded-lg border border-[#1E293B] bg-[#13101F] px-4 py-3"
              >
                <span className="text-[#10B981]">&#x2713;</span>
                <span className="text-sm">{f}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-12">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-xl font-semibold">Best For</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {model.bestFor.map((use) => (
              <span
                key={use}
                className="rounded-full border border-[#1E293B] bg-[#13101F] px-4 py-2 text-sm text-[#94A3B8]"
              >
                {use}
              </span>
            ))}
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="px-6 py-12">
          <div className="mx-auto max-w-4xl">
            <h2 className="text-xl font-semibold">Related Models</h2>
            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
              {related.map(([id, info]) => (
                <Link
                  key={id}
                  href={`/models/${id}`}
                  className="rounded-xl border border-[#1E293B] bg-[#13101F] p-4 hover:border-[#64748B]"
                >
                  <div className="font-medium">{info.name}</div>
                  <div className="mt-1 text-xs text-[#64748B]">
                    {info.speed}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
