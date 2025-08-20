# Power-card

A modern, lightweight card component library and demo app for the Capitec Future Developers project. Power-card provides reusable UI components and utilities to build interactive card-based interfaces for web and mobile web apps.

## Features

- Reusable Card components (basic, interactive, action, and media cards)
- Accessible markup and keyboard support
- Theming and customization via CSS variables or a design tokens file
- Small, dependency-free core with optional plugins
- Example demo app showing integration patterns

## Tech stack

- HTML, CSS (custom properties), and vanilla JavaScript
- Optional: React / Vue adapters (examples in /adapters)
- Build: Vite / Rollup (config in repo)

## Getting started

Prerequisites

- Node.js 16+ and npm or Yarn

Install

```bash
# from repo root
npm install
# or
yarn install
```

Run the demo app

```bash
npm run dev
# or
yarn dev
```

Build for production

```bash
npm run build
```

## Usage

Import the card component into your project (ES module example):

```js
import { Card } from 'power-card';

const card = new Card({
  title: 'Account Overview',
  body: 'Your account balance and recent activity',
});

document.body.appendChild(card.render());
```

See the /examples and /docs folders for more integration patterns and framework adapters.

## Development

- Branch from `main` for features or `fix/*` for bug fixes
- Follow the code style in the repository (prettier/eslint configs included)
- Write tests for new features and run the test suite

Recommended commands

```bash
npm run lint
npm run test
npm run dev
```

## Contributing

Contributions welcome! Please open an issue to discuss major changes before submitting a pull request. Follow the repository's contribution guidelines and commit message conventions.

## License

This project is intended for educational use by the Capitec Future Developers program. Please check the LICENSE file in this repository for the exact license terms.

## Maintainers

- @omphilestudent

## Contact

For questions or support, open an issue on this repository or reach out to the maintainers listed above.
