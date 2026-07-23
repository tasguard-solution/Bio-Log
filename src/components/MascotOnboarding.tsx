import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const ONBOARDING_STEPS = [
  {
    targetId: 'tour-welcome',
    title: "Hi, I'm Mac!",
    message: "I'm your friendly neighborhood macrophage. Welcome to Bio Log! Let me show you around.",
    position: 'bottom' as const
  },
  {
    targetId: 'tour-encyclopedia',
    title: "Encyclopedia",
    message: "Here you can read detailed, interactive notes on all biology topics.",
    position: 'right' as const
  },
  {
    targetId: 'tour-visualization',
    title: "3D Visualizations",
    message: "This is the coolest part! Explore cells and organs in interactive 3D.",
    position: 'left' as const
  },
  {
    targetId: 'tour-past-questions',
    title: "Past Questions",
    message: "Test your knowledge with WAEC past questions when you're ready.",
    position: 'right' as const
  },
  {
    targetId: 'tour-progress',
    title: "Track Your XP",
    message: "Level up your DNA progress bar by visiting topics and completing quizzes. Good luck!",
    position: 'left' as const
  }
];

export function MascotOnboarding() {
  const [isVisible, setIsVisible] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);

  useEffect(() => {
    const hasSeen = localStorage.getItem('hasSeenBioLogOnboarding');
    if (!hasSeen) {
      // Small delay to let the dashboard render
      const timer = setTimeout(() => setIsVisible(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    const updatePosition = () => {
      const step = ONBOARDING_STEPS[currentStep];
      if (step?.targetId) {
        const el = document.getElementById(step.targetId);
        if (el) {
          setTargetRect(el.getBoundingClientRect());
        } else {
          // Fallback if element not found, just show in center
          setTargetRect(null);
        }
      }
    };

    updatePosition();
    window.addEventListener('resize', updatePosition);
    // Use capture phase to catch scroll events on any child container
    window.addEventListener('scroll', updatePosition, true);

    // Initial scroll into view for the step
    const step = ONBOARDING_STEPS[currentStep];
    if (step?.targetId) {
      const el = document.getElementById(step.targetId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }

    return () => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition, true);
    };
  }, [currentStep, isVisible]);

  if (!isVisible) return null;

  const handleNext = () => {
    if (currentStep < ONBOARDING_STEPS.length - 1) {
      setCurrentStep(s => s + 1);
    } else {
      finishTour();
    }
  };

  const finishTour = () => {
    localStorage.setItem('hasSeenBioLogOnboarding', 'true');
    setIsVisible(false);
  };

  const step = ONBOARDING_STEPS[currentStep];
  
  // Calculate Mascot positioning
  let top = '50%';
  let left = '50%';
  let transform = 'translate(-50%, -50%)';
  let layoutDirection = 'row';

  if (targetRect) {
    const margin = 20; // Distance from target
    if (step.position === 'bottom') {
      top = `${targetRect.bottom + margin}px`;
      left = `${targetRect.left + targetRect.width / 2}px`;
      transform = 'translate(-50%, 0)';
    } else if (step.position === 'right') {
      top = `${targetRect.top + targetRect.height / 2}px`;
      left = `${targetRect.right + margin}px`;
      transform = 'translate(0, -50%)';
    } else if (step.position === 'left') {
      top = `${targetRect.top + targetRect.height / 2}px`;
      left = `${targetRect.left - margin}px`;
      transform = 'translate(-100%, -50%)';
      layoutDirection = 'row-reverse';
    }
  }

  // Handle small screens by falling back to center
  if (window.innerWidth < 640 && targetRect) {
    top = '50%';
    left = '50%';
    transform = 'translate(-50%, -50%)';
    layoutDirection = 'row';
  }

  let tailClasses = '';
  if (window.innerWidth < 640 || !targetRect) {
    tailClasses = 'bottom-6 -left-2 border-b border-l'; // Point to Mac on mobile
  } else if (step.position === 'bottom') {
    tailClasses = '-top-2 left-1/2 -translate-x-1/2 border-t border-l'; // Point UP
  } else if (step.position === 'right') {
    tailClasses = 'top-1/2 -translate-y-1/2 -left-2 border-b border-l'; // Point LEFT
  } else if (step.position === 'left') {
    tailClasses = 'top-1/2 -translate-y-1/2 -right-2 border-t border-r'; // Point RIGHT
  }

  return (
    <>
      {/* Target Box Border */}
      {targetRect && window.innerWidth >= 640 && (
        <div 
          className="fixed z-40 pointer-events-none border-[3px] border-secondary/80 rounded-2xl transition-all duration-500 ease-out"
          style={{
            top: targetRect.top - 8,
            left: targetRect.left - 8,
            width: targetRect.width + 16,
            height: targetRect.height + 16,
            boxShadow: '0 0 0 9999px rgba(0,0,0,0.5)'
          }}
        />
      )}
      
      {/* Mobile fallback dark overlay */}
      {window.innerWidth < 640 && (
        <div className="fixed inset-0 z-40 pointer-events-none shadow-[0_0_0_9999px_rgba(0,0,0,0.5)]" />
      )}

      {/* Mascot & Dialog */}
      <div 
        className="fixed z-50 flex items-end gap-4 transition-all duration-700 ease-out"
        style={{ top, left, transform, flexDirection: layoutDirection as any }}
      >
        {/* The Dialog Bubble */}
        <div className="bg-surface border border-outline-variant rounded-2xl p-5 shadow-2xl w-72 mb-4 animate-in fade-in zoom-in duration-500 relative">
          {/* Bubble tail */}
          <div 
            className={`absolute w-4 h-4 bg-surface border-outline-variant rotate-45 ${tailClasses}`}
          />
          
          <button 
            onClick={finishTour}
            className="absolute top-3 right-3 text-on-surface-variant hover:text-on-surface transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
          
          <h3 className="font-serif text-lg font-bold text-primary mb-2">{step.title}</h3>
          <p className="text-sm text-on-surface-variant leading-relaxed mb-4">
            {step.message}
          </p>
          
          <div className="flex items-center justify-between mt-4 relative z-10">
            <span className="text-xs font-mono text-outline font-medium">
              Step {currentStep + 1} of {ONBOARDING_STEPS.length}
            </span>
            <button 
              onClick={handleNext}
              className="px-4 py-2 bg-primary text-on-primary rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity shadow-sm"
            >
              {currentStep === ONBOARDING_STEPS.length - 1 ? 'Got it!' : 'Next →'}
            </button>
          </div>
        </div>

        {/* Mac the Macrophage Image */}
        <div className="w-24 h-24 sm:w-32 sm:h-32 shrink-0 animate-bounce" style={{ animationDuration: '3s' }}>
          <img 
            src="/mac_mascot.png" 
            alt="Mac Mascot" 
            className="w-full h-full object-contain drop-shadow-[0_10px_15px_rgba(34,197,94,0.3)]"
          />
        </div>
      </div>
    </>
  );
}
