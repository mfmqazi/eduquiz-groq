import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { quizData } from '../data';
import { Book, GraduationCap, Layers, ArrowRight } from 'lucide-react';

export default function Dashboard() {
    const [grade, setGrade] = useState('');
    const [subject, setSubject] = useState('');
    const [topic, setTopic] = useState('');
    const [questionCount, setQuestionCount] = useState(5);
    const navigate = useNavigate();

    const grades = Object.keys(quizData);
    const subjects = grade ? Object.keys(quizData[grade]) : [];
    const topics = (grade && subject) ? Object.keys(quizData[grade][subject]) : [];

    function handleStartQuiz() {
        if (grade && subject && topic) {
            navigate(`/quiz?grade=${grade}&subject=${subject}&topic=${topic}&count=${questionCount}`);
        }
    }

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="page-title animate-fade-in">Student Dashboard</h1>

            <div className="glass-panel animate-fade-in bg-white/60 border-white/50">
                <h2 className="text-2xl font-bold mb-6 text-indigo-900">Start a New Quiz</h2>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* Grade Selection */}
                    <div className="space-y-2">
                        <label className="block text-sm font-bold text-slate-700 mb-1 flex items-center gap-2">
                            <GraduationCap size={18} className="text-indigo-600" />
                            Select Grade
                        </label>
                        <select
                            className="w-full p-3 bg-white border-2 border-indigo-100 rounded-xl text-slate-700 font-medium focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-sm hover:border-indigo-300 cursor-pointer"
                            value={grade}
                            onChange={(e) => {
                                setGrade(e.target.value);
                                setSubject('');
                                setTopic('');
                            }}
                        >
                            <option value="">-- Grade --</option>
                            {grades.map(g => <option key={g} value={g}>{g}</option>)}
                        </select>
                    </div>

                    {/* Subject Selection */}
                    <div className="space-y-2">
                        <label className="block text-sm font-bold text-slate-700 mb-1 flex items-center gap-2">
                            <Book size={18} className="text-pink-600" />
                            Select Subject
                        </label>
                        <select
                            className="w-full p-3 bg-white border-2 border-pink-100 rounded-xl text-slate-700 font-medium focus:ring-4 focus:ring-pink-500/20 focus:border-pink-500 transition-all shadow-sm hover:border-pink-300 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                            value={subject}
                            onChange={(e) => {
                                setSubject(e.target.value);
                                setTopic('');
                            }}
                            disabled={!grade}
                        >
                            <option value="">-- Subject --</option>
                            {subjects.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                    </div>

                    {/* Topic Selection */}
                    <div className="space-y-2">
                        <label className="block text-sm font-bold text-slate-700 mb-1 flex items-center gap-2">
                            <Layers size={18} className="text-violet-600" />
                            Select Topic
                        </label>
                        <select
                            className="w-full p-3 bg-white border-2 border-violet-100 rounded-xl text-slate-700 font-medium focus:ring-4 focus:ring-violet-500/20 focus:border-violet-500 transition-all shadow-sm hover:border-violet-300 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                            value={topic}
                            onChange={(e) => setTopic(e.target.value)}
                            disabled={!subject}
                        >
                            <option value="">-- Topic --</option>
                            {topics.map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                    </div>

                    {/* Question Count Selection */}
                    <div className="space-y-2">
                        <label className="block text-sm font-bold text-slate-700 mb-1 flex items-center gap-2">
                            <span className="text-emerald-600 font-bold text-lg">#</span>
                            Questions: {questionCount}
                        </label>
                        <div className="pt-2 px-1">
                            <input
                                type="range"
                                min="3"
                                max="20"
                                value={questionCount}
                                onChange={(e) => setQuestionCount(parseInt(e.target.value))}
                                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                            />
                            <div className="flex justify-between text-xs text-slate-400 font-medium mt-1">
                                <span>3</span>
                                <span>20</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-8 flex justify-end">
                    <button
                        onClick={handleStartQuiz}
                        disabled={!grade || !subject || !topic}
                        className="btn btn-primary disabled:opacity-50 disabled:cursor-not-allowed px-8 py-3 text-lg shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50"
                    >
                        Start Quiz <ArrowRight size={20} />
                    </button>
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mt-8">
                <div
                    onClick={() => navigate('/history')}
                    className="glass-panel p-6 hover:bg-white/80 transition-all cursor-pointer group border-2 border-transparent hover:border-indigo-200 shadow-sm hover:shadow-md"
                >
                    <h3 className="text-lg font-bold text-slate-800 mb-2 group-hover:text-indigo-600 transition-colors">Recent Activity</h3>
                    <p className="text-slate-500 text-sm">View your latest quiz attempts and track your progress over time.</p>
                </div>
                <div
                    onClick={() => navigate('/study-materials')}
                    className="glass-panel p-6 hover:bg-white/80 transition-all cursor-pointer group border-2 border-transparent hover:border-pink-200 shadow-sm hover:shadow-md"
                >
                    <h3 className="text-lg font-bold text-slate-800 mb-2 group-hover:text-pink-600 transition-colors">Study Materials</h3>
                    <p className="text-slate-500 text-sm">Access recommended textbooks and resources based on your grade.</p>
                </div>
            </div>
        </div>
    );
}
