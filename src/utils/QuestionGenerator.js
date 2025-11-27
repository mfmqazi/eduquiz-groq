import { GoogleGenerativeAI } from "@google/generative-ai";

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function shuffleArray(array) {
    return [...array].sort(() => Math.random() - 0.5);
}

// Fallback generator for when API fails
function generateFallbackQuestion(grade, subject, topic) {
    const gradeNum = parseInt(grade.replace("Grade ", ""));

    if (subject === "Math") {
        const range = gradeNum <= 3 ? 20 : gradeNum <= 5 ? 50 : gradeNum <= 7 ? 100 : 500;
        const n1 = getRandomInt(1, range);
        const n2 = getRandomInt(1, range);

        const question = `What is ${n1} + ${n2}?`;
        const answer = String(n1 + n2);

        const options = new Set([answer]);
        const answerNum = parseInt(answer);

        while (options.size < 4) {
            const offset = getRandomInt(-15, 15);
            if (offset !== 0) {
                const wrongAnswer = answerNum + offset;
                if (wrongAnswer > 0) {
                    options.add(String(wrongAnswer));
                }
            }
        }

        return {
            question,
            answer,
            options: shuffleArray(Array.from(options)).slice(0, 4)
        };
    }

    return {
        question: `Sample question for ${subject} - ${topic}`,
        answer: "Answer A",
        options: shuffleArray(["Answer A", "Answer B", "Answer C", "Answer D"])
    };
}

export async function generateQuestions(grade, subject, topic, count = 5) {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

    // If no API key, use fallback
    if (!apiKey || apiKey === "your_gemini_api_key_here" || apiKey.trim() === "") {
        console.warn("⚠️ No Gemini API key found. Using fallback questions.");
        return Array.from({ length: count }, () => generateFallbackQuestion(grade, subject, topic));
    }

    try {
        console.log(`🤖 Generating ${count} AI questions for ${grade} ${subject} - ${topic}...`);

        const genAI = new GoogleGenerativeAI(apiKey);
        // Use the stable 1.5-flash model which is reliable and free
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = `You are an expert educator and test designer creating high-quality exam preparation questions for US students.

Generate ${count} challenging, exam-style multiple-choice questions for:
- Grade Level: ${grade}
- Subject: ${subject}
- Topic: ${topic}

CRITICAL REQUIREMENTS:
1. Questions MUST align with ${grade} US curriculum standards (Common Core, NGSS, etc.)
2. Difficulty should match real standardized tests for this grade level
3. Test deep conceptual understanding, critical thinking, and application
4. Include real-world scenarios and problem-solving where appropriate
5. Wrong answers should be plausible misconceptions students actually have
6. Avoid trivial recall questions - focus on understanding and analysis
7. Use proper academic language appropriate for ${grade}
8. **IMPORTANT**: For ALL mathematical expressions, use LaTeX notation:
   - Wrap inline math in single dollar signs: $x^2$
   - Wrap display math in double dollar signs: $$\\frac{a}{b}$$
   - Use \\neq for "not equal": $x \\neq 2$
   - Use \\frac{numerator}{denominator} for fractions: $\\frac{3}{4}$
   - Use ^ for exponents: $x^2$, $10^3$
   - Use _ for subscripts: $H_2O$
   - Use \\sqrt{} for square roots: $\\sqrt{16}$
   - Use \\cdot for multiplication: $2 \\cdot 3$
   - Use \\div for division: $6 \\div 2$
   - Examples: 
     * "Solve $2x + 3 = 7$"
     * "Simplify $\\frac{x^2 - 4}{x - 2}$"
     * "Given $x \\neq 0$ and $y \\neq 3$"
     * "Calculate $\\sqrt{25} + 3^2$"

For each question, provide:
- A clear, specific question that tests understanding
- 4 answer options (one correct, three plausible distractors)
- A brief explanation of the correct answer

Return ONLY valid JSON (no markdown, no code blocks, no extra text):
[
  {
    "question": "Clear, specific question text?",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "answer": "The correct option (must match exactly one of the options)",
    "explanation": "Why this answer is correct and what concept it tests"
  }
]`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        let text = response.text();

        // Robust JSON cleaning
        text = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
        // Find the first '[' and last ']' to ensure we only parse the array
        const firstBracket = text.indexOf('[');
        const lastBracket = text.lastIndexOf(']');
        if (firstBracket !== -1 && lastBracket !== -1) {
            text = text.substring(firstBracket, lastBracket + 1);
        }

        const questions = JSON.parse(text);

        // Validate structure
        if (!Array.isArray(questions) || questions.length === 0) {
            throw new Error("Invalid response structure");
        }

        // Validate each question
        const validQuestions = questions.filter(q =>
            q.question &&
            Array.isArray(q.options) &&
            q.options.length === 4 &&
            q.answer &&
            q.options.includes(q.answer)
        );

        if (validQuestions.length === 0) {
            throw new Error("No valid questions generated");
        }

        console.log(`✅ Successfully generated ${validQuestions.length} AI questions!`);
        return validQuestions.slice(0, count);

    } catch (error) {
        console.error("❌ Error generating AI questions:", error.message);
        console.log("⚠️ Falling back to basic questions");

        // Fallback
        return Array.from({ length: count }, () => generateFallbackQuestion(grade, subject, topic));
    }
}
