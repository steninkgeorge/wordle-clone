'use client';

import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import {
  endingMessage,
  getFailMessage,
  getToast,
  getTodaysWord,
} from '../constants/word-list';
import { Grid, GridRef } from './grid';
import { updatestats } from '@/lib/server-actions';
import { countFrequency, HintProps } from '@/lib/frequency-count';
import { useGameState } from '../hooks/game-state';
import { ShimmerGrid } from './shimmer-grid';
import { HowToPlay } from './onboarding';
import { useKeyboardState } from '../hooks/keyboard-state';
import { toast } from 'sonner';
import { useGameStats } from '../hooks/gameStats';

export interface BoardRef {
  scrollToHint: () => void;
}

export const Board = forwardRef<BoardRef>((_, ref) => {
  const gridRef = useRef<GridRef>(null);

  useImperativeHandle(ref, () => ({
    scrollToHint: () => {
      gridRef.current?.scrollToHint();
    },
  }));

  const { updateKeyState } = useKeyboardState();
  const {
    userId,
    guesses,
    isInitialized,
    makeGuess,
    currentLine,
    currentGuess,
    setCurrentGuess,
    gameStatus,
    setGameStatus,
  } = useGameState();

  const stats = useGameStats();
  const [word, setWord] = useState('');
  const [frequencyMap, setFrequencyMap] = useState(new Map<string, number>());

  const [Hint, SetHint] = useState<HintProps>({
    vowel: undefined,
    consonant: undefined,
  });

  const styledWord = `The word was "<span class="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent font-bold">${word.toUpperCase()}</span>`;

  const handleEnter = useCallback(
    async (guess: string) => {
      if (gameStatus !== 'playing' && gameStatus !== 'paused') return;
      console.log('handle enter');
      makeGuess(guess);
      updateKeyState(guess, word);
      const message = getToast(currentLine);
      const failmessage = getFailMessage();
      setTimeout(() => {
        if (guess === word) {
          setGameStatus('won');

          toast.success(`You've guessed it right!🎉`, {
            description: (
              <span>
                <span className="bg-gradient-to-r from-green-500 to-cyan-600 bg-clip-text text-transparent font-medium text-[14px] italic">
                  {message.replace(
                    /[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu,
                    ''
                  )}
                </span>
                <span>
                  {message
                    .match(
                      /[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu
                    )
                    ?.join(' ')}
                </span>
              </span>
            ),
            className: '!text-green-800 !bg-green-50',
            duration: 8000,
          });
          updatestats(userId!, true);
          stats.updateGameStat();
        } else if (currentLine + 1 >= 6) {
          setGameStatus('lost');
          toast.error(failmessage, {
            description: (
              <span
                className="italic"
                dangerouslySetInnerHTML={{ __html: styledWord }}
              />
            ),
            className:
              '!bg-gradient-to-br !from-amber-50 !to-yellow-100 !text-gray-800 !border !border-amber-200 shadow-md',
            duration: 8000,
            icon: false,
          });
          updatestats(userId!, false);
          stats.updateGameStat();
        } else {
          setGameStatus('playing');
        }
      }, 1500);
    },
    [currentLine, word, guesses, gameStatus]
  );

  useEffect(() => {
    if (gameStatus === 'won' || gameStatus === 'lost') {
      toast.success(``, {
        description: (
          <span>
            <span className="bg-gradient-to-r from-green-500 to-teal-500 bg-clip-text text-transparent font-medium text-[14px]">
              {endingMessage}
            </span>{' '}
            😇
          </span>
        ),
        className: '!text-green-800 !bg-green-50',
      });

      return;
    }
    const res = getTodaysWord();
    setWord(res);
    const { frequencyMap, hint } = countFrequency(res, Hint);
    setFrequencyMap(frequencyMap);
    SetHint(hint);
    if (guesses && res) {
      guesses.slice(0, currentLine).forEach((guess) => {
        if (guess) {
          updateKeyState(guess, res);
        }
      });
    }

    //check if uuid exist in local storage
  }, [isInitialized]);

  useEffect(() => {
    if (gameStatus !== 'playing' && gameStatus !== 'paused') return;

    const handleType = (event: KeyboardEvent) => {
      switch (event.key) {
        case 'Enter':
          if (currentGuess.length === 5) {
            handleEnter(currentGuess);
            setGameStatus('paused');
          }
          break;

        case 'Backspace':
          setCurrentGuess(currentGuess.slice(0, -1));
          break;

        default:
          if (
            currentGuess.length < 5 &&
            /^[a-zA-Z]$/.test(event.key) &&
            gameStatus === 'playing'
          ) {
            setCurrentGuess(currentGuess + event.key);
          }
          break;
      }
    };
    window.addEventListener('keydown', handleType);

    return () => {
      window.removeEventListener('keydown', handleType);
    };
  }, [currentGuess, gameStatus, currentLine]);

  if (!isInitialized) {
    return <ShimmerGrid />;
  }
  return (
    <div>
      <HowToPlay />
      <Grid
        ref={gridRef}
        guesses={guesses}
        Hint={Hint}
        word={word}
        currentLine={currentLine}
        currentGuess={currentGuess}
        frequencyMap={frequencyMap}
      />
    </div>
  );
});

Board.displayName = 'Board';
