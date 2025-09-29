---
title: "FoodManager (PantryCraft)"
description: "A web application that helps users manage their ingredients efficiently and generate AI-powered recipe suggestions based on available items. Built with React.js, MongoDB, and OpenAI API to reduce food waste and simplify meal planning."
imageUrl: "/content/projects/foodmanager.jpg"
tags:
  [
    "Web Development",
    "AI Integration",
    "Food Management",
    "React.js",
    "MongoDB",
    "OpenAI",
  ]
technologies:
  - category: "frontend"
    name: "React.js"
  - category: "frontend"
    name: "Material-UI"
  - category: "frontend"
    name: "React Router"
  - category: "backend"
    name: "Node.js"
  - category: "backend"
    name: "Express.js"
  - category: "database"
    name: "MongoDB"
  - category: "ai"
    name: "OpenAI API"
  - category: "backend"
    name: "Axios"
  - category: "ai"
    name: "TensorFlow"
links:
  github: "https://github.com/WintonGee/FoodManager"
  report: "https://drive.google.com/file/d/1ez2tc4DKTKrDWslWheUKjhegmqm7X7P7/view?usp=sharing"
status: "completed"
featured: true
date:
  start: "2023-01-01"
  end: "2023-05-31"
metrics:
  performance: "AI-powered recipe suggestions"
  impact: "Reduced food waste through efficient ingredient management"
  scale: "Full-stack web application with database integration"
challenges:
  - "Integrating OpenAI API for intelligent recipe suggestions"
  - "Designing intuitive user interface for ingredient management"
  - "Implementing responsive design for mobile and desktop"
  - "Database schema design for flexible ingredient storage"
solutions:
  - "Leveraged OpenAI's GPT models for contextual recipe generation"
  - "Used Material-UI components for consistent, modern design"
  - "Implemented React Router for seamless navigation"
  - "Designed flexible MongoDB schema for ingredient categorization"
learnings:
  - "Importance of AI integration in practical applications"
  - "User experience design for food management systems"
  - "Full-stack development with modern JavaScript frameworks"
  - "Database design for flexible data storage"
---

## Project Overview

FoodManager (PantryCraft) is a comprehensive web application designed to solve common problems related to meal planning and ingredient management. The application helps users track their pantry items, reduce food waste, and discover new recipes based on available ingredients using AI-powered suggestions.

## Problem Statement

Many people face challenges in:

- Keeping track of ingredients in their pantry, fridge, and storage areas
- Planning meals with available ingredients
- Reducing food waste due to forgotten or expired items
- Finding creative recipes with limited ingredients

## Technical Implementation

### Frontend Architecture

- **Framework**: React.js with functional components and hooks
- **UI Library**: Material-UI for consistent, modern design
- **Routing**: React Router for single-page application navigation
- **State Management**: React Context API for global state
- **HTTP Client**: Axios for API communication

### Backend Architecture

- **Runtime**: Node.js with Express.js framework
- **Database**: MongoDB for flexible ingredient and recipe storage
- **API Design**: RESTful API endpoints for CRUD operations
- **Authentication**: JWT-based user authentication
- **AI Integration**: OpenAI API for intelligent recipe suggestions

### Key Features

#### Ingredient Management

- **Add Ingredients**: Easy-to-use interface for adding pantry items
- **Categorization**: Organize ingredients by type, location, and expiration
- **Search & Filter**: Quick ingredient lookup and filtering
- **Expiration Tracking**: Monitor ingredient freshness and expiration dates

#### AI-Powered Recipe Suggestions

- **Smart Recommendations**: OpenAI GPT models analyze available ingredients
- **Contextual Suggestions**: Recipes based on dietary preferences and restrictions
- **Ingredient Substitution**: AI suggests alternatives for missing ingredients
- **Nutritional Information**: Basic nutritional data for suggested recipes

#### User Experience

- **Responsive Design**: Optimized for desktop and mobile devices
- **Intuitive Interface**: Clean, modern design with Material Design principles
- **Real-time Updates**: Instant ingredient updates and recipe suggestions
- **Offline Support**: Basic functionality without internet connection

## Technical Architecture

### Database Schema

