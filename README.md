# My Project

A Next.js application for VCU dashboard and AI assistant features.

## Features

- Next.js 16 app router
- Tailwind CSS and component-based UI
- Recharts charting and gauge/indicator components
- OpenAI SDK integration in `lib/ai-assistant.ts`
- Zustand store for VCU data state

## Setup

1. Install dependencies:

   ```bash
   pnpm install
   ```

2. Run the development server:

   ```bash
   pnpm dev
   ```

3. Build for production:

   ```bash
   pnpm build
   ```

4. Start the production server:

   ```bash
   pnpm start
   ```

## Available Scripts

- `pnpm dev` - start the development server
- `pnpm build` - build the production app
- `pnpm start` - run the built app
- `pnpm lint` - lint the project with ESLint

## Project Structure

- `app/` - Next.js route and page components
- `components/` - reusable UI components
- `lib/` - business logic, AI assistant, utilities
- `store/` - application state and VCU store
- `public/` - static assets
- `types/` - shared TypeScript types

## Notes

- The project is configured for `pnpm`.
- OpenAI integration uses the `openai` SDK and may require environment variables for API access.
