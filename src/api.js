/**
 * Calls the Anthropic Claude API.
 * The API key is injected automatically by the Claude.ai platform
 * when running inside an Artifact. For local/GitHub deployment,
 * set VITE_ANTHROPIC_API_KEY in your .env file.
 */
export async function callClaude(prompt) {
  const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY || "";

  const headers = {
    "Content-Type": "application/json",
  };

  // Only add Authorization header if we have an API key
  // (Claude.ai Artifact platform handles auth differently)
  if (apiKey) {
    headers["x-api-key"] = apiKey;
    headers["anthropic-version"] = "2023-06-01";
  }

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers,
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1000,
      messages: [{ role: "user", content: prompt }],
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error?.message || `HTTP ${res.status}`);
  }

  const data = await res.json();
  return data.content?.map((b) => b.text || "").join("") || "Tidak ada respons.";
}
