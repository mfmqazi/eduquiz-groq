import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';
import { Calendar, CheckCircle2, XCircle, Clock, BarChart3, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function History() {
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const { currentUser } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchHistory() {
            if (!currentUser) return;

            try {
                const q = query(
                    collection(db, "results"),
                    where("userId", "==", currentUser.uid)
                );

                const querySnapshot = await getDocs(q);
                const data = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));

                data.sort((a, b) => new Date(b.date) - new Date(a.date));

                setResults(data);
            } catch (error) {
                console.error("Error fetching history:", error);
            }
            setLoading(false);
        }

        fetchHistory();
    }, [currentUser]);

    if (loading) return (
        <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
    );

    return (
        <div className="max-w-5xl mx-auto px-4 py-8">
            <div className="flex justify-between items-end mb-8">
                <div>
                    <h1 className="page-title mb-2">Quiz History</h1>
                    <p className="text-slate-600 font-medium">Track your progress and improvements over time.</p>
                </div>
                {results.length > 0 && (
                    <div className="bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-200 text-slate-600 font-bold">
                        Total Quizzes: {results.length}
                    </div>
                )}
            </div>

            {results.length === 0 ? (
                <div className="glass-panel text-center py-16 animate-fade-in p-10">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-indigo-50 rounded-full mb-6 text-indigo-300">
                        <BarChart3 size={40} />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-800 mb-3">No quizzes taken yet</h3>
                    <p className="text-slate-500 mb-8 max-w-md mx-auto">
                        Your learning journey starts here! Go to the dashboard to customize and start your first quiz.
                    </p>
                    <button onClick={() => navigate('/')} className="btn btn-primary px-8 py-3 shadow-lg shadow-indigo-500/30">
                        Start Your First Quiz <ArrowRight size={20} className="ml-2" />
                    </button>
                </div>
            ) : (
                <div className="space-y-6 animate-fade-in">
                    {results.map((result) => {
                        const percentage = Math.round((result.score / result.totalQuestions) * 100);
                        const isPass = percentage >= 50;
                        const date = new Date(result.date).toLocaleDateString(undefined, {
                            weekday: 'short',
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                        });

                        return (
                            <div key={result.id} className="glass-panel p-8 flex flex-col md:flex-row justify-between items-center gap-6 hover:bg-white transition-all duration-300 group border-2 border-transparent hover:border-indigo-100 hover:shadow-xl hover:-translate-y-1">
                                <div className="flex-grow w-full md:w-auto">
                                    <div className="flex items-center gap-3 mb-3">
                                        <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider">
                                            {result.grade}
                                        </span>
                                        <span className="text-slate-400 text-sm flex items-center gap-1 font-medium">
                                            <Clock size={14} /> {date}
                                        </span>
                                    </div>
                                    <h3 className="text-2xl font-bold text-slate-800 group-hover:text-indigo-700 transition-colors mb-1">{result.subject}</h3>
                                    <p className="text-slate-500 font-medium flex items-center gap-2">
                                        <span className="w-2 h-2 rounded-full bg-slate-300"></span>
                                        {result.topic}
                                    </p>
                                </div>

                                <div className="flex items-center gap-8 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 border-slate-100 pt-4 md:pt-0">
                                    <div className="text-right">
                                        <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Score</div>
                                        <div className="text-3xl font-black text-slate-800">
                                            {result.score} <span className="text-slate-400 text-xl font-medium">/ {result.totalQuestions}</span>
                                        </div>
                                    </div>

                                    <div className={`flex items-center justify-center w-20 h-20 rounded-2xl ${isPass ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'} shadow-inner`}>
                                        <span className="font-black text-xl">{percentage}%</span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
