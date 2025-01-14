import React from 'react';
import { NavLink } from 'react-router-dom';

const NotFound = () => {
    return(
        <>
        <main className="py-5">
            <section>
                <div className="container-fluid row">
                    <div className="col-4">

                    </div>
                    <div className="col-4">
                        <h3 className="mb-3 text-center">Page Not Found</h3>
                        <NavLink to='/' className='btn btn-primary container-fluid'>Back to Home</NavLink>
                    </div>
                    <div className="col-4">

                    </div>
                </div>
            </section>
        </main>
        </>
    );
}

export default NotFound;