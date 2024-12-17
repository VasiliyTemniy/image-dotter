# Image Dotter

A utility tool for creating styled site logos from images, similar to the Prettier logo style. Transform regular images into customizable, animated dot grids for web use.

![Example](https://i.imghippo.com/files/CX5901RbA.png)

## Features

- Convert images to customizable dot/cell grids
- Adjust grid parameters (rows, columns, gaps, etc.)
- Apply visual effects (border radius, rotation, stroke)
- Generate variations using seed-based algorithms
- Add surrounding decorative cells
- Create CSS animations
- Export as JSON, HTML, or CSS
- Dark/Light theme support
- English/Russian language support

## Prerequisites

- Node.js
- npm
- Browser with HTML5 Canvas support

## Installation

1. Clone the repository:

`git clone https://github.com/VasiliyTemniy/image-dotter.git`

2. Install dependencies:

`npm install`

3. Start the development server:

`npm start`

## Usage

1. Open the app in your browser
2. Click "Select file" to choose an image
3. Adjust grid parameters in the side menu
4. Customize visual appearance and animations
5. Export the result in your preferred format

For detailed usage instructions, click the guide button in the app's interface.

## Development

### Tech Stack

- React
- i18next for internationalization
- HTML5 Canvas for image processing
- CSS Modules for styling

### Project Structure

- `/src/assets` - Static assets and guides
- `/src/components` - React components
- `/src/hooks` - Custom React hooks (mostly simple state handling)
- `/src/locales` - Translation files
- `/src/styles` - CSS styles
- `/src/utils` - Utility functions

### Available Scripts

- `npm start` - Run development server
- `npm build` - Build for production
- `npm test` - Run tests
- `npm run lint` - Run ESLint

## License

MIT License - see LICENSE file for details

## Author

VasiliyTemniy

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request