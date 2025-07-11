# SwasthX Documentation

This repository contains the documentation for the SwasthX healthcare platform. The documentation is built using Jekyll and hosted on GitHub Pages.

## Getting Started

### Prerequisites

- Ruby (2.5.0 or higher)
- RubyGems
- GCC and Make
- Node.js (for JavaScript runtime)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Swasthx/Swasthx-documentation.git
   cd Swasthx-documentation
   ```

2. **Install dependencies**
   ```bash
   bundle install
   ```

3. **Serve the site locally**
   ```bash
   bundle exec jekyll serve
   ```
   The site will be available at `http://localhost:4000/Swasthx-documentation/`

## Documentation Structure

- `_config.yml` - Jekyll configuration
- `_layouts/` - HTML layouts for different page types
- `_includes/` - Reusable components
- `_sass/` - SCSS styles
- `assets/` - Static files (CSS, JS, images)
- `docs/` - Documentation content
  - `getting-started/` - Getting started guides
  - `development/` - Development guides
  - `api/` - API documentation
  - `architecture/` - System architecture

## Adding New Documentation

1. Create a new Markdown file in the appropriate directory under `docs/`
2. Add front matter at the top of the file:
   ```yaml
   ---
   title: Your Document Title
   layout: default
   ---
   ```
3. Write your documentation using Markdown
4. Add the new document to the navigation in `_config.yml`
5. Submit a pull request

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a pull request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Jekyll](https://jekyllrb.com/)
- [GitHub Pages](https://pages.github.com/)
- [Minima](https://github.com/jekyll/minima) - Jekyll theme
