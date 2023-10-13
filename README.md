# Todo App Demo LLM agent

This is a simple todo list application built with Next.js, TypeScript, and Firebase Firestore. The application is used for demonstration purposes of an AI agent interacting with the API.

## Technologies Used

- TypeScript
- Next.js
- Flowise (for setting up the LLM agent)
- Material-UI
- Firebase Firestore

## Installation

To get started, clone this repository and install the dependencies:

```bash
git clone https://github.com/your-username/todo-list-app.git
cd todo-list-app
npm install
```

Then, create a Firebase project and add your Firebase configuration to a `.env.local` file in the root of the project:

```
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-auth-domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
```

## Usage

To start the development server, run:

```bash
npm run dev
```

The application should now be running at [http://localhost:3000](http://localhost:3000).

## Features

- Add new todo items
- Mark todo items as completed
- Delete todo items
- View active and completed todo items

## Contributing

Contributions are welcome! If you find a bug or have a feature request, please open an issue or submit a pull request.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
