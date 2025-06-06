import { createOpenAI } from "@ai-sdk/openai"

export const openai = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  compatibility: "strict", // strict mode, enable when using the OpenAI API
})

export const GPT41Mini = openai("gpt-4.1-mini-2025-04-14")
export const GPT41Nano = openai("gpt-4.1-nano-2025-04-14")

const getRandomModel = () => {
  // Randomly weigh the models, we prefer Nano over Mini,

  const sample = Math.random()

  if (sample < 0.98) return GPT41Nano // 98%
  return GPT41Mini // 2%
}

export const getModelForTask = () => {
  const model = getRandomModel()
  return console.log({ model: model.modelId }), model
}
