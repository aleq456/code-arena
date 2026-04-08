// Uses Claude AI to generate a fresh coding problem for every duel
// This means no two duels will ever have the same problem!

export async function generateProblem(difficulty: "EASY" | "MEDIUM" | "HARD") {
  
  const prompt = `Generate a coding problem for a competitive programming duel.

Difficulty: ${difficulty}

Respond with ONLY a JSON object, no markdown, no backticks, exactly like this:
{
  "title": "Problem Title",
  "description": "Clear problem description in 2-3 sentences",
  "examples": "Input: example1\\nOutput: result1\\nExplanation: why\\n\\nInput: example2\\nOutput: result2",
  "constraints": "1 <= n <= 10^4\\nOther constraints here",
  "test_cases": [
    {"input": "test input 1", "expected_output": "expected 1"},
    {"input": "test input 2", "expected_output": "expected 2"},
    {"input": "test input 3", "expected_output": "expected 3"}
  ],
  "starter_code": {
    "javascript": "function solution(input) {\\n  // Your code here\\n}",
    "python": "def solution(input):\\n    # Your code here\\n    pass"
  }
}

Rules:
- The problem must be solvable with a single function called solution()
- Input is always a single string that the function receives
- Output must be deterministic (same input always gives same output)
- Test cases must be correct
- For EASY: simple loops/math/strings
- For MEDIUM: arrays/hashmaps/basic algorithms  
- For HARD: trees/graphs/dynamic programming`

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1000,
      messages: [{ role: "user", content: prompt }]
    })
  })

  const data = await response.json()
  
  // Extract the text response
  const text = data.content?.[0]?.text || ""
  
  // Parse the JSON response
  const clean = text.replace(/```json|```/g, "").trim()
  const problem = JSON.parse(clean)
  
  return problem
}
