export function Line({
  guessItem,
  word,
  isSubmitted,
  frequencyMap,
}: {
  isSubmitted: boolean;
  guessItem: string;
  word: string;
  frequencyMap: Map<string, number>;
}) {
  const tile = [];
  const localMap = new Map<string, number>(frequencyMap);
  let state = "absent";

  let animate: undefined | "flip";
  for (let i = 0; i < 5; i++) {
    const char = guessItem[i];

    let isEmpty = false;

    if (char === undefined) {
      isEmpty = true;
    }

    if (char && isSubmitted) {
      if (localMap.has(char) && word[i] === char) {
        state = "correct";
        const current = localMap.get(char) || 0;
        if (current <= 1) {
          localMap.delete(char);
        } else {
          localMap.set(char, current - 1);
        }
      } else if (localMap.has(char)) {
        state = "present";
        const current = localMap.get(char) || 0;
        if (current <= 1) {
          localMap.delete(char);
        } else {
          localMap.set(char, current - 1);
        }
      } else {
        state = "incorrect";
      }

      animate = "flip";
    }

    tile.push(
      <div
        key={i}
        className={`tile ${isEmpty ? "empty" : ""} ${state} ${animate} ${
          animate ? `flip-${i}` : ""
        }`}
      >
        {char}
      </div>
    );
  }

  return <div className="line">{tile}</div>;
}
