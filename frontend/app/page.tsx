'use client';

import { useState, useEffect } from 'react';
import { Brain, Sparkles, BookOpen, Target, Zap, ArrowRight, Star, Lightbulb, Rocket, Trophy, RotateCw, ChevronLeft, ChevronRight, Check, X, TrendingUp, LogOut, User as UserIcon } from 'lucide-react';
import ParticleBackground from './components/ParticleBackground';
import AuthModal from './components/AuthModal';
import Link from 'next/link';
import Image from 'next/image';

type Flashcard = {
  question: string;
  answer: string;
};

export default function Home() {
  const [activeTab, setActiveTab] = useState('explain');
  const [input, setInput] = useState('');
  const [result, setResult] = useState<any>('');
  const [loading, setLoading] = useState(false);
  
  // Auth states
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [user, setUser] = useState<any>(null);
  
  // Flashcard state
  const [currentCard, setCurrentCard] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  
  // Quiz state
  const [selectedAnswers, setSelectedAnswers] = useState<{[key: number]: string}>({});
  const [showResults, setShowResults] = useState(false);

  // Check if user is logged in
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  // Track analytics
  const trackAnalytics = async (topic: string, type: string) => {
    try {
      const token = localStorage.getItem('token');
      
      // Only track if user is logged in
      if (token) {
        await fetch('http://localhost:3001/api/analytics/track', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            topic: topic || input,
            type: type,
            duration: 0,
            timestamp: new Date().toISOString()
          })
        });
      }
    } catch (error) {
      console.error('Failed to track analytics:', error);
    }
  };

  const handleSubmit = async () => {
    if (!input) return;
    
    setLoading(true);
    setResult('');
    setCurrentCard(0);
    setIsFlipped(false);
    setSelectedAnswers({});
    setShowResults(false);
    
    try {
      let endpoint = '';
      switch(activeTab) {
        case 'explain':
          endpoint = '/api/ai/explain';
          break;
        case 'notes':
          endpoint = '/api/ai/study-notes';
          break;
        case 'flashcards':
          endpoint = '/api/ai/flashcards';
          break;
        case 'quiz':
          endpoint = '/api/ai/generate-quiz';
          break;
      }

      const body = activeTab === 'explain' 
        ? { concept: input }
        : { topic: input };

      const response = await fetch(`http://localhost:3001${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      
      const data = await response.json();
      
      // Track analytics if user is logged in
      if (user) {
        await trackAnalytics(input, activeTab);
      }
      
      if (activeTab === 'explain') {
        setResult(data.explanation || 'No explanation generated');
      } else if (activeTab === 'notes') {
        setResult(data.notes || 'No notes generated');
      } else if (activeTab === 'flashcards') {
        setResult(data.flashcards || 'No flashcards generated');
      } else if (activeTab === 'quiz') {
        setResult(data.questions || 'No quiz generated');
      }
    } catch (error) {
      setResult('⚠️ Error: Make sure your backend is running on port 3001!');
    }
    setLoading(false);
  };

  // Parse flashcards
  const parseFlashcards = (): Flashcard[] => {
    if (!result || activeTab !== 'flashcards') return [];
    
    const cards = result.split('\n\n').map((card: string) => {
      const lines = card.split('\n');
      const question = lines.find((l: string) => l.startsWith('Q:'))?.replace('Q:', '').trim() || '';
      const answer = lines.find((l: string) => l.startsWith('A:'))?.replace('A:', '').trim() || '';
      return { question, answer };
    }).filter((card: Flashcard) => card.question);
    
    return cards;
  };

  const flashcards = parseFlashcards();

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50">
      <ParticleBackground />
      
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      <nav className="relative z-10 flex justify-between items-center px-8 py-6 bg-white/70 backdrop-blur-md shadow-sm">
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
        <div className="flex gap-4 items-center">
          {user && (
            <Link 
              href="/analytics"
              className="px-4 py-2 text-gray-600 hover:text-blue-600 transition flex items-center gap-2"
            >
              <TrendingUp className="w-4 h-4" />
              Analytics
            </Link>
          )}
          <Link 
  href="/about"
  className="px-4 py-2 text-gray-600 hover:text-blue-600 transition"
>
  About
</Link>
          
          {user ? (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full">
                <UserIcon className="w-4 h-4 text-gray-600" />
                <span className="text-gray-700 font-medium">{user.username}</span>
              </div>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowAuthModal(true)}
              className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full hover:shadow-lg transition"
            >
              Sign Up Free
            </button>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 px-8 py-16 max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-200 to-yellow-300 px-4 py-2 rounded-full mb-6">
            <Sparkles className="w-5 h-5 text-yellow-700" />
            <span className="text-sm font-bold text-yellow-800">AI-POWERED LEARNING</span>
          </div>
          
          <h1 className="text-7xl font-black mb-6">
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Study Smarter,
            </span>
            <br />
            <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Not Harder
            </span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Turn any topic into customized study 
            tools in seconds.
          </p>
        </div>

        {/* Feature Tabs */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8 max-w-4xl mx-auto">
          {/* Tab Buttons */}
          <div className="flex gap-2 mb-8 flex-wrap justify-center">
            <button
              onClick={() => {
                setActiveTab('explain');
                setResult('');
              }}
              className={`px-6 py-3 rounded-xl font-semibold transition ${
                activeTab === 'explain' 
                  ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <Lightbulb className="inline w-4 h-4 mr-2" />
              Explain Simply
            </button>
            <button
              onClick={() => {
                setActiveTab('notes');
                setResult('');
              }}
              className={`px-6 py-3 rounded-xl font-semibold transition ${
                activeTab === 'notes' 
                  ? 'bg-gradient-to-r from-green-500 to-teal-500 text-white shadow-lg' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <BookOpen className="inline w-4 h-4 mr-2" />
              Study Notes
            </button>
            <button
              onClick={() => {
                setActiveTab('flashcards');
                setResult('');
              }}
              className={`px-6 py-3 rounded-xl font-semibold transition ${
                activeTab === 'flashcards' 
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <Zap className="inline w-4 h-4 mr-2" />
              Flashcards
            </button>
            <button
              onClick={() => {
                setActiveTab('quiz');
                setResult('');
                setSelectedAnswers({});
                setShowResults(false);
              }}
              className={`px-6 py-3 rounded-xl font-semibold transition ${
                activeTab === 'quiz' 
                  ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <Trophy className="inline w-4 h-4 mr-2" />
              Quiz Me
            </button>
          </div>

          {/* Input Area */}
          <div className="mb-6">
            <div className="flex gap-3">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
                placeholder={
                  activeTab === 'explain' ? "What concept should I explain? (e.g., 'black holes')" :
                  activeTab === 'notes' ? "What topic do you want notes for? (e.g., 'photosynthesis')" :
                  activeTab === 'flashcards' ? "Create flashcards about... (e.g., 'DNA')" :
                  "Generate a quiz about... (e.g., 'gravity')"
                }
                className="flex-1 px-6 py-4 border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-blue-500 text-lg"
              />
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl hover:shadow-xl transition disabled:opacity-50 flex items-center gap-2 font-semibold"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <Rocket className="w-5 h-5" />
                    Generate
                  </>
                )}
              </button>
            </div>
            
            {/* Guest Mode Notice */}
{!user && (
  <div className="mt-4 p-4 bg-yellow-50 rounded-xl border border-yellow-200">
    <p className="text-sm text-yellow-800">
      You're using guest mode.
      <button 
        onClick={() => setShowAuthModal(true)}
        className="ml-1 font-semibold text-blue-600 hover:underline"
      >
        Sign up
      </button>{' '}
      to save your progress and see analytics!
    </p>
  </div>
)}
          </div>

          {/* Result Area - ALL TABS */}
          {result && (
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 max-h-[500px] overflow-y-auto">
              {/* Explain Tab */}
              {activeTab === 'explain' && (
                <div className="prose prose-blue max-w-none">
                  <div className="text-lg leading-relaxed text-gray-800">
                    {typeof result === 'string' ? result : 'Please generate new content'}
                  </div>
                </div>
              )}

              {/* Study Notes Tab */}
              {activeTab === 'notes' && (
                <div className="space-y-4">
                  <div className="bg-white rounded-xl p-6 shadow-sm">
                    <div className="whitespace-pre-wrap text-gray-800 leading-relaxed">
                      {typeof result === 'string' ? result : 'Please generate new study notes'}
                    </div>
                  </div>
                </div>
              )}

              {/* Flashcards Tab */}
              {activeTab === 'flashcards' && flashcards.length > 0 && (
                <div className="flex flex-col items-center space-y-6">
                  {/* Progress dots */}
                  <div className="flex space-x-2">
                    {flashcards.map((_flashcard: any, index: number) => (
                      <div
                        key={index}
                        className={`h-2 rounded-full transition-all ${
                          index === currentCard 
                            ? 'bg-purple-600 w-8' 
                            : 'bg-gray-300 w-2'
                        }`}
                      />
                    ))}
                  </div>

                  {/* Flashcard */}
                  <div 
                    className="relative w-full max-w-lg h-64 cursor-pointer"
                    onClick={() => setIsFlipped(!isFlipped)}
                  >
                    <div className={`absolute inset-0 w-full h-full transition-all duration-500 transform-style-preserve-3d ${
                      isFlipped ? 'rotate-y-180' : ''
                    }`}>
                      {/* Front */}
                      <div className="absolute inset-0 w-full h-full backface-hidden">
                        <div className="w-full h-full bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl shadow-xl p-8 flex flex-col justify-center items-center text-white">
                          <div className="text-xs uppercase tracking-wide mb-4 opacity-75">
                            Question {currentCard + 1} of {flashcards.length}
                          </div>
                          <div className="text-xl font-semibold text-center">
                            {flashcards[currentCard]?.question}
                          </div>
                          <RotateCw className="w-5 h-5 mt-6 opacity-50" />
                        </div>
                      </div>
                      
                      {/* Back */}
                      <div className="absolute inset-0 w-full h-full rotate-y-180 backface-hidden">
                        <div className="w-full h-full bg-gradient-to-br from-green-500 to-teal-600 rounded-2xl shadow-xl p-8 flex flex-col justify-center items-center text-white">
                          <div className="text-xs uppercase tracking-wide mb-4 opacity-75">Answer</div>
                          <div className="text-lg text-center">
                            {flashcards[currentCard]?.answer}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Navigation */}
                  <div className="flex items-center gap-4">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsFlipped(false);
                        setCurrentCard(Math.max(0, currentCard - 1));
                      }}
                      className="p-2 bg-white rounded-full shadow-md hover:shadow-lg transition"
                      disabled={currentCard === 0}
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsFlipped(false);
                        setCurrentCard(Math.min(flashcards.length - 1, currentCard + 1));
                      }}
                      className="p-2 bg-white rounded-full shadow-md hover:shadow-lg transition"
                      disabled={currentCard === flashcards.length - 1}
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              )}

              {/* Quiz Tab - Interactive */}
              {activeTab === 'quiz' && result && (
                <div className="space-y-6">
                  {(() => {
                    let questions: any[] = [];
                    
                    // Parse questions
                    try {
                      if (Array.isArray(result)) {
                        questions = result;
                      } else if (typeof result === 'string') {
                        const jsonMatch = result.match(/\[[\s\S]*\]/);
                        if (jsonMatch) {
                          questions = JSON.parse(jsonMatch[0]);
                        }
                      }
                    } catch (e) {
                      console.error('Failed to parse quiz:', e);
                      return (
                        <div className="bg-white rounded-xl p-6 shadow-sm">
                          <div className="whitespace-pre-wrap text-gray-800">{result}</div>
                        </div>
                      );
                    }

                    if (questions.length === 0) {
                      return <div>No questions generated. Try again!</div>;
                    }

                    return (
                      <>
                        {!showResults ? (
                          <>
                            {/* Questions */}
                            {questions.map((q: any, qIndex: number) => (
                              <div key={qIndex} className="bg-white rounded-xl p-6 shadow-sm">
                                <div className="mb-4">
                                  <span className="text-sm font-semibold text-purple-600">
                                    Question {qIndex + 1} of {questions.length}
                                  </span>
                                  <h3 className="text-lg font-semibold mt-2 text-gray-800">
                                    {q.question}
                                  </h3>
                                </div>
                                
                                <div className="space-y-3">
                                  {q.options?.map((option: string, oIndex: number) => (
                                    <button
                                      key={oIndex}
                                      onClick={() => {
                                        setSelectedAnswers({
                                          ...selectedAnswers,
                                          [qIndex]: oIndex.toString()
                                        });
                                      }}
                                      className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                                        selectedAnswers[qIndex] === oIndex.toString()
                                          ? 'border-purple-500 bg-purple-50'
                                          : 'border-gray-200 hover:border-gray-300'
                                      }`}
                                    >
                                      <span className="font-medium mr-3">
                                        {String.fromCharCode(65 + oIndex)}.
                                      </span>
                                      {option}
                                    </button>
                                  ))}
                                </div>
                              </div>
                            ))}
                            
                            {/* Submit Button */}
                            <button
                              onClick={() => setShowResults(true)}
                              disabled={Object.keys(selectedAnswers).length !== questions.length}
                              className={`w-full py-4 rounded-xl font-semibold transition ${
                                Object.keys(selectedAnswers).length === questions.length
                                  ? 'bg-gradient-to-r from-green-500 to-teal-500 text-white'
                                  : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                              }`}
                            >
                              Submit Quiz ({Object.keys(selectedAnswers).length}/{questions.length})
                            </button>
                          </>
                        ) : (
                          <>
                            {/* Results */}
                            <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl p-6 text-center">
                              <Trophy className="w-16 h-16 mx-auto mb-4" />
                              <h2 className="text-2xl font-bold mb-2">Quiz Complete!</h2>
                              <p className="text-4xl font-black">
                                {questions.filter((q: any, i: number) => 
                                  parseInt(selectedAnswers[i]) === q.correct
                                ).length} / {questions.length}
                              </p>
                              <p className="text-lg mt-2">
                                Score: {Math.round(
                                  (questions.filter((q: any, i: number) => 
                                    parseInt(selectedAnswers[i]) === q.correct
                                  ).length / questions.length) * 100
                                )}%
                              </p>
                            </div>
                            
                            {/* Review */}
                            {questions.map((q: any, qIndex: number) => {
                              const userAnswer = parseInt(selectedAnswers[qIndex]);
                              const isCorrect = userAnswer === q.correct;
                              
                              return (
                                <div key={qIndex} className="bg-white rounded-xl p-6 shadow-sm">
                                  <div className="flex justify-between mb-4">
                                    <h3 className="text-lg font-semibold">{q.question}</h3>
                                    {isCorrect ? (
                                      <Check className="w-6 h-6 text-green-600" />
                                    ) : (
                                      <X className="w-6 h-6 text-red-600" />
                                    )}
                                  </div>
                                  
                                  <div className="space-y-2">
                                    {q.options?.map((option: string, oIndex: number) => (
                                      <div
                                        key={oIndex}
                                        className={`p-3 rounded-lg border-2 ${
                                          q.correct === oIndex
                                            ? 'border-green-500 bg-green-50'
                                            : userAnswer === oIndex && !isCorrect
                                            ? 'border-red-500 bg-red-50'
                                            : 'border-gray-200'
                                        }`}
                                      >
                                        {String.fromCharCode(65 + oIndex)}. {option}
                                        {q.correct === oIndex && ' ✓'}
                                      </div>
                                    ))}
                                  </div>
                                  
                                  {q.explanation && (
                                    <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                                      <p className="text-sm text-blue-800">
                                        <strong>Explanation:</strong> {q.explanation}
                                      </p>
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                            
                            <button
                              onClick={() => {
                                setSelectedAnswers({});
                                setShowResults(false);
                                setResult('');
                              }}
                              className="w-full py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-semibold"
                            >
                              Try Another Quiz
                            </button>
                          </>
                        )}
                      </>
                    );
                  })()}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-4 gap-6 mt-16">
          <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl text-center hover:shadow-xl transition">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Brain className="w-8 h-8 text-white" />
            </div>
            <h3 className="font-bold text-lg mb-2">AI-Powered</h3>
            <p className="text-gray-600 text-sm">Smart content generation</p>
          </div>
          
          <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl text-center hover:shadow-xl transition">
            <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Zap className="w-8 h-8 text-white" />
            </div>
            <h3 className="font-bold text-lg mb-2">Instant Results</h3>
            <p className="text-gray-600 text-sm">Get materials in seconds</p>
          </div>
          
          <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl text-center hover:shadow-xl transition">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Target className="w-8 h-8 text-white" />
            </div>
            <h3 className="font-bold text-lg mb-2">Personalized</h3>
            <p className="text-gray-600 text-sm">Tailored to your needs</p>
          </div>
          
          <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl text-center hover:shadow-xl transition">
            <div className="w-16 h-16 bg-gradient-to-br from-pink-400 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Star className="w-8 h-8 text-white" />
            </div>
            <h3 className="font-bold text-lg mb-2">Free Forever</h3>
            <p className="text-gray-600 text-sm">No credit card required</p>
          </div>
        </div>
      </section>

      {/* Auth Modal */}
      <AuthModal 
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={(user) => {
          setUser(user);
          setShowAuthModal(false);
        }}
      />

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
        .transform-style-preserve-3d {
          transform-style: preserve-3d;
        }
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
        .backface-hidden {
          backface-visibility: hidden;
        }
      `}</style>
    </main>
  );
}