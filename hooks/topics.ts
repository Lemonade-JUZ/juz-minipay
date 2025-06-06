import { useAtom } from "jotai"
import { atomWithStorage } from "jotai/utils"
import { shuffleArray } from "@/lib/arrays"

const COMMON_TOPICS = [
  "Sports",
  "Science",
  "Music",
  "History",
  "Geography",
  "Entertainment",
  "Art",
  "Technology",
  "Videogames",
  "Crypto",
  "Food",
  "Books",
  "Nature",
  "Movies",
  "TV Shows",
  "Mythology",
  "Space",
  "Animals",
]

const atomTriviaTopics = atomWithStorage(
  "juz.mini.atomTriviaTopics",
  COMMON_TOPICS
)

export const useCommonTriviaTopics = () => {
  const [triviaTopics, setTriviaTopics] = useAtom(atomTriviaTopics)

  // game topics are the first 3 topcis from the ideally shuffled trivia topics
  // this way we ensure topics change after each game session
  const gameTopics = triviaTopics.slice(0, 3) as [string, string, string]

  return {
    gameTopics,
    allTopics: COMMON_TOPICS,
    shuffleTopics: () => setTriviaTopics(shuffleArray(COMMON_TOPICS)),
  }
}
