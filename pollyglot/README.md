# Pollyglot Translator

A minimal, secure web app for translating short messages into Hindi, Russian, or Japanese using LLMs.

## Features

- Translate messages (max 50 characters) to Hindi, Russian, or Japanese
- Secure input validation and sanitization (client & server)
- Rate limiting to prevent abuse
- Simple, modern UI

## Usage

1. **Install dependencies:**

   ```zsh
   npm install
   ```

2. **Set up API keys:**
   - Configure your LLM provider in `together.config.js` (see file for details)
   - Ensure you have the necessary API keys for translation services
   - Set environment variable for `TOGETHER_API_KEY` in your `.env` file

3. **Start the development server:**

   ```zsh
   npm run dev
   ```

4. **Open the app:**
   - Visit [http://localhost:3001](http://localhost:3001) in your browser

## Project Structure

- `index.js` — Express server setup
- `services/translational.js` — Translation logic, validation, and sanitization
- `src/` — Frontend (HTML, CSS, JS, assets)

## Security

- All user input is validated and sanitized on both client and server
- Uses `sanitize-html` on the server to prevent XSS/injection
- Rate limiting via `express-rate-limit`

## License

This project is part of the solo project of the Scrimba course - *The AI Engineer Path*.
