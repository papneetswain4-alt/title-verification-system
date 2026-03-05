import React from 'react';
import { CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import '../styles/components.css';

const ResultCard = ({ result }) => {
    if (!result) return null;

    const isApproved = result.status === 'Approved';
    const probColor =
        result.verification_probability > 75 ? 'text-green' :
            result.verification_probability > 40 ? 'text-yellow' : 'text-red';

    return (
        <div className="result-card glass-panel fade-in">
            <div className="result-header">
                <div className="status-badge-container">
                    {isApproved ? (
                        <div className="status-badge approved">
                            <CheckCircle size={24} />
                            <span>Approved</span>
                        </div>
                    ) : (
                        <div className="status-badge rejected">
                            <XCircle size={24} />
                            <span>Rejected</span>
                        </div>
                    )}
                </div>

                <div className="probability-score">
                    <span className="prob-label">Approval Probability</span>
                    <span className={`prob-value ${probColor}`}>
                        {result.verification_probability}%
                    </span>
                </div>
            </div>

            <div className="result-details">
                <div className="detail-stat">
                    <span className="stat-label">Max Similarity Score</span>
                    <span className="stat-number">{result.similarity_score}%</span>
                </div>

                {result.detected_by && result.detected_by.length > 0 && (
                    <div className="detail-stat">
                        <span className="stat-label">Detected Engines</span>
                        <div className="engine-tags">
                            {result.detected_by.map(engine => (
                                <span key={engine} className="engine-tag">{engine.replace('_', ' ')}</span>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {result.violations && result.violations.length > 0 && (
                <div className="violations-container">
                    <h4 className="violations-title">
                        <AlertTriangle size={18} /> Compliance Violations
                    </h4>
                    <ul className="violations-list">
                        {result.violations.map((v, i) => (
                            <li key={i}>{v}</li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default ResultCard;
