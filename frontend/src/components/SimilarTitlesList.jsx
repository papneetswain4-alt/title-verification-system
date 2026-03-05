import React from 'react';
import { Copy, AlertCircle } from 'lucide-react';
import '../styles/components.css';

const SimilarTitlesList = ({ titles, similarityScore }) => {
    if (!titles || titles.length === 0) return null;

    return (
        <div className="similar-titles-container glass-panel fade-in delay-1">
            <div className="similar-header">
                <AlertCircle size={20} className="text-yellow" />
                <h3>Similar Existing Titles Detected</h3>
            </div>

            <p className="similar-subtitle">
                Your submission closely matches the following {titles.length} active publication{titles.length > 1 ? 's' : ''}.
            </p>

            <ul className="similar-list">
                {titles.map((title, i) => (
                    <li key={i} className="similar-item">
                        <span className="similar-title-text">{title}</span>
                        <span className="match-tag">{similarityScore}% Match</span>
                    </li>
                ))}
            </ul>

            <div className="similar-footer">
                <p>Combining existing titles or reusing distinct parts violates PRGI rules.</p>
            </div>
        </div>
    );
};

export default SimilarTitlesList;
