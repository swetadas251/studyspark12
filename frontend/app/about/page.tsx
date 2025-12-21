'use client';

import { useState } from 'react';
import { Brain, Code, Heart, Github, Linkedin, Mail, ArrowLeft, Sparkles, Zap, Target, Coffee, Rocket } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function About() {
  const [imageError, setImageError] = useState(false);

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50">
      {/* This helps animate the background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      {/* This is the code for NAVIGATION */}
<nav className="relative z-10 flex justify-between items-center px-8 py-6 bg-white/70 backdrop-blur-md shadow-sm">
  <Link 
    href="/"
    className="flex items-center gap-2 px-4 py-2 hover:bg-gray-50 rounded-lg transition"
  >
    <ArrowLeft className="w-5 h-5" />
    Back to App
  </Link>
  <div className="flex items-center gap-3">
    <div className="relative w-20 h-20">
      <Image
        src="/logo.png"
        alt="StudySpark Logo"
        width={150}
        height={150}
        className="rounded-xl"
      />
    </div>
    <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
      StudySpark
    </span>
  </div>
</nav>

      {/* This is the top section for the about me page */}
      <section className="relative z-10 px-8 py-16 max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-200 to-yellow-300 px-4 py-2 rounded-full mb-6">
            <Sparkles className="w-5 h-5 text-yellow-700" />
            <span className="text-sm font-bold text-yellow-800">ABOUT THE PROJECT</span>
          </div>
          
          <h1 className="text-5xl font-black mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            The Story Behind StudySpark
          </h1>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            StudySpark was born out of late-night study sessions, overloaded tabs, 
            and the feeling that learning tools should do more. 
          </p>
        </div>

        {/* This part talks about the creator (Sweta) */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-8 mb-12">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Meet the Creator
              </h2>
              
              <div className="space-y-4">
                <p className="text-lg text-gray-700">
                  Hi! I'm <span className="font-bold">Sweta!</span> 
                </p>
                <p className="text-gray-600">
                  I’m a junior at Virginia Tech majoring in Computer Science, with minors 
                  in Human-Computer Interaction and Math. I’m passionate about AI and 
                  full-stack development, especially when it comes to building 
                  tools that actually help people.
                </p>
                <p className="text-gray-600">
                  This project brings together my love for education and technology. 
                  I wanted to create something that genuinely helps students learn smarter, 
                  not harder. AI felt like the perfect fit. Every feature here was designed 
                  based on real challenges I’ve faced as a student, and I hope it can make 
                  things a little easier for others too.
                </p>
                
                {/* This helps give all of Sweta's social links */}
<div className="flex gap-4 pt-4">
  <a 
    href="https://github.com/swetadas251" 
    target="_blank"
    rel="noopener noreferrer"
    className="p-3 bg-gray-100 rounded-full hover:bg-gray-200 transition group"
    title="GitHub"
  >
    <Github className="w-5 h-5 group-hover:text-blue-600 transition" />
  </a>
  <a 
    href="https://www.linkedin.com/in/sweta-das-aaa201314" 
    target="_blank"
    rel="noopener noreferrer"
    className="p-3 bg-gray-100 rounded-full hover:bg-gray-200 transition group"
    title="LinkedIn"
  >
    <Linkedin className="w-5 h-5 group-hover:text-blue-600 transition" />
  </a>
  <a 
    href="mailto:sweta.dass215@gmail.com"
    className="p-3 bg-gray-100 rounded-full hover:bg-gray-200 transition group"
    title="Email"
  >
    <Mail className="w-5 h-5 group-hover:text-blue-600 transition" />
  </a>
</div>
              </div>
            </div>
            
            {/* This is for the profile picture */}
<div className="flex justify-center">
  <div className="relative">
    <div className="w-80 h-100 rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-br from-blue-400 to-purple-600">
      {!imageError ? (
        <Image
          src="/profile.jpg" 
          alt="Sweta Das"
          width={320}  
          height={800} 
          className="w-full h-full object-cover"
          onError={() => setImageError(true)}
        />
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center text-white">
          <Coffee className="w-16 h-16 mb-4" />
          <p className="text-lg font-semibold">Your Photo Here!</p>
          <p className="text-sm opacity-75">Add profile.jpg to public folder</p>
        </div>
      )}
    </div>
  </div>
</div>
          </div>
        </div>

        {/* This informs the user of the technologies used */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-8 mb-12">
          <h2 className="text-3xl font-bold mb-8 text-center bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Tech Stack
          </h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            <TechCard 
              title="Frontend"
              items={["Next.js 14", "TypeScript", "Tailwind CSS", "Framer Motion", "Chart.js"]}
              icon={<Code className="w-6 h-6" />}
              color="from-blue-500 to-cyan-500"
            />
            <TechCard 
              title="Backend"
              items={["Node.js", "Express", "PostgreSQL", "JWT Auth", "OpenAI API"]}
              icon={<Zap className="w-6 h-6" />}
              color="from-purple-500 to-pink-500"
            />
            <TechCard 
              title="Features"
              items={["AI Explanations", "Smart Flashcards", "Interactive Quizzes", "Analytics Dashboard", "User Auth"]}
              icon={<Rocket className="w-6 h-6" />}
              color="from-orange-500 to-red-500"
            />
          </div>
        </div>

        {/* This lists some stats */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <StatCard number="5" label="AI Features" icon="🤖" />
          <StatCard number="3k+" label="API Calls/Month" icon="🚀" />
        </div>


        {/* This is to take user back to the main page */}
        <div className="text-center mt-12">
          <Link 
            href="/"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full font-semibold hover:shadow-xl transition text-lg"
          >
            Start Learning Now
            <ArrowLeft className="w-5 h-5 rotate-180" />
          </Link>
        </div>
      </section>

      <style jsx>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </main>
  );
}

// This sets up the technology cards 
function TechCard({ title, items, icon, color }: any) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition">
      <div className={`w-12 h-12 bg-gradient-to-br ${color} rounded-lg flex items-center justify-center text-white mb-4`}>
        {icon}
      </div>
      <h3 className="font-bold text-lg mb-3">{title}</h3>
      <ul className="space-y-2">
        {items.map((item: string, index: number) => (
          <li key={index} className="text-gray-600 flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

// This sets up the statistic cards
function StatCard({ number, label, icon }: any) {
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 text-center hover:shadow-xl transition">
      <div className="text-3xl mb-2">{icon}</div>
      <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
        {number}
      </div>
      <p className="text-gray-600">{label}</p>
    </div>
  );
}