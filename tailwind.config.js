module.exports = {
  content: [
    "./resources/js/**/*.{js,jsx}",     // Scan React components
    "./resources/views/**/*.blade.php"  // Scan Blade templates
  ],
  theme: {
    extend: {}, // Add customizations here
  },
  plugins: [], // No PostCSS plugins needed
}