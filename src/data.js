// Define the curriculum structure
const CURRICULUM = {
    subjects: ["Math", "Science", "English", "Social Studies", "Chemistry", "Biology"],
    topics: {
        "Math": ["Arithmetic", "Geometry", "Algebra", "Fractions", "Measurement"],
        "Science": ["Life Science", "Physical Science", "Earth Science", "Space", "Human Body"],
        "English": ["Grammar", "Vocabulary", "Reading Comprehension", "Spelling", "Writing"],
        "Social Studies": ["History", "Geography", "Civics", "Economics", "Culture"],
        "Chemistry": ["Atoms & Molecules", "Periodic Table", "Chemical Reactions", "Bonding", "States of Matter"],
        "Biology": ["Cells", "Genetics", "Ecology", "Evolution", "Human Anatomy"]
    }
};

// Helper to generate structure for all grades
const generateCurriculum = () => {
    const data = {};
    for (let i = 1; i <= 10; i++) {
        const grade = `Grade ${i}`;
        data[grade] = {};

        CURRICULUM.subjects.forEach(subject => {
            data[grade][subject] = {};
            // Add topics for each subject
            CURRICULUM.topics[subject].forEach(topic => {
                // We initialize with empty arrays, the QuestionGenerator will fill them
                data[grade][subject][topic] = [];
            });
        });
    }
    return data;
};

export const quizData = generateCurriculum();
