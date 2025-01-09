import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import Api from '../Api';

const HomePage = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem('login_token');

    // State to hold progress and other courses
    const [progress, setProgress] = useState([]);
    const [otherCourses, setOtherCourses] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (!token) {
                    navigate('/login');
                    return;
                }

                document.title = "Home Page";

                // Fetch user progress
                const progressResponse = await Api.get('/users/progress', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                const progressData = progressResponse.data.data;
                setProgress(progressData.progress);

                // Fetch other courses
                const coursesResponse = await Api.get('/api/courses', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                const coursesData = coursesResponse.data.data.courses;
                const publishedCourses = coursesData.filter((course) => course.is_published === 1);
                setOtherCourses(publishedCourses);
            } catch (error) {
                console.error('Error fetching data:', error);

                if (error.response?.status === 401) {
                    navigate('/login');
                }
            }
        };

        fetchData();
    }, [navigate, token]);

    return (
        <>
            <main className="py-5">
                {/* My Courses Section */}
                <section className="my-courses">
                    <div className="container">
                        <h4 className="mb-3">My Courses</h4>
                        <div className="courses d-flex flex-column gap-3">
                            {progress.length > 0 ? (
                                progress.map((item) => (
                                    <div key={item.course.id} className="card bg-body-tertiary">
                                        <div className="card-body">
                                            <h5 className="mb-2">
                                                <NavLink
                                                    to={`/course/${item.course.slug}`}
                                                    className="text-decoration-none"
                                                >
                                                    {item.course.name}
                                                </NavLink>
                                            </h5>
                                            <p className="text-muted mb-3">{item.course.description}</p>
                                            <h6>Completed Lessons:</h6>
                                            <ul className="list-group">
                                                {item.completed_lessons.map((lesson) => (
                                                    <li key={lesson.id} className="list-group-item">
                                                        {lesson.name}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p>No enrolled courses yet.</p>
                            )}
                        </div>
                    </div>
                </section>

                {/* Other Courses Section */}
                <section className="other-courses mt-4">
                    <div className="container">
                        <h4 className="mb-3">Other Courses</h4>
                        <div className="d-flex flex-column gap-3">
                            {otherCourses.length > 0 ? (
                                otherCourses.map((course) => (
                                    <NavLink
                                        key={course.id}
                                        to={`/course/${course.slug}`}
                                        className="card text-decoration-none bg-body-tertiary"
                                    >
                                        <div className="card-body">
                                            <h5 className="mb-2">{course.name}</h5>
                                            <p className="text-muted mb-0">{course.description}</p>
                                        </div>
                                    </NavLink>
                                ))
                            ) : (
                                <p>No other courses available.</p>
                            )}
                        </div>
                    </div>
                </section>
            </main>
        </>
    );
}

export default HomePage;