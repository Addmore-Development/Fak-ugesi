# Fak-ugesi

## Folder Structure

```
fakugesi-festival/
│
├── server.js                          # Main server entry point
├── package.json                       # NPM dependencies
├── package-lock.json                  # Lockfile (auto-generated)
├── .env                               # Environment variables
├── .gitignore                         # Git ignore file
│
├── backend/                           # Backend code
│   ├── config/
│   │   ├── database.js               # Database configuration
│   │   └── multer.js                 # File upload configuration
│   │
│   ├── models/
│   │   ├── Award.js                  # Award model
│   │   ├── Ticket.js                 # Ticket model
│   │   ├── Submission.js             # Submission model
│   │   ├── User.js                   # User model (for future)
│   │   └── Newsletter.js             # Newsletter subscription model
│   │
│   ├── controllers/
│   │   ├── awardController.js        # Award CRUD operations
│   │   ├── ticketController.js       # Ticket CRUD operations
│   │   ├── submissionController.js   # Submission handling
│   │   ├── contactController.js      # Contact form handling
│   │   └── newsletterController.js   # Newsletter signup
│   │
│   ├── routes/
│   │   ├── api.js                    # Main API routes
│   │   ├── awards.js                 # Award routes
│   │   ├── tickets.js                # Ticket routes
│   │   ├── submissions.js            # Submission routes
│   │   ├── contact.js                # Contact routes
│   │   └── newsletter.js             # Newsletter routes
│   │
│   ├── middleware/
│   │   ├── auth.js                   # Authentication middleware
│   │   ├── validation.js             # Input validation
│   │   ├── errorHandler.js           # Error handling middleware
│   │   └── rateLimiter.js            # Rate limiting
│   │
│   ├── utils/
│   │   ├── emailService.js           # Email sending utility
│   │   ├── fileUpload.js             # File upload helper
│   │   ├── validationHelpers.js      # Validation helpers
│   │   └── constants.js              # App constants
│   │
│   └── seeds/
│       ├── awardsSeed.js             # Sample awards data
│       └── ticketsSeed.js            # Sample tickets data
│
├── frontend/                          # Frontend code
│   ├── index.html                    # Landing page
│   ├── immersive-africa.html         # Immersive Africa page
│   ├── awards.html                   # Awards page
│   ├── tickets.html                  # Tickets page
│   ├── programme.html                # Programme page
│   ├── about.html                    # About page
│   ├── 404.html                      # 404 error page
│   │
│   ├── css/
│   │   ├── main.css                  # Main stylesheet
│   │   ├── components.css            # Component styles
│   │   ├── animations.css            # Animation styles
│   │   ├── responsive.css            # Responsive design
│   │   └── variables.css             # CSS variables
│   │
│   ├── js/
│   │   ├── main.js                   # Main JavaScript
│   │   ├── lightning.js              # Lightning effect
│   │   ├── cursor.js                 # Custom cursor
│   │   ├── navigation.js             # Navigation handling
│   │   ├── awards.js                 # Awards page logic
│   │   ├── tickets.js                # Tickets page logic (peeling)
│   │   ├── immersive.js              # Immersive Africa logic
│   │   ├── forms.js                  # Form handling
│   │   ├── api.js                    # API calls
│   │   └── utils.js                  # Utility functions
│   │
│   ├── images/                        # Images from your public folder
│   │   ├── _C6A0500.JPG
│   │   ├── _MGL2775.jpg
│   │   ├── _MGL7139.jpg
│   │   ├── 8-Dotou-arbre-Fin.png
│   │   ├── Alby 2.png
│   │   ├── Copy of _MGL0176.jpg
│   │   ├── Copy of _MGL3584.jpg
│   │   ├── Copy of _MGL4129.jpg
│   │   ├── cyber1.png
│   │   ├── digital-dome-image-inside.jpg
│   │   ├── Fak_ugesi 2025-32.jpg
│   │   ├── FP01 Fak_ugesi Festival Poster.jpg
│   │   ├── IMG_8523 - Athanasius Johnson.png
│   │   ├── Joburg-planetarium-1-2022.jpg
│   │   ├── Screenshot-2024-05-21-at-21.36.37.webp
│   │   ├── VOF Voices of fire print - Joseph Dairo.jpg
│   │   ├── girl-hero.jpg
│   │   └── placeholder.jpg
│   │
│   ├── fonts/                         # Custom fonts
│   │   └── (font files if needed)
│   │
│   └── assets/
│       ├── icons/                     # SVG icons
│       │   ├── lightning.svg
│       │   ├── ticket.svg
│       │   ├── award.svg
│       │   └── social-icons.svg
│       │
│       └── videos/                    # Video assets
│           └── (video files if needed)
│
├── database/                          # Database files
│   ├── database.sqlite               # SQLite database file (auto-created)
│   └── migrations/                   # Database migrations
│       ├── 001_create_awards.sql
│       ├── 002_create_tickets.sql
│       ├── 003_create_submissions.sql
│       └── 004_create_newsletter.sql
│
├── uploads/                           # User uploaded files
│   ├── submissions/                  # Award submission files
│   │   ├── 2025/
│   │   └── 2026/
│   │
│   └── temp/                         # Temporary uploads
│
├── logs/                              # Application logs
│   ├── access.log
│   ├── error.log
│   └── app.log
│
└── tests/                             # Test files
    ├── unit/
    │   ├── models.test.js
    │   └── controllers.test.js
    │
    └── integration/
        └── api.test.js
```
