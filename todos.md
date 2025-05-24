# Stripe

- Try Clerk billing
- Usage based
- How to track usage per model?

# Todos

- [ ] Change complete status to public or published status
- [ ] Filter test runs in test run page
    - Variables: Independent, Blocking combination, Dependent
    - Choose filtering component wisely. Look at ShadCN X account
    - [Sad man table](https://tablecn.com/?filterFlag=advancedFilters)
    - [Bazz UI table](https://ui.bazza.dev/docs/data-table-filter)
- [ ] Rename message prompt to prompt template
- [ ] Constraint error when deleting research
- [ ] I should make deleted user's page still accessible, just add banner that the user is deleted, but make sure that all personal info is not shown
- [ ] There is a possibility that a conitrbutor for the user's own research doesn't exist
- [ ] Feel free to perform more server side queries inside individual tab content components, as they only run once on the server
- [ ] Test deleting a user such that research still remains
- [ ] Create project for gemini
- [ ] Light theme flash on prod when theme is dark (Syntax on theme had solution)
- [ ] Populate research overview page with all info
- [ ] Check if deleting non-existant vector errors
- [ ] Fix ai model select
- [ ] Support research without blocking variables

# New research form

- [ ] Generate sample prompts for all prompt inputs
- [ ] Generate variable values with llm
- [ ] Ability to enter example messages to generate variables and message prompts from
- [ ] Debounce tiptap onChanges

# Data analysis

- Look at data that produced a specific dependent value result
- Should be able to do everything that I can do if I had the data locally
- Automatic AI data analysis

# Research examples

- Does language consistency affect accurancy?
- Do LLMs bias toward identified over anonymous individuals?
- Should conversation history be in individual messages or user prompt?

# Others

- Post my transaction implementation on D1 transaction github discussions
