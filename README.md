# AI Choose Your Own Adventure

An immersive, AI-generated "Choose Your Own Adventure" web application built with Next.js, React, and Google's Gemini Flash 2.5. Every playthrough is a unique, dynamic narrative generated in real-time.

![Game Session Example](./public/favicon.ico)

## 📖 Overview

This application acts as a dynamic E-Book reader where you are the protagonist. It uses advanced prompting to generate thrilling, psychological-thriller narratives. At the end of every chapter, the AI evaluates your choices and generates three distinct actions you can take to influence the story's direction—each affecting your hidden "Health" or "Sanity" score.

If your health drops too low, the prose becomes more frantic and distorted, eventually leading to a dark conclusion. If you survive 12 chapters, you achieve victory.

## ✨ Features

- **Infinite Replayability**: Every session generates a brand new anthology, setting, and cast of characters using `gemini-2.5-flash`.
- **E-Book Interface**: A clean, distraction-free reading experience that mimics a true e-book.
- **Dynamic Text Scaling**: An interactive HUD allows you to adjust the font size on the fly for better accessibility, which realistically scales the chapter titles as well.
- **Swipe Gestures**: Built-in support for swiping left/right on touch devices to turn the pages, alongside clickable page-turn zones for desktop.
- **Hidden Story Mechanics**: The AI secretly tracks your sanity and alters the tone of the narrative based on the health impacts of your decisions.

## 🚀 Getting Started

### Prerequisites

You will need a Gemini API Key to run the narrative engine.

1. Get a key from [Google AI Studio](https://aistudio.google.com/).
2. Copy `.env.example` to `.env` and add your key:
```bash
GEMINI_API_KEY=your_api_key_here
```

### Installation

Clone the repository and install the dependencies:

```bash
git clone https://github.com/jimmymg-cpu/ai_choose_adventure.git
cd ai_choose_adventure
npm install
```

### Running the Development Server

Start the local server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to start your adventure.

## 🛠️ Technology Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS & Vanilla CSS (globals)
- **AI Integration**: `@google/genai` SDK with the `gemini-2.5-flash` model.
- **State Management**: Zustand
- **Animations**: Framer Motion
- **Icons**: Lucide React

## 📄 License

This project is open-source and available for educational and recreational use.
