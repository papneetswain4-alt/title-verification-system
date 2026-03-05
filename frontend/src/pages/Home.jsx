import React, { useState } from 'react';
import TitleForm from '../components/TitleForm';
import ResultCard from '../components/ResultCard';
import SimilarTitlesList from '../components/SimilarTitlesList';
import { verifyTitle } from '../services/api';
import '../styles/global.css';

const Home = () => {
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);

    const handleVerify = async (title) => {
        setLoading(true);
        setError(null);
        setResult(null);

        try {
            // Small artificial delay for effect 
            setTimeout(async () => {
                try {
                    const data = await verifyTitle(title);
                    setResult(data);
                } catch (err) {
                    setError('Failed to connect to the verification server. Please ensure the backend is running.');
                } finally {
                    setLoading(false);
                }
            }, 600);
        } catch (err) {
            setError('An unexpected error occurred.');
            setLoading(false);
        }
    };

    return (
        <div className="app-container">
            <div className="background-shapes">
                <div className="shape shape-1"></div>
                <div className="shape shape-2"></div>
                <div className="shape shape-3"></div>
            </div>

            <header className="app-header">
                <div className="logo-container">
                    <div className="logo-icon">PRGI</div>
                    <h1>Title Verification System</h1>
                </div>
                <p className="tagline">Intelligent validation & semantic similarity detection</p>
            </header>

            <main className="main-content">
                <div className="left-column">
                    <TitleForm onVerify={handleVerify} isLoading={loading} />

                    {error && (
                        <div className="error-banner fade-in">
                            {error}
                        </div>
                    )}
                </div>

                <div className="right-column">
                    {result ? (
                        <div className="results-wrapper">
                            <ResultCard result={result} />
                            <SimilarTitlesList
                                titles={result.similar_titles}
                                similarityScore={result.similarity_score}
                            />
                        </div>
                    ) : !loading && !error ? (
                        <div className="empty-state glass-panel fade-in">
                            <div className="empty-icon-pulse"></div>
                            <h3>Ready for Verification</h3>
                            <p>Submit a title to begin the automated compliance check.</p>
                            <ul className="empty-feature-list">
                                <li>✨ Semantic NLP analysis</li>
                                <li>🔊 Phonetic matching</li>
                                <li>🛡️ Regulatory compliance</li>
                            </ul>
                        </div>
                    ) : null}
                </div>
            </main>
        </div>
    );
};

export default Home;
