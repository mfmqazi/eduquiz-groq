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
        <div className="max-w-5xl mx-auto px-4 py-8">
            <div className="text-center mb-12">
                <h1 className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 mb-4 animate-fade-in">
                    Ready to Learn?
                </h1>
                <p className="text-xl text-slate-600 font-medium animate-fade-in opacity-90">
                    Customize your quiz and challenge yourself!
                </p>
            </div>

            <div className="glass-panel p-8 animate-fade-in border-t-4 border-indigo-500 shadow-2xl shadow-indigo-500/10">
                <div className="flex items-center gap-3 mb-8">
                    <div className="p-3 bg-indigo-100 rounded-xl text-indigo-600">
                        <Book size={28} strokeWidth={2.5} />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-800">Quiz Configuration</h2>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* Grade Selection */}
                    <div className="group">
                        <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2 group-focus-within:text-indigo-600 transition-colors">
                            <GraduationCap size={18} className="text-indigo-500" />
                            Grade Level
                        </label>
                        <div className="relative">
                            <select
                                className="w-full p-4 bg-indigo-50/50 border-2 border-indigo-100 rounded-2xl text-slate-700 font-bold focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none appearance-none cursor-pointer hover:border-indigo-300"
                                value={grade}
                                onChange={(e) => {
                                    setGrade(e.target.value);
                                    setSubject('');
                                    setTopic('');
                                }}
                            >
                                <option value="">Select Grade</option>
                                {grades.map(g => <option key={g} value={g}>{g}</option>)}
                            </select>
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-indigo-400">
                                <ArrowRight size={16} className="rotate-90" />
                            </div>
                        </div>
                    </div>

                    {/* Subject Selection */}
                    <div className="group">
                        <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2 group-focus-within:text-pink-600 transition-colors">
                            <Book size={18} className="text-pink-500" />
                            Subject
                        </label>
                        <div className="relative">
                            <select
                                className="w-full p-4 bg-pink-50/50 border-2 border-pink-100 rounded-2xl text-slate-700 font-bold focus:ring-4 focus:ring-pink-500/20 focus:border-pink-500 transition-all outline-none appearance-none cursor-pointer hover:border-pink-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                value={subject}
                                onChange={(e) => {
                                    setSubject(e.target.value);
                                    setTopic('');
                                }}
                                disabled={!grade}
                            >
                                <option value="">Select Subject</option>
                                {subjects.map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-pink-400">
                                <ArrowRight size={16} className="rotate-90" />
                            </div>
                        </div>
                    </div>

                    {/* Topic Selection */}
                    <div className="group">
                        <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2 group-focus-within:text-violet-600 transition-colors">
                            <Layers size={18} className="text-violet-500" />
                            Topic
                        </label>
                        <div className="relative">
                            <select
                                className="w-full p-4 bg-violet-50/50 border-2 border-violet-100 rounded-2xl text-slate-700 font-bold focus:ring-4 focus:ring-violet-500/20 focus:border-violet-500 transition-all outline-none appearance-none cursor-pointer hover:border-violet-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                value={topic}
                                onChange={(e) => setTopic(e.target.value)}
                                disabled={!subject}
                            >
                                <option value="">Select Topic</option>
                                {topics.map(t => <option key={t} value={t}>{t}</option>)}
                            </select>
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-violet-400">
                                <ArrowRight size={16} className="rotate-90" />
                            </div>
                        </div>
                    </div>

                    {/* Question Count Selection */}
                    <div className="group">
                        <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2 group-focus-within:text-emerald-600 transition-colors">
                            <span className="flex items-center justify-center w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 text-xs font-bold">#</span>
                            {questionCount} Questions
                        </label>
                        <div className="h-[58px] flex flex-col justify-center px-4 bg-emerald-50/50 border-2 border-emerald-100 rounded-2xl hover:border-emerald-300 transition-all">
                            <input
                                type="range"
                                min="3"
                                max="20"
                                value={questionCount}
                                onChange={(e) => setQuestionCount(parseInt(e.target.value))}
                                className="w-full h-2 bg-emerald-200 rounded-lg appearance-none cursor-pointer accent-emerald-500 hover:accent-emerald-600 transition-all"
                            />
                        </div>
                    </div>
                </div>

                <div className="mt-10 flex justify-end">
                    <button
                        onClick={handleStartQuiz}
                        disabled={!grade || !subject || !topic}
                        className="btn btn-primary w-full md:w-auto px-10 py-4 text-lg shadow-xl shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:scale-105 active:scale-95 transition-all duration-300 disabled:opacity-50 disabled:transform-none"
                    >
                        Start Quiz <ArrowRight size={22} className="ml-2" />
                    </button>
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mt-8">
                <div
                    onClick={() => navigate('/history')}
                    className="glass-panel p-6 hover:bg-white transition-all cursor-pointer group border-2 border-transparent hover:border-indigo-200 shadow-lg hover:shadow-xl hover:-translate-y-1"
                >
                    <div className="flex items-center gap-4 mb-3">
                        <div className="p-3 bg-indigo-100 rounded-xl text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300">
                            <Layers size={24} />
                        </div>
                        <h3 className="text-xl font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">Your History</h3>
                    </div>
                    <p className="text-slate-500 font-medium">Track your progress and review past attempts.</p>
                </div>

                <div
                    onClick={() => navigate('/study-materials')}
                    className="glass-panel p-6 hover:bg-white transition-all cursor-pointer group border-2 border-transparent hover:border-pink-200 shadow-lg hover:shadow-xl hover:-translate-y-1"
                >
                    <div className="flex items-center gap-4 mb-3">
                        <div className="p-3 bg-pink-100 rounded-xl text-pink-600 group-hover:bg-pink-600 group-hover:text-white transition-all duration-300">
                            <Book size={24} />
                        </div>
                        <h3 className="text-xl font-bold text-slate-800 group-hover:text-pink-600 transition-colors">Study Materials</h3>
                    </div>
                    <p className="text-slate-500 font-medium">Curated resources to help you master every topic.</p>
                </div>
            </div>
        </div>
    );
}
