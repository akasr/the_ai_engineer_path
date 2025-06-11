import searchMovies from './semanticSearch.js';
import 'dotenv/config';
import Together from 'together-ai';

const together = new Together({
  apiKey: process.env.TOGETHER_API_KEY,
});

export async function movieAgent(preferences, movies, time) {
  try {
    // Input validation
    if (!preferences || !movies || time === undefined || time === null) {
      throw new Error(
        'Missing required parameters: preferences, movies, or time.'
      );
    }

    if (!Array.isArray(movies)) {
      throw new Error("Parameter 'movies' must be an array.");
    }

    const context = await searchMovies(JSON.stringify(preferences));

    if (!context || context.length === 0) {
      throw new Error('No relevant context found for the query.');
    }

    const response = await together.chat.completions.create({
      model:
        process.env.TOGETHER_MODEL_NAME ||
        'meta-llama/Llama-3.3-70B-Instruct-Turbo-Free',
      messages: [
        {
          role: 'system',
          content: `You are PopChoice, an expert movie recommendation agent specializing in personalized movie selection for groups.

TASK: Analyze user preferences and recommend ONE perfect movie that matches their taste, time constraints, and group dynamics.

INPUT ANALYSIS:
- User preferences include favorite movies with reasons, mood (new/classic), genre preferences (fun/serious/inspiring/scary), and celebrity preferences
- Movies array contains previously rejected titles - NEVER recommend these
- Time is available viewing duration - only recommend movies that fit within this timeframe

CONTEXT DATA: 
You'll receive movie information including titles, ratings, runtime, genres, cast, directors, and detailed descriptions from a curated movie database.

RECOMMENDATION STRATEGY:
1. Match user's stated preferences (favorite movie reasons reveal deeper taste patterns)
2. Respect mood preference (new releases vs classic films)
3. Align with desired emotional experience (fun, serious, inspiring, scary)
4. Consider celebrity preferences as taste indicators
5. Ensure runtime fits available time
6. Exclude any previously rejected movies
7. Prioritize highly-rated films from the context when preferences are general

OUTPUT FORMAT:
Return a JSON object with exactly these properties:
{
  "title": "Exact movie title from context",
  "description": "Compelling 25-35 word summary explaining why this movie perfectly matches their preferences"
}

CRITICAL OUTPUT RULES:
- Output ONLY the JSON object - no explanations, no markdown, no additional text
- Do not wrap in code blocks or backticks
- Ensure the JSON is valid and parseable
- Use exact movie titles from the provided context`,
        },
        {
          role: 'user',
          content: `USER PREFERENCES: ${JSON.stringify(preferences)}

EXCLUDED MOVIES: ${JSON.stringify(movies)}

AVAILABLE TIME: ${time} minutes

MOVIE DATABASE CONTEXT:
${context}

Please recommend one movie that best matches these preferences, excludes the rejected movies, and fits within the time constraint.`,
        },
      ],
      temperature: 0.7,
    });

    let movieResults;
    try {
      // Get the raw response content
      let rawContent = response.choices[0].message.content;

      // Log the raw content for debugging
      console.log('Raw LLM response:', JSON.stringify(rawContent));

      // Clean the response content
      let cleanContent = rawContent.trim();

      // Remove markdown code blocks if present
      cleanContent = cleanContent
        .replace(/^```(?:json)?\s*/, '')
        .replace(/\s*```$/, '');

      // Remove any BOM or invisible characters
      cleanContent = cleanContent.replace(/^\uFEFF/, ''); // Remove BOM
      cleanContent = cleanContent.replace(/[\u200B-\u200D\uFEFF]/g, ''); // Remove zero-width characters

      // Find JSON object boundaries if there's extra text
      const jsonStart = cleanContent.indexOf('{');
      const jsonEnd = cleanContent.lastIndexOf('}');

      if (jsonStart !== -1 && jsonEnd !== -1 && jsonEnd > jsonStart) {
        cleanContent = cleanContent.substring(jsonStart, jsonEnd + 1);
      }

      console.log('Cleaned content for parsing:', JSON.stringify(cleanContent));

      movieResults = JSON.parse(cleanContent);
    } catch (parseError) {
      console.error('Error parsing LLM response:', parseError.message);
      console.error('Raw LLM Response:', response.choices[0].message.content);
      console.error('Parse error details:', parseError);
      throw new Error(
        'Failed to parse movie recommendations from AI. The format might be incorrect.'
      );
    }

    // Validate the parsed result
    if (
      !movieResults ||
      typeof movieResults !== 'object' ||
      !movieResults.title
    ) {
      throw new Error('Invalid movie recommendation format received from AI.');
    }

    console.log('Movie recommendations:', movieResults);
    return movieResults;
  } catch (error) {
    console.error('Error in movieAgent:', error.message);
    if (error.stack) {
      console.error('Stack trace:', error.stack);
    }
    throw new Error(
      `Failed to generate movie recommendations: ${error.message}`
    );
  }
}
