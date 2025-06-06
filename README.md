# [LLM Research](https://llm-research.jojokirby88-327.workers.dev)

## Overview

Next.js project designed for deployment on Cloudflare using OpenNext.
Research different behaviours of LLMs by running tests.
100% free to use (bring your own API key).

## Key Technologies

- **Framework:** Next.js (v15.2.3)
- **AI SDK:**
- **Authentication:** Clerk
- **Database & ORM:** Drizzle ORM (with Cloudflare D1)
- **Deployment:** Cloudflare Workers via OpenNext (`@opennextjs/cloudflare`)

## Setup

1. **Clone the repository:**

    ```
    git clone https://github.com/joshuakirby88/llm-research
    cd llm-research
    ```

2. **Install dependencies:**

    ```
    pnpm install
    ```

3. **Set up environment variables:**
   Create a `.env` file in the root of your project. Add the following variables to it, providing your own values:

    ```
    CRYPTO_KEY=your_strong_crypto_key # Generate a secure random string
    OPENAI_API_KEY=your_openai_api_key
    CLERK_SECRET_KEY=your_clerk_secret_key
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
    NEXT_PUBLIC_POSTHOG_KEY=your_posthog_key
    ```

    Refer to `utils/env.ts` for the complete schema and default values.

4. **Database Migrations (Drizzle ORM):**
   First, run the development server with:

    ```
    pnpm dev
    ```

    to generate the sqlite file. Then, ensure your Cloudflare D1 database is set up and run the migrations:

    ```
    pnpm generate
    pnpm migrate:dev
    ```

5. **View the Application:**
   Since the development server is already running from Step 4, simply open [http://localhost:3000](http://localhost:3000) in your browser to see the result.
