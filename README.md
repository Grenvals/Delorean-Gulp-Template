# Delorean Gulp Template

The front-end starter template powered by Gulp, designed to speed up the development workflow, support SASS, PUG, KIT, JavaScript, image optimization, and SVG sprite generation.

## 🚀 Features

- **SASS**: Compile SCSS files into CSS.
- **PUG**: Convert PUG templates into HTML.
- **KIT**: Support for KIT templating.
- **JavaScript**: Concatenate and minify JS files.
- **Image Optimization**: Compress images for faster load times.
- **SVG Sprite**: Generate SVG sprites for efficient SVG usage.
- **Live Reload**: Automatically reload the browser on file changes.

## 📁 Project Structure

```
Delorean-Gulp-Template/
├── build/              # Compiled files
├── dist/               # Distribution-ready files
├── src/                # Source files
│   ├── sass/           # SASS stylesheets
│   ├── pug/            # PUG templates
│   ├── kit/            # KIT templates
│   ├── js/             # JavaScript files
│   ├── images/         # Image assets
│   └── svg/            # SVG files
├── gulpfile.js         # Gulp configuration
├── package.json        # Project metadata and dependencies
└── .gitignore          # Git ignore rules
```

## 🛠 Installation

1. **Clone the repository**:

   ```bash
   git clone https://github.com/Grenvals/Delorean-Gulp-Template.git
   cd Delorean-Gulp-Template
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

## 🚦 Usage

- **Start development server**:

  ```bash
  gulp
  ```

  This will initiate the development server with live reload functionality.

- **Build for production**:

  ```bash
  gulp build
  ```

  This will compile and optimize the project for production deployment.

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).
