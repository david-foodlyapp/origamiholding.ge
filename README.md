
  # Origami Website Design

  This is a code bundle for Origami Website Design. The original project is available at https://www.figma.com/design/pAfPQdJIGVtm4AUr87vVx4/Origami-Website-Design.

  ## Running the code

  Run `npm i` to install the dependencies.

  ## API endpoint configuration

  Copy `.env.example` to `.env` and update the API endpoint if needed:

  ```env
  VITE_API_BASE_URL=https://api.origamiholding.com
  ```

  The app reads the API base URL from `VITE_API_BASE_URL` via `src/app/config.ts`. If the variable is not defined, it falls back to `https://api.origamiholding.com`.

  Run `npm run dev` to start the development server.
  
