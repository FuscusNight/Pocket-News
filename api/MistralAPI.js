import Constants from "expo-constants";

// Get the API key from environment variables
const MISTRAL_API_KEY = Constants.expoConfig.extra.TRANSLATE_API_KEY;
const MISTRAL_API_URL = "https://api.mistral.ai/v1/chat/completions";

export const translateText = async (text, targetLanguage) => {
  try {
    // Make API request to Mistral AI
    const response = await fetch(MISTRAL_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${MISTRAL_API_KEY}`,
      },
      body: JSON.stringify({
        model: "mistral-tiny", // Using the smallest model for faster response
        messages: [
          {
            role: "user",
            // Tell the AI what to do , have to really hammer it home
            content: `Translate the following text to ${targetLanguage}. Return ONLY the translation, I REPEAT ONLY RETURN TRANSLATION, no explanations, no additional text: "${text}"`,
          },
        ],
        temperature: 0.1, // Lower Temperature values result in more deterministic and accurate responses, while higher values introduce more creativity and randomness. https://docs.mistral.ai/getting-started/glossary/#temperature
      }),
    });

    if (!response.ok) {
      // Error message from Mistral's response
      const errorData = await response.json();
      throw new Error(
        `Mistral API error: ${errorData.error?.message || "Unknown error"}`,
      );
    }

    // Parse and return the translated text
    const data = await response.json();
    // Clean up the response to ensure we only get the translation
    const translation = data.choices[0].message.content.trim();
    // Remove any quotes that might be in the response
    return translation.replace(/^["']|["']$/g, "");
  } catch (error) {
    console.error("Translation error:", error);
    throw error;
  }
};
