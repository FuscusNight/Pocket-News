import Constants from "expo-constants";

const MISTRAL_API_KEYS = Constants.expoConfig.extra.MISTRAL_API_KEYS;
const MISTRAL_API_URL = "https://api.mistral.ai/v1/chat/completions";

/* Log the configuration status
console.log("Mistral API Configuration:", {
  numberOfKeys: MISTRAL_API_KEYS?.length || 0,
  hasKeys: !!MISTRAL_API_KEYS,
  mode: MISTRAL_API_KEYS?.length === 2 ? "dual-key" : "single-key",
  keysPresent: MISTRAL_API_KEYS?.map((key) => !!key) || [],
}); */

// Helper function to make API request with a specific key
const makeApiRequest = async (text, targetLanguage, apiKey) => {
  console.log(
    "Making API request with key ending in:",
    `...${apiKey.slice(-4)}`,
  );
  const response = await fetch(MISTRAL_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "mistral-small-latest",
      messages: [
        {
          role: "user",
          // Tell the AI what to do , have to really hammer it home
          content: `Translate the following text to ${targetLanguage}. Return ONLY the translation, I REPEAT ONLY RETURN TRANSLATION, no explanations, no additional text: "${text}"`,
        },
      ],
      temperature: 0.1, // Lower Temperature values result in more accurate responses, while higher values introduce more creativity and randomness. https://docs.mistral.ai/getting-started/glossary/#temperature
    }),
  });

  if (!response.ok) {
    const errorMessage = `Status: ${response.status}`;
    console.error("API Error Details:", {
      status: response.status,
      statusText: response.statusText,
      keyUsed: `...${apiKey.slice(-4)}`,
      errorType:
        response.status === 429
          ? "Rate Limit"
          : response.status === 401
            ? "Authentication Error"
            : response.status === 400
              ? "Bad Request"
              : response.status === 500
                ? "Server Error"
                : "Unknown Error",
    });
    throw new Error(errorMessage);
  }

  // Parse and return the translated text
  const data = await response.json();
  // Clean up the response to ensure we only get the translation
  const translation = data.choices[0].message.content.trim();
  // Remove any quotes that might be in the response
  return translation.replace(/^["']|["']$/g, "");
};

export const translateText = async (text, targetLanguage) => {
  // Graceful handling of missing API keys
  if (!MISTRAL_API_KEYS || MISTRAL_API_KEYS.length === 0) {
    console.error("Configuration Error: No API keys found in environment variables");
    console.warn("Translation unavailable, returning original text");
    return text; // Fallback: return original text instead of crashing
  }

  let lastError = null;

  try {
    // Tries each API key in sequence
    for (const apiKey of MISTRAL_API_KEYS) {
      try {
        return await makeApiRequest(text, targetLanguage, apiKey);
      } catch (error) {
        console.error(
          `Translation attempt failed with key ending in ...${apiKey.slice(-4)}:`,
          error,
        );
        lastError = error;

        // Check if it's a rate limit error
        if (error.message.includes("429")) {
          console.warn("Rate limit reached, attempting next key if available");
          if (MISTRAL_API_KEYS.length === 1) {
            // If only one key and it's rate limited, return original text
            console.warn("Single key rate limited, returning original text");
            return text;
          }
          continue; // Try next key
        }

        // For non-rate-limit errors, continue to next key if available
        if (MISTRAL_API_KEYS.length > 1) {
          continue;
        } else {
          // Single key with non-rate-limit error, return original text
          console.warn("Translation failed, returning original text");
          return text;
        }
      }
    }

    // If we get here, all keys failed
    console.error("All API keys failed to process the request");
    console.warn("All translation attempts failed, returning original text");
    return text; // Fallback to original text instead of crashing
  } catch (error) {
    console.error("Unexpected error in translateText:", error);
    return text; // Ultimate fallback
  }
};
