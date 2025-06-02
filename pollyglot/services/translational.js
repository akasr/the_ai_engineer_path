import together from '../together.config.js';
import sanitizeHtml from 'sanitize-html';

function validateTranslationInput(message, language) {
  if (!message || typeof message !== "string" || message.trim().length === 0) {
    throw new Error("Message is required and must be a non-empty string");
  }

  if (message.length > 50) {
    throw new Error("Message too long (max 50 characters)");
  }

  if (!language || typeof language !== "string") {
    throw new Error("Language is required and must be a string");
  }

  const allowedLanguages = ["hindi", "japanese", "russian"];
  if (!allowedLanguages.includes(language.toLowerCase())) {
    throw new Error(`Unsupported language: ${language}`);
  }

  return true;
}

// Security: Sanitize message to prevent injection attacks
function sanitizeMessage(message) {
  // Remove potentially harmful patterns
  return sanitizeHtml(message, {
    allowedTags: [],
    allowedAttributes: {}
  });
}

export default async function translational(message, language) {
  try {
    validateTranslationInput(message, language);
    message = sanitizeMessage(message);

    if(message.length === 0){
      throw new Error("Message cannot be empty after sanitization");
    }

    const response = await together.chat.completions.create({
      model: "meta-llama/Llama-3.3-70B-Instruct-Turbo-Free",
      messages: [
        {
          role: "system",
          content: `Translate the user text to ${language}. Do not include any additional text or explanations.`,
        },
        {
          role: "user",
          content: message,
        },
      ],
      max_tokens: 100, // Limit response length
      temperature: 0.5, // Control randomness
    });

    if (!response?.choices?.[0]?.message?.content) {
      throw new Error("Invalid response from translation service");
    }

    const translatedText = response.choices[0].message.content.trim();
    console.log(
      `Translation completed: ${language} (${message.length} chars)`
    );

    return translatedText;
  } catch (error) {
    console.error("Error in translational function:", error);
    throw new Error("Translation service temporarily unavailable");
  }
}