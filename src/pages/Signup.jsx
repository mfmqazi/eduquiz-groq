import React, { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { UserPlus, Mail, Lock, User, AtSign, Loader2 } from 'lucide-react';

export default function Signup() {
    const emailRef = useRef();
    const passwordRef = useRef();
    const passwordConfirmRef = useRef();
    const firstNameRef = useRef();
    const lastNameRef = useRef();
    const usernameRef = useRef();
    const { signup } = useAuth();
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    async function handleSubmit(e) {
        e.preventDefault();

        if (passwordRef.current.value !== passwordConfirmRef.current.value) {
            return setError('Passwords do not match');
        }

        try {
            setError('');
            setLoading(true);
            await signup(
                emailRef.current.value,
                passwordRef.current.value,
                firstNameRef.current.value,
                lastNameRef.current.value,
                usernameRef.current.value
            );
            navigate('/');
        } catch (err) {
            console.error(err);
            setError('Failed to create an account. ' + err.message);
        }
        setLoading(false);
    }

    return (
        <div className="max-w-md mx-auto mt-10">
            <div className="glass-panel animate-fade-in">
                <h2 className="text-3xl font-bold text-center mb-6 text-white">Create Account</h2>

                {error && <div className="bg-red-500/20 border border-red-500/50 text-red-200 p-3 rounded mb-4 text-sm">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="input-group">
                            <label>First Name</label>
                            <div className="relative">
                                <User className="absolute left-3 top-3 text-slate-400" size={18} />
                                <input type="text" ref={firstNameRef} required className="pl-10" placeholder="John" />
                            </div>
                        </div>
                        <div className="input-group">
                            <label>Last Name</label>
                            <div className="relative">
                                <User className="absolute left-3 top-3 text-slate-400" size={18} />
                                <input type="text" ref={lastNameRef} required className="pl-10" placeholder="Doe" />
                            </div>
                        </div>
                    </div>

                    <div className="input-group">
                        <label>Username</label>
                        <div className="relative">
                            <AtSign className="absolute left-3 top-3 text-slate-400" size={18} />
                            <input type="text" ref={usernameRef} required className="pl-10" placeholder="johndoe123" />
                        </div>
                    </div>

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

                    <div className="input-group">
                        <label>Confirm Password</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-3 text-slate-400" size={18} />
                            <input type="password" ref={passwordConfirmRef} required className="pl-10" placeholder="••••••••" />
                        </div>
                    </div>

                    <button disabled={loading} className="btn btn-primary w-full mt-4" type="submit">
                        {loading ? <Loader2 className="animate-spin" /> : <><UserPlus size={20} /> Sign Up</>}
                    </button>
                </form>

                <div className="w-full text-center mt-6 text-slate-400 text-sm">
                    Already have an account? <Link to="/login" className="text-indigo-400 hover:text-indigo-300 font-medium">Log In</Link>
                </div>
            </div>
        </div>
    );
}
