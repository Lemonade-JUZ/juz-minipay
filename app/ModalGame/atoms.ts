"use client"

import useSWR from "swr"
import { generateQuestionsForTopic } from "@/actions/questions"

/**
 * A custom hook to fetch game questions based on a topic.
 * We use SWR for data fetching and caching.
 */
export const useGameQuestions = (
  cacheKey: string | null,
  config: {
    topic?: string
    questionCount: number
  }
) => {
  const topic = config?.topic

  const { data, ...query } = useSWR(
    cacheKey,
    async (): Promise<
      Awaited<ReturnType<typeof generateQuestionsForTopic>>
    > => {
      if (!topic) return {} as any
      return await generateQuestionsForTopic(
        "English",
        topic,
        config.questionCount
      )
    },
    {
      // Keep staled data until key changes
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  )

  return {
    data: {
      questions: data?.questions || [],
      translatedTopic: data?.topic || topic,
    },
    ...query,
  }
}
