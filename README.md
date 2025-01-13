# peerlab-frontend
The frontend of PeerLab.

## Getting Started
You will need the node package manager (npm) to actually develop and run anything of the frontend.
It is the node package manager for Node.js, so you will need to install Node.js first (said copilot).

If you want to run it, first you'll need to install the dependencies. You can do this by running the following command:
```bash
npm install
```
I am no expert on this, but I (copilot:) think this will install all the dependencies listed in the package.json file.
If everything is resolved right you can start right away. If someone adds a new package "npm install" may be sufficient.
We have to figure that out. Else, you'll need 
```bash
npm install <package-name>
``` 
or 
```zsh
npm i <package-name> "--save-dev"
```
with some additional flags like in this example. 
If the simple command does not resolve everything, please provide which installation commands you used so everybody has an easy-going development process.

To run the app locally, run the following command:
```bash
npm run dev
```
The port to connect to is displayed. 

+++ End of notice +++

# This is the content of the README.md file from the template

# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
export default tseslint.config({
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

- Replace `tseslint.configs.recommended` to `tseslint.configs.recommendedTypeChecked` or `tseslint.configs.strictTypeChecked`
- Optionally add `...tseslint.configs.stylisticTypeChecked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and update the config:

```js
// eslint.config.js
import react from 'eslint-plugin-react'

export default tseslint.config({
  // Set the react version
  settings: { react: { version: '18.3' } },
  plugins: {
    // Add the react plugin
    react,
  },
  rules: {
    // other rules...
    // Enable its recommended rules
    ...react.configs.recommended.rules,
    ...react.configs['jsx-runtime'].rules,
  },
})
```
