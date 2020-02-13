import React from 'react';
import { Link } from "react-router-dom";

const Page404 = () => (
    <div>
        <h1>404 - page not found</h1>
        <Link to={'/'}>Take me home</Link>
    </div>
);

export default Page404;