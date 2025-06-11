# PopChoice

PopChoice is a minimalistic movie recommendation web app. It leverages semantic search and embeddings to suggest movies based on user preferences, with a clean and simple interface.

## Features

- Movie recommendations using semantic search
- Fetches movie posters and details
- Simple, modern UI

## Project Structure

- `src/` — Frontend code (HTML, CSS, JS, components)
- `services/` — Backend logic (embeddings, semantic search, movie agent)
- `movies.txt` — Movie dataset

## Usage

1. **Install dependencies:**

   ```zsh
   npm install
   ```

2. **Set up API keys:**

   Copy the example environment file and set your API keys:

   ```zsh
   cp .env.example .env
   ```

3. **Run the app:**

   ```zsh
   npm start
   ```

## Configuration

- Edit `supabase.config.js` for Supabase settings.
- Update `movies.txt` to add or modify movies.

## License

This project is part of the solo project of the Scrimba course - _The AI Engineer Path_.

[↩ Back](/the_ai_engineer_path/)
