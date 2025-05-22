# Pre-requisite 
We are searching for a Senior FullStack Role to our Editor service team. Editor service is the core business of this company. We are on the process of
building a brand new editor and this position require deep knowledge of both backend and frontend(60:40 ratio). Every architectural decision has the potential to impact the business in the long run.
This project was designed with that in mind. Many of the tasks are intentionally open-ended, requiring thoughtful decision-making and a professional touch. If you have a strong background in software architecture, this challenge is for you. 

# Expectation

- There won’t be detailed instructions for this task; we’re looking for someone who can easily navigate the folder structure and infer the purpose of each directory.

- Although a `docker-compose.yml` file is provided, it is not fully configured and will require fixes. Some `Dockerfile`s are also missing and need to be created.

- Each Git commit should be meaningful and include a clear message describing the changes it contains.

## Initial requirement

- Build a scalable service that extends the current infrastructure.
You’re not limited to using Docker Compose — feel free to use any other approach you prefer for orchestration or setup.

- Build a simplified real-time collaborative note-taking application that allows multiple users to edit a note simultaneously with live updates.
  - Framework: React with TypeScript

- Implement WebSocket communication between the Backend (BE) and Frontend (FE) — We recommend using the Socket.io library to support real-time collaboration in the editor.


## Other requirement (optional)
We do, understand that you may have a life (some people do). If you don't have the time to respect all the instructions, simply do your best and focus on what you deem most important. If you think something can be improved, don't forget to update this readme file and add those instruction at the end of this file.


- Persist editor content to a storage layer — Choose a suitable database or persistence mechanism.

- Add a secutiry layer for secure communication. Each layer of the provided solution must be protected against typical attack vectors. You should **NOT** rely on your API contract to protect you from malicious inputs.

- Provides a solution that is bug free, fast and meets all the requirements listed above.

- Code provided shows a good proficiency in the chosen language.

- Shows good reflexes with regards to 3rd party dependencies. You should add dependencies that add value to your solution without solving everything for you.

- Solution is architectured properly to allow for adequate test coverage and future extensions.

- Showcases the type of tests needed to validate your architectural choices and to provide confidence that your solution satisfies the 'business' and performance requirements.

- Define and introduce an API contract — Clearly document the API’s structure and expected behavior.

- Provide clear instructions to install dependencies and start both frontend and backend servers.



**Submission Guidelines:**
- Repository:

  - Create a public GitHub repository containing your code.

  - Ensure clear commit messages and a logical commit history.

- README File:

  - Project Overview: Brief description of the project.

  - Setup Instructions: Step-by-step guide to run the application locally.

  - Technology Stack: List the technologies and libraries used.

  - Features Implemented: Highlight the key features you’ve built.

  - Future Improvements: Mention any additional features or improvements you would implement given more time.

- Running the Project:

  - Provide clear instructions to install dependencies and start both frontend and backend servers.

  - Ensure that the application runs without issues.


# Please enter your instructions below

TO RUN APP 

- {after getting to working directory } docker-compose up
- localhost:8080 -> should pull up the application UI
