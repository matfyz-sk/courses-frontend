import React from 'react';

const SidebarWrapper = (props) => (
    <aside className="col-12 col-md-2 p-0 bg-light flex-shrink-1 sidebar-wrapper">
        <nav className="navbar navbar-expand navbar-light bg-light flex-md-column flex-row align-items-start py-2">
            <div className="collapse navbar-collapse ">
                <ul className="flex-md-column flex-row navbar-nav w-100 justify-content-between">
                    {props.children}
                </ul>
            </div>
        </nav>
    </aside>
);

export default SidebarWrapper;