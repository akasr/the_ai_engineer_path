const prompt = document.getElementById('prompt');
const form = document.getElementById('form');
const messageContainer = document.getElementById("messages");

const validateInput = (message, language) => {
  if (!message || typeof message !== 'string' || message.trim() === '') {
    throw new Error('message is required and must be a non-empty string');
  }
  if (message.length > 50) {
    throw new Error('message must be less than 50 characters');
  }
  if (!language || typeof language !== 'string' || language.trim() === '') {
    throw new Error('language is required and must be a non-empty string');
  }

  const allowedLanguages = ['hindi', 'russian', 'japanese'];
  if( !allowedLanguages.includes(language.toLowerCase())) {
    throw new Error(`language must be one of the following: ${allowedLanguages.join(', ')}`);
  }
  return true;
}

const sanitizeHTML = (message) => {
  // Input: <script>alert("XSS attack!")</script>
  const tempDiv = document.createElement('div');
  tempDiv.textContent = message;
  return tempDiv.innerHTML;
  // Output: &lt;script&gt;alert("XSS attack!")&lt;/script&gt;
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const formData = new FormData(form);
  const data = Object.fromEntries(formData.entries());

  try {
    validateInput(data.message, data.language);
    const sanitizedMessage = sanitizeHTML(data.message);

    prompt.value = "Processing your request...";
    console.log('Sanitized message:', sanitizedMessage);
    console.log('Language:', data.language);

    const userMessageDiv = document.createElement('div');
    userMessageDiv.className = 'user message';
    userMessageDiv.textContent = sanitizedMessage;
    messageContainer.appendChild(userMessageDiv);

    const response = await fetch('api/translate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message: sanitizedMessage,
        language: data.language
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error response:', errorText);
      throw new Error(`Server Error: ${errorText}`);
    }

    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      const text = await response.text();
      console.error("Non-JSON response:", text);
      throw new Error("Server returned non-JSON response");
    }

    const result = await response.json();
    console.log('Translation result:', result);
    const assistantMessageDiv = document.createElement('div');
    assistantMessageDiv.className = 'assistant message';
    assistantMessageDiv.textContent = result.translation || 'Translation failed';
    messageContainer.appendChild(assistantMessageDiv);

    prompt.value = "";
  } catch (error) {
    console.error('Error:', error);
    const errorMessageDiv = document.createElement('div');
    errorMessageDiv.className = 'error message';
    errorMessageDiv.textContent = `Error: ${error.message}`;
    messageContainer.appendChild(errorMessageDiv);
    prompt.value = "";
  }
});