```javascript
// Ingredient Schema
{
  name: String,
  category: String,
  location: String, // pantry, fridge, freezer
  quantity: Number,
  unit: String,
  expirationDate: Date,
  addedDate: Date,
  userId: ObjectId
}

// Recipe Schema
{
  name: String,
  ingredients: [String],
  instructions: [String],
  cookingTime: Number,
  difficulty: String,
  tags: [String],
  aiGenerated: Boolean
}
```

### API Endpoints

- `GET /api/ingredients` - Retrieve user's ingredients
- `POST /api/ingredients` - Add new ingredient
- `PUT /api/ingredients/:id` - Update ingredient
- `DELETE /api/ingredients/:id` - Remove ingredient
- `POST /api/recipes/suggest` - Get AI recipe suggestions
- `GET /api/recipes` - Retrieve saved recipes

### AI Integration

The application leverages OpenAI's GPT models to:

- Analyze available ingredients
- Generate contextual recipe suggestions
- Provide cooking instructions
- Suggest ingredient substitutions
- Offer dietary alternatives

## Development Process

### Phase 1: Foundation

- Set up React.js frontend with Material-UI
- Implement basic ingredient CRUD operations
- Design MongoDB schema and API endpoints

### Phase 2: AI Integration

- Integrate OpenAI API for recipe suggestions
- Implement intelligent ingredient matching
- Add contextual recipe generation

### Phase 3: User Experience

- Implement responsive design
- Add advanced filtering and search
- Optimize performance and user interactions

### Phase 4: Advanced Features

- Add expiration tracking and notifications
- Implement recipe saving and favorites
- Add nutritional information integration

## Future Enhancements

### Computer Vision Integration

- **Receipt Scanning**: Automatically add ingredients from grocery receipts
- **Object Detection**: Use camera to identify ingredients
- **Barcode Scanning**: Quick ingredient addition via barcode

### Advanced AI Features

- **Meal Planning**: Weekly meal plan generation
- **Shopping Lists**: Automatic shopping list creation
- **Nutritional Analysis**: Detailed nutritional breakdown
- **Dietary Restrictions**: Advanced filtering for allergies and preferences

### Social Features

- **Recipe Sharing**: Share recipes with friends and family
- **Community Recipes**: Browse community-contributed recipes
- **Cooking Challenges**: Gamified cooking experiences

## Technical Challenges and Solutions

### Challenge 1: AI Integration Complexity

**Problem**: Integrating OpenAI API while maintaining good user experience
**Solution**: Implemented caching for common requests and fallback responses for API failures

### Challenge 2: Database Performance

**Problem**: Efficient querying of ingredients and recipes
**Solution**: Implemented proper indexing and aggregation pipelines for complex queries

### Challenge 3: Responsive Design

**Problem**: Ensuring consistent experience across devices
**Solution**: Used Material-UI's responsive grid system and custom breakpoints

### Challenge 4: Real-time Updates

**Problem**: Keeping ingredient lists synchronized
**Solution**: Implemented optimistic updates with error handling and rollback

## Impact and Results

### User Benefits

- **Reduced Food Waste**: Better ingredient tracking and usage
- **Simplified Meal Planning**: AI-powered recipe suggestions
- **Time Savings**: Quick ingredient lookup and meal ideas
- **Cost Efficiency**: Better utilization of available ingredients

### Technical Achievements

- **Full-Stack Integration**: Seamless frontend-backend communication
- **AI Integration**: Successful implementation of OpenAI API
- **Database Design**: Flexible schema for various ingredient types
- **User Experience**: Intuitive interface with modern design principles

## Lessons Learned

### Technical Insights

- **AI Integration**: Importance of proper API key management and error handling
- **Database Design**: Value of flexible schemas for evolving requirements
- **User Experience**: Critical role of intuitive design in food management apps
- **Performance**: Need for efficient data loading and caching strategies

### Development Process

- **Iterative Development**: Value of building core features first
- **User Testing**: Importance of testing with real users early in development
- **Documentation**: Need for comprehensive API and component documentation
- **Version Control**: Benefits of proper Git workflow for team collaboration

## Project Repository

The complete source code is available on GitHub: [FoodManager Repository](https://github.com/WintonGee/FoodManager)

A detailed project report is available: [Project Report](https://drive.google.com/file/d/1ez2tc4DKTKrDWslWheUKjhegmqm7X7P7/view?usp=sharing)
