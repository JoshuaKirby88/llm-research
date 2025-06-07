- [ ] Add a section underneath create research form to submit a message when a user is unable to research what they want
- [ ] Attempt large research with large tests, mocking batch ai, returning static text
- [ ] Fix clerk middleware error
- [ ] Light theme flash on prod when theme is dark (Syntax on theme had solution)

# New research form

- [ ] Enforce token count for message prompts
- [ ] Generate sample prompts for all prompt inputs
- [ ] Support research without blocking variables
    - Make test filter page more flexible to different data
- [ ] Long tags get clipped. Make it scrollable
- [ ] Ability to enter example messages to generate variables and message prompts from

# Research examples

- Look for more examples using LLM
- Does language consistency affect accurancy?
- Do LLMs bias toward identified over anonymous individuals?
- Should conversation history be in individual messages or user prompt?
- What identification method is it best at: (index, UUID, word combo, quote the entire value)

# Get domain

- Register through AWS Route 53
- Transfer to Cloudflare
- Enable image transformations
- Clerk on prod

# Get Cloudflare Pro

- Increases CPU time limit from 10ms to 300,000ms
- Stop using batch AI proxy, and limit number batch length to 1,000
