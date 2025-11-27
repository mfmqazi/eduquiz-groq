import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { quizData } from '../data';
import { Book, GraduationCap, Layers, ArrowRight } from 'lucide-react';

export default function Dashboard() {
    const [grade, setGrade] = useState('');
    const [subject, setSubject] = useState('');
    const [topic, setTopic] = useState('');
    const navigate = useNavigate();

    const grades = Object.keys(quizData);
    const subjects = grade ? Object.keys(quizData[grade]) : [];
    const topics = (grade && subject) ? Object.keys(quizData[grade][subject]) : [];

    function handleStartQuiz() {
        if (grade && subject && topic) {
            navigate(`/quiz?grade=${grade}&subject=${subject}&topic=${topic}`);
        }
    }

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="page-title animate-fade-in">Student Dashboard</h1>

            <div className="glass-panel animate-fade-in">
                <h2 className="text-xl font-semibold mb-6 text-indigo-200">Start a New Quiz</h2>

                <div className="grid md:grid-cols-3 gap-6">
                    {/* Grade Selection */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-slate-300 mb-1 flex items-center gap-2">
                            <GraduationCap size={16} className="text-indigo-400" />
                            Select Grade
                        </label>
                        <select
                            className="w-full p-3 bg-slate-800/50 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                            value={grade}
                            onChange={(e) => {
                                setGrade(e.target.value);
                                setSubject('');
                                setTopic('');
                            }}
                        >
                            <option value="">-- Choose Grade --</option>
                            {grades.map(g => <option key={g} value={g}>{g}</option>)}
                        </select>
                    </div>

                    {/* Subject Selection */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-slate-300 mb-1 flex items-center gap-2">
                            <Book size={16} className="text-indigo-400" />
                            Select Subject
                        </label>
                        <select
                            className="w-full p-3 bg-slate-800/50 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            value={subject}
                            onChange={(e) => {
                                setSubject(e.target.value);
                                setTopic('');
                            }}
                            disabled={!grade}
                        >
                            <option value="">-- Choose Subject --</option>
                            {subjects.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                    </div>

                    {/* Topic Selection */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-slate-300 mb-1 flex items-center gap-2">
                            <Layers size={16} className="text-indigo-400" />
                            Select Topic
                        </label>
                        <select
                            className="w-full p-3 bg-slate-800/50 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            value={topic}
                            onChange={(e) => setTopic(e.target.value)}
                            disabled={!subject}
                        >
                            <option value="">-- Choose Topic --</option>
                            {topics.map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                    </div>
                </div>

                <div className="mt-8 flex justify-end">
                    <button
                        onClick={handleStartQuiz}
                        disabled={!grade || !subject || !topic}
                        className="btn btn-primary disabled:opacity-50 disabled:cursor-not-allowed px-8 py-3 text-lg"
                    >
                        Start Quiz <ArrowRight size={20} />
                    </button>
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mt-8">
                <div
                    onClick={() => navigate('/history')}
                    className="glass-panel p-6 hover:bg-slate-800/40 transition-colors cursor-pointer group"
                >
                    <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-indigo-300 transition-colors">Recent Activity</h3>
                    <p className="text-slate-400 text-sm">View your latest quiz attempts and track your progress over time.</p>
                </div>
                <div
                    onClick={() => alert('Study Materials feature coming soon!')}
                    className="glass-panel p-6 hover:bg-slate-800/40 transition-colors cursor-pointer group"
                >
                    <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-indigo-300 transition-colors">Study Materials</h3>
                    <p className="text-slate-400 text-sm">Access recommended textbooks and resources based on your grade.</p>
                </div>
            </div>
        </div>
    );
}
