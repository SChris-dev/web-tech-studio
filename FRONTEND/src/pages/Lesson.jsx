import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Api from '../Api';

const Lesson = () => {
    const { slug, lesson_id } = useParams();
    const navigate = useNavigate();

    const [lesson, setLesson] = useState(null);
    const [contents, setContents] = useState([]);  // Store sorted contents
    const [currentContentIndex, setCurrentContentIndex] = useState(0);
    const [progress, setProgress] = useState(0);
    const [selectedOptionId, setSelectedOptionId] = useState(null);  // Store selected option ID

    useEffect(() => {
        const fetchData = async () => {
            try {
                const courseResponse = await Api.get(`/courses/${slug}`);
                const courseData = courseResponse.data.data;

                const lessons = courseData.sets.flatMap(set => set.lessons);
                const currentLesson = lessons.find(lesson => lesson.id === parseInt(lesson_id));

                const sortedContents = currentLesson.contents.sort((a, b) => a.order - b.order);
                setContents(sortedContents);
                setLesson(currentLesson); // Set the current lesson
                setCurrentContentIndex(0); // Start with the first content
            } catch (error) {
                console.error(error);
            }
        };

        fetchData();
    }, [slug, lesson_id]);

    const goToNextContent = async () => {
        const nextIndex = currentContentIndex + 1;
        if (nextIndex < contents.length) {
            setCurrentContentIndex(nextIndex);
            setProgress(((nextIndex + 1) / contents.length) * 100); // Update progress
        } else {
            try {
                // Call the completion API
                const response = await Api.put(`/lessons/${lesson_id}/complete`);
                if (response.data.status === 'success') {
                    alert('Lesson completed successfully!');
                    navigate(`/${slug}`); // Redirect to the course page
                } else {
                    console.error('Error completing the lesson:', response.data.message);
                }
            } catch (error) {
                console.error('Error completing the lesson:', error);
            }
        }
    };

    const handleQuizSubmit = async () => {
        const currentContent = contents[currentContentIndex];

        if (selectedOptionId !== null) {
            try {
                const selectedOption = currentContent.options.find(option => option.id === selectedOptionId);
                const response = await Api.post(`/lessons/${lesson_id}/contents/${currentContent.id}/check`, {
                    option_id: selectedOption.id,  // Send the option ID instead of text
                });

                if (response.data.status === 'success' && response.data.data.is_correct === 1) {
                    goToNextContent(); // Move to next content
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

    const handleContinue = () => {
        goToNextContent(); // Continue to next content after learning content
    };

    if (!lesson) return <p>Loading...</p>;

    const currentContent = contents[currentContentIndex];

    return (
        <main className="py-5">
            <section>
                <div className="container">
                    <div className="d-flex align-items-center justify-content-between mb-3">
                        <h4 className="mb-0">{lesson.name}</h4>
                    </div>
                    <div
                        className="progress mb-5"
                        role="progressbar"
                        aria-label="Lesson Progress"
                        aria-valuenow={progress}
                        aria-valuemin="0"
                        aria-valuemax="100"
                    >
                        <div className="progress-bar" style={{ width: `${progress}%` }}></div>
                    </div>

                    {currentContent.type === 'learn' && (
                        <div className="mb-4">
                            <p className="mb-4">{currentContent.content}</p>
                            <button className="btn btn-primary w-100 mt-2" onClick={handleContinue}>
                                Continue
                            </button>
                        </div>
                    )}

                    {currentContent.type === 'quiz' && (
                        <div className="mb-4">
                            <p className="mb-4">{currentContent.content}</p>
                            <div>
                                {currentContent.options && currentContent.options.map((option, index) => (
                                    <div className="my-2" key={option.id}>
                                        <input
                                            type="radio"
                                            id={`choice-${index}`}
                                            name="answer"
                                            value={option.id}  // Store the option ID
                                            onChange={(e) => setSelectedOptionId(parseInt(e.target.value))}  // Set the selected option ID
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
                    )}
                </div>
            </section>
        </main>
    );
};

export default Lesson;
