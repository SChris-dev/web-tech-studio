import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Api from '../Api';

const Jump = () => {
    const { slug, lesson_id } = useParams();
    const navigate = useNavigate();

    const [quizzes, setQuizzes] = useState([]); // Store all quizzes from the current set
    const [currentQuizIndex, setCurrentQuizIndex] = useState(0); // Track the current quiz
    const [selectedOptionId, setSelectedOptionId] = useState(null); // Store selected option ID
    const [loading, setLoading] = useState(true);
    const [currentSetLessons, setCurrentSetLessons] = useState([]); // Track lessons in the current set
    const [progress, setProgress] = useState(0); // Track progress

    useEffect(() => {
        const fetchQuizzes = async () => {
            try {
                const courseResponse = await Api.get(`/courses/${slug}`);
                const courseData = courseResponse.data.data;

                // Find the current set based on the lesson_id
                const currentSet = courseData.sets.find(set =>
                    set.lessons.some(lesson => lesson.id === parseInt(lesson_id))
                );

                if (!currentSet) {
                    throw new Error('Set not found.');
                }

                // Extract all quizzes from the current set
                const allQuizzes = currentSet.lessons.flatMap(lesson =>
                    lesson.contents.filter(content => content.type === 'quiz')
                );

                setQuizzes(allQuizzes);
                setCurrentSetLessons(currentSet.lessons); // Save lessons in the current set
                setLoading(false);
            } catch (error) {
                console.error('Error fetching quizzes:', error);
            }
        };

        fetchQuizzes();
    }, [slug, lesson_id]);

    const handleQuizSubmit = async () => {
        const currentQuiz = quizzes[currentQuizIndex];

        if (selectedOptionId !== null) {
            try {
                const response = await Api.post(`/lessons/${lesson_id}/contents/${currentQuiz.id}/check`, {
                    option_id: selectedOptionId,
                });

                if (response.data.status === 'success' && response.data.data.is_correct === 1) {
                    const nextIndex = currentQuizIndex + 1;
                    if (nextIndex < quizzes.length) {
                        setCurrentQuizIndex(nextIndex);
                        setSelectedOptionId(null); // Reset selection for the next quiz
                        setProgress(((nextIndex + 1) / quizzes.length) * 100); // Update progress
                    } else {
                        // All quizzes completed, mark all lessons in the current set as complete
                        await Promise.all(
                            currentSetLessons.map(lesson =>
                                Api.put(`/lessons/${lesson.id}/complete`)
                            )
                        );
                        alert('All quizzes completed! The next set is now unlocked.');
                        navigate(`/${slug}`); // Redirect to the course page
                    }
                } else {
                    alert('Your answer is wrong.');
                }
            } catch (error) {
                console.error('Error checking answer:', error);
            }
        } else {
            alert('Please select an answer.');
        }
    };

    if (loading) return <p>Loading...</p>;

    const currentQuiz = quizzes[currentQuizIndex];

    return (
        <main className="py-5">
            <section>
                <div className="container">
                    <div className="d-flex align-items-center justify-content-between mb-3">
                        <h4 className="mb-0">Jump to Next Set</h4>
                    </div>

                    {/* Progress Bar */}
                    <div className="progress mb-5" role="progressbar" aria-label="Quiz Progress" aria-valuenow={progress} aria-valuemin="0" aria-valuemax="100">
                        <div className="progress-bar" style={{ width: `${progress}%` }}></div>
                    </div>

                    <div className="mb-4">
                        <p className="mb-4">{currentQuiz.content}</p>
                        <div>
                            {currentQuiz.options && currentQuiz.options.map((option, index) => (
                                <div className="my-2" key={option.id}>
                                    <input
                                        type="radio"
                                        id={`choice-${index}`}
                                        name="answer"
                                        value={option.id}
                                        onChange={(e) => setSelectedOptionId(parseInt(e.target.value))}
                                        className="input-choice"
                                    />
                                    <label htmlFor={`choice-${index}`} className="card">
                                        <div className="card-body">{option.option_text}</div>
                                    </label>
                                </div>
                            ))}
                        </div>
                        <button
                            className="btn btn-primary w-100 mt-2"
                            onClick={handleQuizSubmit}
                        >
                            Check Answer
                        </button>
                    </div>
                </div>
            </section>
        </main>
    );
};

export default Jump;
