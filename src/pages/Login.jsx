import React, { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LogIn, Mail, Lock, Loader2 } from 'lucide-react';

export default function Login() {
    const emailRef = useRef();
    const passwordRef = useRef();
    const { login } = useAuth();
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    async function handleSubmit(e) {
        e.preventDefault();

        try {
            setError('');
            setLoading(true);
            await login(emailRef.current.value, passwordRef.current.value);
            navigate('/');
        } catch (err) {
            setError('Failed to log in. ' + err.message);
        }
        setLoading(false);
    }

    return (
        <div className="max-w-md mx-auto mt-20">
            <div className="glass-panel animate-fade-in">
                <h2 className="text-3xl font-bold text-center mb-6 text-white">Welcome Back</h2>

                {error && <div className="bg-red-500/20 border border-red-500/50 text-red-200 p-3 rounded mb-4 text-sm">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label>Email</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-3 text-slate-400" size={18} />
                            <input type="email" ref={emailRef} required className="pl-10" placeholder="john@example.com" />
                        </div>
                    </div>

                    <div className="input-group">
                        <label>Password</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-3 text-slate-400" size={18} />
                            <input type="password" ref={passwordRef} required className="pl-10" placeholder="••••••••" />
                        </div>
                    </div>

                    <button disabled={loading} className="btn btn-primary w-full mt-4" type="submit">
                        {loading ? <Loader2 className="animate-spin" /> : <><LogIn size={20} /> Log In</>}
                    </button>
                </form>

                <div className="w-full text-center mt-6 text-slate-400 text-sm">
                    Need an account? <Link to="/signup" className="text-indigo-400 hover:text-indigo-300 font-medium">Sign Up</Link>
                </div>
            </div>
        </div>
    );
}
