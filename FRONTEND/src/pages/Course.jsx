import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Api from '../Api';

const Course = () => {
    const { slug } = useParams();
    const navigate = useNavigate();
    const token = localStorage.getItem('login_token');
    const [course, setCourse] = useState(null);
    const [progress, setProgress] = useState(0);
    const [userIsRegistered, setUserIsRegistered] = useState(false);
    const [userCourseProgress, setUserCourseProgress] = useState(null);
    const [isCourseCompleted, setIsCourseCompleted] = useState(false);

    useEffect(() => {
        if (!token) {
            navigate('/login');
        } else {
            document.title = `Course - ${slug}`;
        }

        const fetchData = async () => {
            try {
                const courseResponse = await Api.get(`/courses/${slug}`);
                const courseData = courseResponse.data.data;
                setCourse(courseData);

                const progressResponse = await Api.get('/users/progress');
                const progressData = progressResponse.data.data.progress;

                if (progressData.length > 0) {
                    const userProgress = progressData.find(progress => progress.course.slug === slug);
                    
                    if (userProgress) {
                        setUserIsRegistered(true);
                        setUserCourseProgress(userProgress);

                        // Get all completed lessons
                        const completedLessons = userProgress.completed_lessons;
                        const totalLessons = courseData.sets.reduce((acc, set) => acc + set.lessons.length, 0);

                        // Calculate progress
                        const completedCount = completedLessons.length;
                        setProgress((completedCount / (totalLessons + 1)) * 100);

                        // Check if all lessons are completed
                        setIsCourseCompleted(completedCount === totalLessons + 1);
                    }
                }
            } catch (error) {
                console.error('Error fetching data:', error);
                if (error.response?.status === 401) {
                    navigate('/login');
                }
            }
        };

        fetchData();
    }, [navigate, token, slug]);

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            const response = await Api.post(`/courses/${slug}/register`, {}, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setUserIsRegistered(true);
        } catch (error) {
            console.log(error);
        }
    };

    const handleJump = (nextLessonId) => {
        navigate(`/${slug}/jump/${nextLessonId}`);
    };

    if (!course) {
        return <div>Loading...</div>;
    }

    return (
        <main className="py-5">
            <section>
                <div className="container">
                    {userIsRegistered ? (
                        <>
                            <h3 className="mb-3">{course.name}</h3>
                            <div className="progress mb-5" role="progressbar" aria-label="Course Progress" aria-valuenow={progress} aria-valuemin="0" aria-valuemax="100">
                                <div className="progress-bar" style={{ width: `${progress}%` }}>
                                    {Math.round(progress)}%
                                </div>
                            </div>

                            {course.sets.map((set, setIndex) => {
                                const completedLessons = userCourseProgress?.completed_lessons || [];
                                const isSetCompleted = set.lessons.every(lesson =>
                                    completedLessons.some(completed => completed.id === lesson.id)
                                );

                                // Determine the next lesson to be marked as "Current"
                                const lastCompletedLessonIndex = completedLessons.length
                                    ? course.sets.flatMap(set => set.lessons).findIndex(
                                        lesson => lesson.id === completedLessons[completedLessons.length - 1].id
                                    )
                                    : -1;

                                const nextLessonIndex = lastCompletedLessonIndex + 1;
                                const nextLesson = course.sets.flatMap(set => set.lessons)[nextLessonIndex];

                                // Check if the current set should show the jump button
                                const showJumpButton = !isSetCompleted && setIndex < course.sets.length - 1;

                                return (
                                    <div className="mb-4" key={set.id}>
                                        <h4 className="mb-3">{set.name}</h4>
                                        <div className="row">
                                            {set.lessons.map((lesson, index) => {
                                                const isCompleted = completedLessons.some(
                                                    completedLesson => completedLesson.id === lesson.id
                                                );

                                                // Determine if the lesson is current
                                                const isCurrent = nextLesson && nextLesson.id === lesson.id;

                                                // Lock lessons if they are neither completed nor current
                                                const isLocked = !isCompleted && !isCurrent;

                                                const status = isCompleted
                                                    ? "Completed"
                                                    : isCurrent
                                                    ? "Current"
                                                    : "Locked";

                                                return (
                                                    <div className="col-md-12" key={lesson.id}>
                                                        <a
                                                            href={status === "Locked" ? "#" : `/${slug}/lessons/${lesson.id}`}
                                                            className={`card mb-3 text-decoration-none ${
                                                                status === "Locked" ? "bg-light text-muted" : "bg-body-tertiary"
                                                            }`}
                                                            style={{ pointerEvents: status === "Locked" ? "none" : "auto" }}
                                                        >
                                                            <div className="card-body d-flex justify-content-between">
                                                                <div>
                                                                    <small className="text-muted">Lesson</small>
                                                                    <h5 className="mt-2">{lesson.name}</h5>
                                                                </div>
                                                                <div>
                                                                    <div
                                                                        className={`badge ${
                                                                            status === "Completed"
                                                                                ? "border border-primary text-primary"
                                                                                : status === "Current"
                                                                                ? "border border-success text-success"
                                                                                : "border border-secondary text-secondary"
                                                                        }`}
                                                                    >
                                                                        {status}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </a>
                                                    </div>
                                                );
                                            })}
                                        </div>

                                        {/* Show Jump button if the current set is not fully completed */}
                                        {showJumpButton && (
                                            <div className="text-center mb-4">
                                                <p className="mb-2"><b>Too easy?</b></p>
                                                <button
                                                    onClick={() => handleJump(course.sets[setIndex].lessons[0].id)} // Jump to the first lesson of the next set
                                                    className="btn btn-outline-primary"
                                                >
                                                    Jump Here
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}

                            {/* Show Certificate if all lessons are completed */}
                            {isCourseCompleted && (
                                <div className="mt-5">
                                    <h4 className="mb-3">Certificate</h4>
                                    <div className="row">
                                        <div className="col-md-12">
                                            <div className="card mb-3 text-decoration-none bg-body-tertiary">
                                                <div className="card-body text-center d-flex flex-column gap-5 p-4">
                                                    <h5>Course Certificate</h5>

                                                    <div className="text-center d-flex flex-column gap-2">
                                                        <p className="mb-0 text-muted"><small>This is to certify that</small></p>
                                                        <h1 className="mb-0 fw-bold">{localStorage.getItem('full_name')}</h1>
                                                        <p className="mb-0 text-muted">
                                                            <small>has successfully completed the course by demonstrating <br /> theoretical and practical understanding to</small>
                                                        </p>
                                                        <h3 className="fw-normal">{course.name}</h3>
                                                    </div>

                                                    <h6 className="mb-0">Web Tech Studio</h6>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </>
                    ) : (
                        <>
                            <div className="d-flex align-items-center justify-content-between mb-3">
                                <h3 className="mb-0">{course.name}</h3>
                                <button onClick={handleRegister} className="btn btn-primary">
                                    Register to this course
                                </button>
                            </div>

                            <p className="mb-5">{course.description}</p>

                            <div className="mb-4">
                                <h4 className="mb-3">Outline</h4>
                                <div className="row">
                                    {course.sets.map((set) => (
                                        <div className="col-md-12" key={set.id}>
                                            <div className="card mb-3">
                                                <div className="card-body">
                                                    <h5 className="mb-0">{set.name}</h5>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </section>
        </main>
    );
};

export default Course;
