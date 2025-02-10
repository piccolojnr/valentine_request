# Valentine's Request Creator 💝

A beautiful, interactive web application for creating and sharing personalized Valentine's requests. Built with React, TypeScript, and Supabase, featuring elegant animations and a modern UI.

## ✨ Features

### Core Functionality
- 🎨 Create personalized Valentine's requests with custom messages
- 🎵 Background music selection with playback controls
- 🎁 Virtual gift selection
- 💌 Real-time request status tracking
- 🔄 Interactive accept/decline animations
- 🌈 Multiple romantic themes to choose from

### Technical Features
- 🔧 Real-time updates using Supabase subscriptions
- 📱 Responsive design for all devices
- 🎭 Framer Motion animations
- 🎨 Tailwind CSS styling
- 🔊 Audio integration with Howler.js
- 🌐 Social sharing capabilities

## 🛠️ Tech Stack

- **Frontend Framework**: React with TypeScript
- **Styling**: Tailwind CSS
- **Database**: Supabase
- **Animations**: Framer Motion
- **Audio**: Howler.js
- **Routing**: React Router
- **UI Components**: Radix UI
- **State Management**: React Hooks

## 📦 Project Structure
src/
├── components/
│ ├── CreateRequest.tsx # Request creation form
│ ├── ViewRequest.tsx # Request viewing page
│ ├── PreviewRequest.tsx # Share preview page
│ ├── RequestStatus.tsx # Status tracking page
│ └── RequestWrapper.tsx # Navigation wrapper
├── lib/
│ ├── supabase.ts # Supabase client configuration
│ ├── themes.ts # Theme configurations
│ └── utils.ts # Utility functions
└── styles/
└── globals.css # Global styles

## 🚀 Getting Started

1. **Clone the repository**

bash
git clone [repository-url]
cd valentine-request-creator

2. **Install dependencies**
bash
npm install


3. **Set up environment variables**
Create a `.env` file:
env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

4. **Start the development server**

## 🎨 Themes

The application includes several romantic themes:
- Classic Romance
- Midnight Passion
- Enchanted Garden
- Golden Sunset

Each theme features:
- Custom gradient backgrounds
- Themed images
- Color palettes
- Matching music selections

## 🎵 Music Library

Includes a curated selection of romantic background music:
- Midnight Glow
- Midnight Rain
- Under the Moonlight
- Starry Whisper
- Whispering Secrets
- Whispers in the Dark

## 🔐 Database Schema

sql
CREATE TABLE valentine_requests (
id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
sender_name text NOT NULL,
recipient_name text NOT NULL,
message text NOT NULL,
custom_message text,
gift text NOT NULL,
theme text NOT NULL,
music text,
accepted boolean DEFAULT false,
created_at timestamptz DEFAULT now(),
updated_at timestamptz DEFAULT now()
);

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Images from Unsplash
- Music by Eternal Garden
- Icons from Lucide Icons
- UI Components from Shadcn/ui

## 🔮 Future Enhancements

- [ ] Custom theme creator
- [ ] More virtual gift options
- [ ] Advanced privacy settings
- [ ] Request expiration functionality
- [ ] Enhanced social sharing features
- [ ] Offline support
- [ ] Request analytics
- [ ] Interactive elements