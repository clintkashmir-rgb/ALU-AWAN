# **App Name**: Awan Aluminum Manager

## Core Features:

- User Authentication & Access: Secure login for Owners and Staff using Firebase Authentication, managing different access levels.
- Master Data Management: Comprehensive module for creating, reading, updating, and deleting critical data such as sections, colors, thickness, and rates, serving as dropdown data for orders.
- Window Order Entry Form: Intuitive form to capture detailed window specifications, customer information, and automatically calculate square footage for each item as they are added to an order table.
- Automated Aluminum Calculations: Real-time calculation engine to determine total aluminum length and weight per section and for the entire order, utilizing dynamic formulas and master data values.
- Bill Summary & Pricing Module: An interactive interface to display the gross amount, allow manual discount entry, and compute the final net amount incorporating glass, hardware, labor, and additional charges.
- Invoice Generation & PDF Export: System to automatically generate unique invoice numbers, persist all invoice data to Firestore, and create a professional PDF invoice stored in Firebase Storage for sharing.
- AI Formula Assistant Tool: An AI-powered tool to suggest optimal cutting patterns and to validate the integrity and accuracy of custom calculation formulas used for material estimation.

## Style Guidelines:

- The visual scheme embraces a sophisticated dark mode to evoke professionalism and facilitate data legibility. The palette is inspired by the cool, sturdy tones of aluminum and precision engineering.
- Primary color: A mid-tone, desaturated blue-gray (#546C82), reflecting technology and reliability, ensuring strong contrast against a dark background.
- Background color: A very dark, almost charcoal gray with a subtle blue tint (#262B2F), providing a minimalist canvas that allows content to stand out.
- Accent color: A vibrant cyan (#33CCCE), analogous to the primary hue, used sparingly for interactive elements, highlights, and critical information to guide user attention.
- Body and headline font: 'Inter' (sans-serif) is chosen for its modern, neutral, and highly readable characteristics, ideal for data-dense applications and cross-platform consistency.
- Utilize a set of minimalist, line-based icons that align with a modern, industrial aesthetic, providing clear visual cues for navigation and actions without distraction.
- The layout is responsive and adaptable, optimized for both desktop and mobile browsers, ensuring an intuitive user experience. Data tables are designed for clarity and a sticky summary footer is implemented for mobile convenience, as requested.
- Subtle and purposeful animations are employed to provide feedback on user interactions, smooth data transitions, and a polished user interface experience.