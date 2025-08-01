# NUVIC5M Tech Solutions Ltd - Website

A modern, responsive website for NUVIC5M Tech Solutions Ltd, an educational technology company offering courses and services in technology and digital skills.

## 🌐 Live Demo

**Repository:** [https://github.com/obedson/nuvic5m.git](https://github.com/obedson/nuvic5m.git)

## 📋 Project Overview

This is a full-featured educational website built with modern web technologies, featuring:

- **Responsive Design**: Mobile-first approach with tablet and desktop breakpoints
- **Interactive Hero Slider**: Dynamic image carousel with navigation controls
- **Course Management**: Dynamic course listing with database integration capabilities
- **User Authentication**: Login, registration, and password management system
- **Admin Panel**: Administrative interface for content management
- **Modern UI/UX**: Clean, professional design with smooth animations

## 🚀 Features

### Core Pages
- **Homepage** (`index.html`): Hero section with slider, course previews, contact information
- **About** (`pages/about.html`): Company information and mission
- **Services** (`pages/services.html`): Detailed service offerings
- **Courses** (`pages/courses.html`): Course catalog with filtering and search
- **Authentication**: Login, registration, forgot password, and password update pages
- **Admin Panel** (`pages/admin.html`): Administrative dashboard

### Technical Features
- Responsive navigation with hamburger menu for mobile
- Image slider with automatic and manual navigation
- Form validation and user feedback
- CSS Grid and Flexbox layouts
- Modern typography using Google Fonts (Poppins)
- Accessibility-compliant design
- Cross-browser compatibility

## 🛠️ Technology Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Styling**: Custom CSS with modern features (Grid, Flexbox, CSS Variables)
- **Typography**: Google Fonts (Poppins)
- **Database Ready**: Prepared for Supabase integration
- **Version Control**: Git with GitHub hosting

## 📁 Project Structure

```
NUVIC5M_Project/
├── index.html                 # Main homepage
├── assets/
│   ├── css/                   # Stylesheets
│   ├── js/                    # JavaScript files
│   └── images/                # Image assets
├── pages/                     # Additional pages
│   ├── about.html
│   ├── services.html
│   ├── courses.html
│   ├── login.html
│   ├── register.html
│   ├── forgot-password.html
│   ├── update-password.html
│   └── admin.html
├── docs/                      # Documentation files
│   ├── CONTENT_UPDATES_SUMMARY.md
│   ├── FILE_REORGANIZATION_SUMMARY.md
│   ├── POLICY_FIX_GUIDE.md
│   ├── SLIDER_TROUBLESHOOTING.md
│   └── TODO_COMPLETION_SUMMARY.md
└── README.md                  # This file
```

## 🚦 Getting Started

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Web server (for local development) or GitHub Pages for hosting

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/obedson/nuvic5m.git
   cd nuvic5m
   ```

2. **Local Development**
   - Open `index.html` in your browser, or
   - Use a local server (recommended):
   ```bash
   # Using Python
   python -m http.server 8000
   
   # Using Node.js
   npx serve .
   
   # Using PHP
   php -S localhost:8000
   ```

3. **Access the website**
   - Local: `http://localhost:8000`
   - GitHub Pages: Will be available after deployment

## 🎨 Customization

### Branding
- Replace logo in `assets/images/logo.jpg`
- Update company information in HTML files
- Modify color scheme in CSS variables

### Content
- Update course information in `pages/courses.html`
- Modify service offerings in `pages/services.html`
- Update company details in `pages/about.html`

### Styling
- Main styles: `assets/css/style.css`
- Color palette and typography defined with CSS variables
- Responsive breakpoints: Mobile (default), Tablet (768px+), Desktop (1024px+)

## 🔧 Development Notes

### Known Issues & Solutions
- **Slider Issues**: See `SLIDER_TROUBLESHOOTING.md` for common problems
- **Policy Fixes**: Database-related fixes documented in `POLICY_FIX_GUIDE.md`
- **Content Updates**: Recent changes tracked in `CONTENT_UPDATES_SUMMARY.md`

### Database Integration
The project is prepared for Supabase integration:
- Environment variables configured in `.env`
- Database schema considerations in `fix_policies.sql`
- Course data structure ready for dynamic loading

### File Organization
Recent reorganization documented in `FILE_REORGANIZATION_SUMMARY.md`:
- Improved asset organization
- Consistent naming conventions
- Better separation of concerns

## 📝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is proprietary to NUVIC5M Tech Solutions Ltd. All rights reserved.

## 📞 Contact

**NUVIC5M Tech Solutions Ltd**
- Website: [Coming Soon]
- Email: [Contact Information]
- Phone: [Contact Information]

## 🔄 Recent Updates

- ✅ Responsive design implementation
- ✅ Hero slider functionality
- ✅ User authentication system
- ✅ Admin panel development
- ✅ Cross-browser compatibility
- ✅ Accessibility improvements
- 🔄 Database integration (in progress)
- 📋 GitHub Pages deployment (pending)

## 📚 Documentation

Additional documentation available in the `docs/` directory:
- Content update procedures
- Troubleshooting guides
- Development policies
- File organization standards

---

**Built with ❤️ for NUVIC5M Tech Solutions Ltd**
