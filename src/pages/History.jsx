import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';
import { Calendar, CheckCircle2, XCircle, Clock } from 'lucide-react';

export default function History() {
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const { currentUser } = useAuth();

    useEffect(() => {
        async function fetchHistory() {
            if (!currentUser) return;

            try {
                const q = query(
                    collection(db, "results"),
                    where("userId", "==", currentUser.uid),
                    // Note: You might need to create a composite index in Firebase Console for this query to work perfectly with orderBy
                    // For now, we'll sort client-side if the index is missing to avoid errors in dev
                );

                const querySnapshot = await getDocs(q);
                const data = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));

                // Client-side sort to be safe without index
                data.sort((a, b) => new Date(b.date) - new Date(a.date));

                setResults(data);
            } catch (error) {
                console.error("Error fetching history:", error);
            }
            setLoading(false);
        }

        fetchHistory();
    }, [currentUser]);

    if (loading) return <div className="text-center mt-20 text-white">Loading history...</div>;

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="page-title animate-fade-in">Quiz History</h1>

            {results.length === 0 ? (
                <div className="glass-panel text-center py-12 animate-fade-in">
                    <div className="text-slate-400 mb-4">No quizzes taken yet.</div>
                    <p className="text-slate-500">Go to the dashboard to start your first quiz!</p>
                </div>
            ) : (
                <div className="space-y-4 animate-fade-in">
                    {results.map((result) => {
                        const percentage = Math.round((result.score / result.totalQuestions) * 100);
                        const isPass = percentage >= 50;
                        const date = new Date(result.date).toLocaleDateString(undefined, {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                        });

                        return (
                            <div key={result.id} className="glass-panel p-6 flex flex-col md:flex-row justify-between items-center gap-4 hover:bg-slate-800/40 transition-colors">
                                <div className="flex-grow">
                                    <div className="flex items-center gap-3 mb-2">
                                        <span className="bg-indigo-500/20 text-indigo-300 px-3 py-1 rounded-full text-xs font-medium border border-indigo-500/30">
                                            {result.grade}
                                        </span>
                                        <span className="text-slate-400 text-sm flex items-center gap-1">
                                            <Clock size={14} /> {date}
                                        </span>
                                    </div>
                                    <h3 className="text-xl font-semibold text-white">{result.subject}</h3>
                                    <p className="text-slate-400">{result.topic}</p>
                                </div>

                                <div className="flex items-center gap-6">
                                    <div className="text-right">
                                        <div className="text-sm text-slate-400">Score</div>
                                        <div className="text-2xl font-bold text-white">
                                            {result.score} <span className="text-slate-500 text-lg">/ {result.totalQuestions}</span>
                                        </div>
                                    </div>

                                    <div className={`flex items-center justify-center w-16 h-16 rounded-full border-4 ${isPass ? 'border-green-500/50 text-green-400' : 'border-red-500/50 text-red-400'} bg-slate-900/50`}>
                                        <span className="font-bold text-sm">{percentage}%</span>
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
