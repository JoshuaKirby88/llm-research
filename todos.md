- [ ] When linking directly to "/user/{userId}", I should try to use queriedUser.userId or currentUser.userId, because this should link to "/user/undefined" if user is deleted.
    - If linking to "/user/{userId}/research/{researchId}", then it's better to link with research.userId.
    - But this is quite a difficult thing to enforce, so maybe I should just check this in a layout
- [ ] Create project for gemini
- [ ] Light theme flash on prod when theme is dark (Syntax on theme had solution)
- [ ] Populate research overview page with all info
- [ ] Visually mark replaced variables when showing messages
- [ ] Check if deleting non-existant vector errors
- [ ] Show more data in test batch page
    - Results
- [ ] Fix ai model select
- [ ] Support research without blocking variables
- [ ] Assign colors to each dependent value in research settings

# New research form

- [ ] Generate sample prompts for all prompt inputs
- [ ] Generate variable values with llm
- [ ] Ability to enter example messages to generate variables and message prompts from
- [ ] Debounce tiptap onChanges

# Research examples

- Does language consistency affect accurancy?
- Do LLMs bias toward identified over anonymous individuals?
- Should conversation history be in individual messages or user prompt?

# Others

- Post my transaction implementation on D1 transaction github discussions
