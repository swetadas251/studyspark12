'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight, RotateCw } from 'lucide-react';

interface FlashcardDeckProps {
  cards: string;
}

export default function FlashcardDeck({ cards }: FlashcardDeckProps) {
  const [currentCard, setCurrentCard] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  
  // Parse the cards
  const cardList = cards.split('\n\n').map(card => {
    const [q, a] = card.split('\nA:');
    return {
      question: q?.replace('Q:', '').trim() || '',
      answer: a?.trim() || ''
    };
  }).filter(card => card.question);

  const nextCard = () => {
    setIsFlipped(false);
    setCurrentCard((prev) => (prev + 1) % cardList.length);
  };

  const prevCard = () => {
    setIsFlipped(false);
    setCurrentCard((prev) => (prev - 1 + cardList.length) % cardList.length);
  };

  if (cardList.length === 0) return <div>No flashcards generated</div>;

  return (
    <div className="flex flex-col items-center space-y-6">
      {/* Progress indicator */}
      <div className="flex space-x-2">
        {cardList.map((_, index) => (
          <div
            key={index}
            className={`h-2 w-8 rounded-full transition-all ${
              index === currentCard 
                ? 'bg-blue-600 w-12' 
                : index < currentCard 
                ? 'bg-green-400' 
                : 'bg-gray-300'
            }`}
          />
        ))}
      </div>

      {/* Flashcard */}
      <div className="relative w-full max-w-lg h-64">
        <div
          className={`absolute inset-0 w-full h-full transition-all duration-500 preserve-3d cursor-pointer ${
            isFlipped ? 'rotate-y-180' : ''
          }`}
          onClick={() => setIsFlipped(!isFlipped)}
          style={{ transformStyle: 'preserve-3d' }}
        >
          {/* Front of card */}
          <div className="absolute inset-0 w-full h-full backface-hidden">
            <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-xl p-8 flex flex-col justify-center items-center text-white">
              <div className="text-xs uppercase tracking-wide mb-4 opacity-75">Question {currentCard + 1}</div>
              <div className="text-xl font-semibold text-center">{cardList[currentCard].question}</div>
              <div className="mt-6 text-sm opacity-75 flex items-center gap-2">
                <RotateCw className="w-4 h-4" />
                Click to reveal answer
              </div>
            </div>
          </div>

          {/* Back of card */}
          <div className="absolute inset-0 w-full h-full rotate-y-180 backface-hidden">
            <div className="w-full h-full bg-gradient-to-br from-green-500 to-teal-600 rounded-2xl shadow-xl p-8 flex flex-col justify-center items-center text-white">
              <div className="text-xs uppercase tracking-wide mb-4 opacity-75">Answer</div>
              <div className="text-lg text-center">{cardList[currentCard].answer}</div>
              <div className="mt-6 text-sm opacity-75 flex items-center gap-2">
                <RotateCw className="w-4 h-4" />
                Click to flip back
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center gap-4">
        <button
          onClick={prevCard}
          className="p-3 bg-gray-200 hover:bg-gray-300 rounded-full transition"
          disabled={cardList.length <= 1}
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        
        <span className="text-lg font-medium">
          {currentCard + 1} / {cardList.length}
        </span>
        
        <button
          onClick={nextCard}
          className="p-3 bg-gray-200 hover:bg-gray-300 rounded-full transition"
          disabled={cardList.length <= 1}
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      <style jsx>{`
        .preserve-3d {
          transform-style: preserve-3d;
        }
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
        .backface-hidden {
          backface-visibility: hidden;
        }
      `}</style>
    </div>
  );
}