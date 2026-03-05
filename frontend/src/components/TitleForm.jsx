import React, { useState } from 'react';
import { Search, Loader2 } from 'lucide-react';
import '../styles/components.css';

const TitleForm = ({ onVerify, isLoading }) => {
    const [title, setTitle] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (title.trim() && !isLoading) {
            onVerify(title.trim());
        }
    };

    return (
        <div className="title-form-container glass-panel">
            <h2>Submit a New Publication Title</h2>
            <p className="subtitle">Enter your proposed title to check for compliance and similarity against our database.</p>

            <form onSubmit={handleSubmit} className="input-group">
                <div className="input-wrapper">
                    <Search className="search-icon" size={20} />
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="e.g. The Daily Morning Herald"
                        className="title-input"
                        disabled={isLoading}
                        autoComplete="off"
                        maxLength={100}
                    />
                </div>
                <button
                    type="submit"
                    className={`verify-btn ${isLoading ? 'loading' : ''}`}
                    disabled={!title.trim() || isLoading}
                >
                    {isLoading ? (
                        <><Loader2 className="spinner" size={20} /> Verifying...</>
                    ) : (
                        'Verify Title'
                    )}
                </button>
            </form>
        </div>
    );
};

export default TitleForm;
