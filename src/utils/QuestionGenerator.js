
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function shuffleArray(array) {
    return [...array].sort(() => Math.random() - 0.5);
}

// Better fallback generator
function generateFallbackQuestion(grade, subject, topic) {
    const gradeNum = parseInt(grade.replace("Grade ", "")) || 5;

    // Math Fallback (Real calculation)
    if (subject === "Math") {
        const isAdvanced = gradeNum > 5;
        const n1 = getRandomInt(2, isAdvanced ? 20 : 10);
        const n2 = getRandomInt(2, isAdvanced ? 20 : 10);

        let question, answer;

        if (topic.includes("Algebra") || isAdvanced) {
            // Generate: Solve for x: ax + b = c
            const x = getRandomInt(1, 10);
            const a = getRandomInt(2, 5);
            const b = getRandomInt(1, 20);
            const c = a * x + b;
            question = `Solve for $x$: $${a}x + ${b} = ${c}$`;
            answer = String(x);
        } else {
            // Basic Arithmetic
            question = `Calculate: $${n1} \\times ${n2}$`;
            answer = String(n1 * n2);
        }

        const options = new Set([answer]);
        while (options.size < 4) {
            const val = parseInt(answer) + getRandomInt(-5, 5);
            if (val !== parseInt(answer) && val > 0) options.add(String(val));
        }

        return {
            question,
            answer,
            options: shuffleArray(Array.from(options)),
            explanation: "This is a generated practice question."
        };
    }

    // Generic Fallback for other subjects
    return {
        question: `Which of the following is a key concept in ${grade} ${subject} - ${topic}?`,
        answer: "Critical Thinking",
        options: shuffleArray(["Critical Thinking", "Rote Memorization", "Random Guessing", "Ignoring Facts"]),
        explanation: "Critical thinking is essential for understanding this subject."
    };
}

export async function generateQuestions(grade, subject, topic, count = 5) {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

    // Debug log to check if key exists (don't log the actual key)
    console.log("🔑 API Key Status:", apiKey ? "Present" : "Missing");

    // If no API key, use fallback
    if (!apiKey || apiKey.includes("your_gemini_api_key")) {
        console.warn("⚠️ No valid Gemini API key. Using fallback.");
        return Array.from({ length: count }, () => generateFallbackQuestion(grade, subject, topic));
    }

    try {
        console.log(`🤖 Generating ${count} AI questions for ${grade} ${subject} - ${topic}...`);

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

        // Direct API call using fetch (more reliable than SDK in some environments)
        // Using gemini-2.0-flash as requested (matching Seerah App implementation)
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: prompt
                    }]
                }]
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`API Error: ${errorData.error?.message || response.statusText}`);
        }

        const data = await response.json();

        if (!data.candidates || !data.candidates[0]?.content?.parts?.[0]?.text) {
            throw new Error('Invalid API response structure');
        }

        let text = data.candidates[0].content.parts[0].text;

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
        console.error("❌ Error generating AI questions:");
        console.error("Error name:", error.name);
        console.error("Error message:", error.message);
        console.error("Full error:", error);
        console.log("⚠️ Falling back to basic questions");

        // Fallback
        return Array.from({ length: count }, () => generateFallbackQuestion(grade, subject, topic));
    }
}
