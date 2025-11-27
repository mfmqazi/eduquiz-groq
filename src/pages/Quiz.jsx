import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { generateQuestions } from '../utils/QuestionGenerator';
import { db } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';
import { CheckCircle, XCircle, AlertCircle, Save, RotateCcw, Home } from 'lucide-react';
import { TextWithMath } from '../components/MathText';

export default function Quiz() {
    const [searchParams] = useSearchParams();
    const grade = searchParams.get('grade');
    const subject = searchParams.get('subject');
    const topic = searchParams.get('topic');
    const navigate = useNavigate();
    const { currentUser } = useAuth();

    const [questions, setQuestions] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState('');
    const [score, setScore] = useState(0);
    const [showResult, setShowResult] = useState(false);
    const [answers, setAnswers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        async function loadQuestions() {
            if (grade && subject && topic) {
                try {
                    setLoading(true);
                    setError('');
                    // Use the generator instead of static data
                    const generatedQuestions = await generateQuestions(grade, subject, topic, 5);
                    if (generatedQuestions && generatedQuestions.length > 0) {
                        setQuestions(generatedQuestions);
                    } else {
                        setError("Sorry, no questions available for this topic yet.");
                        setTimeout(() => navigate('/'), 2000);
                    }
                } catch (err) {
                    console.error("Error loading questions:", err);
                    setError("Failed to load questions. Redirecting...");
                    setTimeout(() => navigate('/'), 2000);
                } finally {
                    setLoading(false);
                }
            } else {
                navigate('/');
            }
        }

        loadQuestions();
    }, [grade, subject, topic, navigate]);

    function handleAnswerSelect(option) {
        setSelectedAnswer(option);
    }

    function handleNextQuestion() {
        const currentQuestion = questions[currentQuestionIndex];
        const isCorrect = selectedAnswer === currentQuestion.answer;

        if (isCorrect) {
            setScore(prev => prev + 1);
        }

        setAnswers([...answers, {
            question: currentQuestion.question,
            selected: selectedAnswer,
            correct: currentQuestion.answer,
            isCorrect
        }]);

        const nextIndex = currentQuestionIndex + 1;
        if (nextIndex < questions.length) {
            setCurrentQuestionIndex(nextIndex);
            setSelectedAnswer('');
        } else {
            finishQuiz(isCorrect ? score + 1 : score);
        }
    }

    async function finishQuiz(finalScore) {
        setShowResult(true);
        try {
            await addDoc(collection(db, "results"), {
                userId: currentUser.uid,
                grade,
                subject,
                topic,
                score: finalScore,
                totalQuestions: questions.length,
                date: new Date().toISOString()
            });
        } catch (error) {
            console.error("Error saving result:", error);
        }
    }


    if (loading) {
        return (
            <div className="text-center mt-20">
                <div className="glass-panel inline-block px-8 py-6 bg-white/60 border-white/50">
                    <div className="text-indigo-900 text-xl mb-2 font-bold">Generating your unique quiz...</div>
                    <div className="text-slate-500 text-sm">This may take a few seconds</div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center mt-20">
                <div className="glass-panel inline-block px-8 py-6 bg-white/60 border-white/50">
                    <div className="text-red-500 text-xl mb-2 font-bold">{error}</div>
                    <div className="text-slate-500 text-sm">Redirecting to dashboard...</div>
                </div>
            </div>
        );
    }

    if (questions.length === 0) {
        return (
            <div className="text-center mt-20">
                <div className="glass-panel inline-block px-8 py-6 bg-white/60 border-white/50">
                    <div className="text-yellow-600 text-xl font-bold">No questions available</div>
                </div>
            </div>
        );
    }


    if (showResult) {
        const percentage = Math.round((score / questions.length) * 100);
        let message = "Good effort!";
        let colorClass = "text-yellow-500";

        if (percentage >= 80) {
            message = "Excellent work!";
            colorClass = "text-green-500";
        } else if (percentage < 50) {
            message = "Keep practicing!";
            colorClass = "text-red-500";
        }

        return (
            <div className="max-w-2xl mx-auto mt-10">
                <div className="glass-panel text-center animate-fade-in bg-white/80 border-white/60 shadow-xl">
                    <h2 className="text-3xl font-bold mb-2 text-slate-800">Quiz Completed!</h2>
                    <p className="text-slate-500 mb-8 font-medium">{grade} • {subject} • {topic}</p>

                    <div className="mb-8">
                        <div className={`text-6xl font-bold mb-2 ${colorClass}`}>{percentage}%</div>
                        <p className="text-xl text-slate-700 font-medium">{message}</p>
                        <p className="text-slate-500 mt-2">You scored {score} out of {questions.length}</p>
                    </div>

                    <div className="flex justify-center gap-4">
                        <button onClick={() => navigate('/')} className="btn btn-secondary">
                            <Home size={18} /> Dashboard
                        </button>
                        <button onClick={() => window.location.reload()} className="btn btn-primary">
                            <RotateCcw size={18} /> New Quiz
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    const currentQuestion = questions[currentQuestionIndex];
    const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

    return (
        <div className="max-w-3xl mx-auto mt-8">
            <div className="flex justify-between items-end mb-6">
                <div>
                    <h2 className="text-sm font-bold text-indigo-600 mb-1 tracking-wide uppercase">{subject} &gt; {topic}</h2>
                    <h1 className="text-3xl font-extrabold text-slate-800">Question {currentQuestionIndex + 1} <span className="text-slate-400 text-xl font-medium">/ {questions.length}</span></h1>
                </div>
                <div className="text-slate-500 text-sm font-bold bg-white/50 px-3 py-1 rounded-full border border-slate-200">
                    {grade}
                </div>
            </div>

            <div className="w-full bg-slate-200 h-3 rounded-full mb-8 overflow-hidden shadow-inner">
                <div
                    className="bg-gradient-to-r from-indigo-500 to-violet-500 h-full transition-all duration-500 ease-out shadow-lg"
                    style={{ width: `${progress}%` }}
                ></div>
            </div>

            <div className="glass-panel animate-fade-in bg-white/80 border-white/60 shadow-xl">
                <h3 className="text-xl font-medium text-slate-800 mb-8 leading-relaxed">
                    <TextWithMath>{currentQuestion.question}</TextWithMath>
                </h3>

                <div className="grid gap-4">
                    {currentQuestion.options.map((option, index) => (
                        <button
                            key={index}
                            onClick={() => handleAnswerSelect(option)}
                            className={`p-5 rounded-xl border-2 text-left transition-all flex items-center justify-between group shadow-sm hover:shadow-md
                ${selectedAnswer === option
                                    ? 'bg-indigo-50 border-indigo-500 text-indigo-900 ring-2 ring-indigo-200'
                                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-indigo-300'
                                }`}
                        >
                            <span className="text-lg font-medium">
                                <TextWithMath>{option}</TextWithMath>
                            </span>
                            {selectedAnswer === option && <CheckCircle size={24} className="text-indigo-600" />}
                        </button>
                    ))}
                </div>

                <div className="mt-8 flex justify-end">
                    <button
                        onClick={handleNextQuestion}
                        disabled={!selectedAnswer}
                        className="btn btn-primary px-8 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-500/30"
                    >
                        {currentQuestionIndex === questions.length - 1 ? 'Finish Quiz' : 'Next Question'}
                    </button>
                </div>
            </div>
        </div>
    );
}
