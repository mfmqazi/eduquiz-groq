// Groq API - Using LLaMA 3.3 70B for fast, high-quality question generation

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
    const apiKey = import.meta.env.VITE_GROQ_API_KEY;

    // Debug log to check if key exists (don't log the actual key)
    console.log("🔑 Groq API Key Status:", apiKey ? "Present" : "Missing");

    // If no API key, use fallback
    if (!apiKey || apiKey.includes("your_groq_api_key")) {
        console.warn("⚠️ No valid Groq API key. Using fallback.");
        return Array.from({ length: count }, () => generateFallbackQuestion(grade, subject, topic));
    }

    // Parallel Fetching Strategy
    // We fetch questions in small batches (size 1) in parallel to maximize speed.
    // Groq is extremely fast with LLaMA models, but parallel requests further reduce wait time.
    // Parallel requests reduce the total wait time to roughly the time of generating 1 question.

    const BATCH_SIZE = 1;
    const promises = [];

    console.log(`🚀 Starting parallel generation for ${count} questions with Groq...`);

    for (let i = 0; i < count; i += BATCH_SIZE) {
        const size = Math.min(BATCH_SIZE, count - i);
        promises.push(fetchBatch(apiKey, grade, subject, topic, size));
    }

    try {
        const results = await Promise.all(promises);
        // Flatten the array of arrays
        const allQuestions = results.flat();

        console.log(`✅ Successfully generated ${allQuestions.length} questions in parallel!`);
        return allQuestions;

    } catch (error) {
        console.error("❌ Error in parallel generation:", error);
        console.log("⚠️ Falling back to basic questions");
        return Array.from({ length: count }, () => generateFallbackQuestion(grade, subject, topic));
    }
}

async function fetchBatch(apiKey, grade, subject, topic, count) {
    try {
        // Add a random seed to ensure diversity across parallel requests
        const seed = Math.random().toString(36).substring(7);

        const prompt = `You are an expert educator and test designer creating high-quality exam preparation questions for US students.

Generate ${count} challenging, exam-style multiple-choice questions for:
- Grade Level: ${grade}
- Subject: ${subject}
- Topic: ${topic}
- Variation ID: ${seed} (Ensure questions are unique)

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
   - **ALWAYS wrap LaTeX environments** (like cases, matrices) in double dollar signs:
     $$ \\begin{cases} ... \\end{cases} $$
   - Use \\neq for "not equal": $x \\neq 2$
   - Use \\frac{numerator}{denominator} for fractions: $\\frac{3}{4}$ (NEVER use \\frac12)
   - **ALWAYS use braces {} for fractions**, e.g., $\\frac{1}{2}$, not $\\frac12$
   - Use ^ for exponents: $x^2$, $10^3$
   - Use _ for subscripts: $H_2O$
   - Use \\sqrt{} for square roots: $\\sqrt{16}$
   - Use \\cdot for multiplication: $2 \\cdot 3$
   - Use \\div for division: $6 \\div 2$
   - **DO NOT** put long sentences inside math delimiters. Only math symbols and numbers should be inside $.
   - Examples: 
     * "Solve $2x + 3 = 7$"
     * "Simplify $\\frac{x^2 - 4}{x - 2}$"
     * "Given $x \\neq 0$ and $y \\neq 3$"
     * "Calculate $\\sqrt{25} + 3^2$"

**JSON FORMATTING RULES:**
- Return ONLY valid JSON.
- **DOUBLE ESCAPE** all backslashes in LaTeX. Example: Use "\\\\frac" instead of "\\frac".
- Use "\\\\sqrt" instead of "\\sqrt".
- This is critical for the JSON to parse correctly.

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

        // Groq API call using OpenAI-compatible endpoint
        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
                model: 'llama-3.3-70b-versatile',
                messages: [
                    {
                        role: 'system',
                        content: 'You are an expert educator creating exam questions. Always respond with ONLY valid JSON - no markdown, no code blocks.'
                    },
                    {
                        role: 'user',
                        content: prompt
                    }
                ],
                temperature: 0.7,
                max_tokens: 2048,
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Groq API Error: ${errorData.error?.message || response.statusText}`);
        }

        const data = await response.json();

        if (!data.choices || !data.choices[0]?.message?.content) {
            throw new Error('Invalid Groq API response structure');
        }

        let text = data.choices[0].message.content;

        // --- ROBUST JSON CLEANING ---
        const cleanJSON = (str) => {
            // 1. Remove markdown
            let s = str.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

            // 2. Extract array
            const first = s.indexOf('[');
            const last = s.lastIndexOf(']');
            if (first !== -1 && last !== -1) {
                s = s.substring(first, last + 1);
            }

            // 3. Protect valid escapes
            const placeholders = {
                '\\\\': '___DOUBLE_BACKSLASH___',
                '\\"': '___ESCAPED_QUOTE___',
                '\\/': '___FORWARD_SLASH___'
            };

            for (const [key, val] of Object.entries(placeholders)) {
                s = s.split(key).join(val);
            }

            // 4. Escape any remaining backslashes
            s = s.replace(/\\/g, '\\\\');

            // 5. Restore placeholders
            for (const [key, val] of Object.entries(placeholders)) {
                s = s.split(val).join(key);
            }

            // 6. Fix specific common issues
            const commonCommands = ['frac', 'neq', 'sqrt', 'cdot', 'approx', 'leq', 'geq', 'infty'];

            commonCommands.forEach(cmd => {
                const regex = new RegExp(`([^a-zA-Z0-9\\\\])${cmd}(?![a-zA-Z])`, 'g');
                s = s.replace(regex, `$1\\\\${cmd}`);

                const startRegex = new RegExp(`^${cmd}(?![a-zA-Z])`);
                if (startRegex.test(s)) {
                    s = '\\\\' + s;
                }
            });

            // 7. Fix malformed fractions
            s = s.replace(/\\\\frac\s?(\d)(\d)/g, '\\\\frac{$1}{$2}');

            // 8. Fix JSON Syntax Errors
            s = s.replace(/,(\s*[\]}])/g, '$1');
            s = s.replace(/([{,]\s*)([a-zA-Z0-9_]+?)\s*:/g, '$1"$2":');

            return s;
        };

        const cleanedText = cleanJSON(text);

        let questions;
        try {
            questions = JSON.parse(cleanedText);
        } catch (parseError) {
            console.error("JSON Parse Error. Raw text:", text);
            console.error("Cleaned text:", cleanedText);
            throw parseError;
        }

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

        return validQuestions.slice(0, count);

    } catch (error) {
        console.error("Error in fetchBatch:", error);
        throw error; // Re-throw to be caught by Promise.all or handled above
    }
}
