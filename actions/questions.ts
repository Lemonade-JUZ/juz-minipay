"use server"

import { generateObject } from "ai"
import { z } from "zod"
import { shuffleArray } from "@/lib/arrays"
import { getModelForTask } from "@/lib/ai"

const QuestionListSchema = z.object({
  topic: z.string(),
  questions: z.array(
    z.object({
      question: z.string(),
      options: z.array(z.string()),
    })
  ),
})

export const generateQuestionsForTopic = async (
  lang: "English" | "Spanish",
  topic: string,
  amount: number
) => {
  const { object } = await generateObject({
    model: getModelForTask(),
    schema: QuestionListSchema,
    prompt: `
Generate a list of ${amount} questions about "${topic}".
- Each question should have 3 options.
- Correct option should be in the list of options.
- There can only be 1 (ONE) correct option.
- The correct option should be the first element in the list.
- The questions should be fun and interesting - for trivia or quiz games.
- The questions should be in ${lang}.
- Options should be in ${lang}.
- Options should be in the format: ["option1", "option2", "option3"]
- Options should be short: 6 words max.
`,
  })

  // The prompt wasn't giving me good "random" position results and for 3 elements
  // most of the time the "correct" option was the first one so was ass easy to get points.
  const questions = object.questions.map(({ options, question }) => {
    // Prompt has to give FIRST element as correct now
    const correctOptionContent = options[0]
    const shuffledOptions = shuffleArray(options)

    return {
      question,
      options: shuffledOptions,
      correctOptionIndex: shuffledOptions.indexOf(correctOptionContent),
    }
  })

  return {
    questions,
    topic: object.topic,
  }
}
