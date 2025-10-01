# 🖼️ React Image Annotation Tool

A powerful, web-based image annotation tool built with React that allows you to annotate images with points, rectangles, and polygons. Perfect for computer vision projects, data labeling, and image analysis.

![React](https://img.shields.io/badge/React-18.2.0-blue)
![License](https://img.shields.io/badge/License-MIT-green)
![GitHub](https://img.shields.io/badge/GitHub-MAXONXOXO-lightgrey)

## ✨ Features

- **🖱️ Multiple Annotation Tools**
  - Point annotations
  - Rectangle/box annotations
  - Polygon annotations (click to add points, double-click to finish)
  - Select tool for future enhancements

- **🔍 View Controls**
  - Mouse wheel zoom in/out
  - Middle mouse button panning
  - Reset view functionality
  - Real-time zoom percentage display

- **💾 Export Functionality**
  - Export annotations as JSON
  - Sequential annotation IDs (1, 2, 3, ...)
  - Structured data format

- **🎨 User-Friendly Interface**
  - Clean, intuitive toolbar
  - Visual feedback during drawing
  - Responsive design
  - Keyboard and mouse controls

## 🚀 Quick Start

### Prerequisites
- Node.js (version 14 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/MAXONXOXO/my-annotation-app.git
   cd my-annotation-app
Install dependencies

bash
npm install
Start the development server

bash
npm start
Open your browser
Navigate to http://localhost:3000

🎯 How to Use
Basic Annotation
Upload an image using the "Upload Image" button

Select a tool from the toolbar:

Rectangle: Click and drag to draw bounding boxes

Point: Click to place points

Polygon: Click to add vertices, double-click to complete

Select: For future selection functionality

View Controls
Zoom: Scroll mouse wheel up/down

Pan: Hold middle mouse button and drag

Reset View: Click "Reset View" button

Exporting Annotations
Create annotations on your image

Click "Export Annotations" button

Download the JSON file with all annotation data

📁 Project Structure
```
my-annotation-app/
├── public/
│   ├── index.html
│   └── favicon.ico
├── src/
│   ├── components/
│   │   ├── AnnotationCanvas.js  # Main canvas component
│   │   ├── Toolbar.js          # Tool selection
│   │   ├── ImageUpload.js      # File upload handling
│   │   └── ExportButton.js     # JSON export functionality
│   ├── App.js                  # Main application component
│   ├── App.css                 # Application styles
│   └── index.js                # React entry point
└── package.json
```
🛠️ Technical Details
Built With
React 18 - Frontend framework

HTML5 Canvas - Drawing and rendering

CSS3 - Styling and layout

JavaScript ES6+ - Application logic

Annotation Data Format
json
```
{
  "exportDate": "2024-01-15T10:30:00.000Z",
  "imageId": "local-image",
  "annotations": [
    {
      "id": "1",
      "type": "rectangle",
      "x": 100,
      "y": 150,
      "width": 200,
      "height": 120,
      "color": "#ff0000",
      "fill": "rgba(255, 0, 0, 0.1)"
    },
    {
      "id": "2",
      "type": "point",
      "x": 300,
      "y": 200,
      "color": "#ff0000"
    }
  ]
}
```
🎮 Controls Reference
Action	Method
Upload Image	Click "Upload Image" button
Draw Rectangle	Select rectangle tool → Click and drag
Draw Point	Select point tool → Click
Draw Polygon	Select polygon tool → Click points → Double-click to finish
Zoom	Mouse wheel scroll
Pan	Middle mouse button + drag
Reset View	Click "Reset View" button
Export	Click "Export Annotations" button
🔧 Development
Available Scripts
npm start - Runs development server

npm test - Launches test runner

npm run build - Creates production build

npm run eject - Ejects from Create React App

Contributing
Fork the repository

Create a feature branch (git checkout -b feature/amazing-feature)

Commit your changes (git commit -m 'Add amazing feature')

Push to the branch (git push origin feature/amazing-feature)

Open a Pull Request

🚧 Future Enhancements
Annotation editing and deletion

Multiple annotation classes/categories

Custom colors for different annotation types

Image batch processing

Backend integration for data persistence

Collaboration features

Annotation validation

Keyboard shortcuts

Measurement tools

📝 License
This project is licensed under the MIT License - see the LICENSE file for details.

👨‍💻 Author
MAXONXOXO

GitHub: @MAXONXOXO

Project: React Image Annotation Tool

🙏 Acknowledgments
Built with Create React App

Inspired by VGG Image Annotator (VIA)

Icons and UI patterns from modern web standards

⭐ If you find this project useful, please give it a star!


