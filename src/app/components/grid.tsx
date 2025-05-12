import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Line } from "./grid-row";

interface HintProps {
  consonant: string | undefined;
  vowel: string | undefined;
}

export const Grid = ({
    guesses, Hint, word , currentLine , currentGuess, frequencyMap
}:{guesses: string[], Hint:HintProps, word: string , currentLine : number , currentGuess : string , frequencyMap: Map<string , number>})=>{
    return (
      <div className="relative min-h-screen min-w-screen max-w-5xl mx-auto p-4 items-center ">
        <div className="flex md:flex-row flex-col items-center justify-center gap-10">
          <div className="board w-full max-w-md mx-auto md:mx-0 items-center ">
            {guesses.map((guess, index) => (
              <Line
                key={index}
                guessItem={index === currentLine ? currentGuess : guess}
                word={word}
                isSubmitted={index < currentLine}
                frequencyMap={frequencyMap}
              />
            ))}

            {/* <OnScreenKeyboard/> */}
          </div>
          <div className=" md:absolute mt-10 md:right-10 md:top-[30%] w-full md:max-w-72 border border-neutral-600 h-fit rounded-lg ">
            <Accordion type="multiple" className="w-full space-y-2">
              <AccordionItem
                value="consonant"
                className="border-0 rounded-lg overflow-hidden"
              >
                <AccordionTrigger className="px-4 hover:no-underline">
                  Show a consonant?
                </AccordionTrigger>
                <AccordionContent>
                  <p className="font-semibold text-lg flex item-center pl-10">
                    {Hint.consonant}
                  </p>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem
                value="vowel"
                className=" rounded-lg overflow-hidden"
              >
                <AccordionTrigger className="px-4 hover:no-underline">
                  Show a vowel?
                </AccordionTrigger>
                <AccordionContent>
                  <p className="font-semibold text-lg item-cneter flex pl-10">
                    {Hint.vowel ? Hint.vowel : "No vowel"}
                  </p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </div>
    );
}