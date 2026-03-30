const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function generateRecipes(ingredients, userPreference) {
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

  const prompt = `You are a professional chef and nutritionist. 
I have these ingredients: ${ingredients.join(', ')}.
${userPreference ? `My preference: ${userPreference}` : ''}

Suggest exactly 3 recipes I can make. For each recipe, respond in this exact JSON format:
[
  {
    "name": "Recipe Name",
    "ingredients": ["ingredient 1 with amount", "ingredient 2 with amount"],
    "steps": ["Step 1 description", "Step 2 description"],
    "cookTime": "25 min",
    "difficulty": "Easy",
    "calories": 420,
    "protein": "35g",
    "fat": "12g",
    "carbs": "48g",
    "tags": ["High protein", "Gluten free"],
    "matchNote": "Matched your preference: spicy and quick"
  }
]

Rules:
- Prioritize recipes that use the most of my available ingredients
- If I mentioned a preference, make sure recipes match it
- Include accurate nutritional estimates
- Keep steps clear and beginner-friendly
- Return ONLY the JSON array, no extra text`;

  const result = await model.generateContent(prompt);
  const text = result.response.text();

  // Clean up the response — remove markdown code blocks if present
  const cleaned = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
  return JSON.parse(cleaned);
}

module.exports = { generateRecipes };