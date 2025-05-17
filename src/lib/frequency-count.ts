const vowels = ["a", "e", "i", "o", "u"];

export interface HintProps {
  consonant: string | undefined;
  vowel: string | undefined;
}

export function countFrequency(word: string, hint: HintProps) {
  const frequencyMap: Map<string, number> = new Map();
  const wordLower = word.toLowerCase();

  for (let i = 0; i < word.length; i++) {
    const char = wordLower[i];
    if (char === undefined) continue;
    if (vowels.includes(char) && hint.vowel === undefined) {
      hint.vowel = char;
    }

    if (!vowels.includes(char) && hint.consonant === undefined) {
      hint.consonant = char;
    }

    const current = frequencyMap.get(char) || 0;
    frequencyMap.set(char, current + 1);
  }

  return { frequencyMap, hint };
}
