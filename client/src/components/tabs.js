import React from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import '../pixel.css';

export function TabMenu({children}) {
    return (
        <div>
            <ul className="nav nav-tabs" role="tablist">
                {children}
            </ul>
        </div>
    )
}

export function TabMenuItem({onClick, active, children}) {
    return (
        <li className="nav-item" onClick={onClick}>
            <a className={`nav-link ${active ? "active" : ""}`} data-toggle="tab" role="tab">{children}</a>
        </li>
    )
}

export function Tab({children}) {
    return (
        <div className="tab-content" id="myTabContent">
            <div className="tab-pane show active" role="tabpanel" aria-labelledby="tab">
                {children}
            </div>
        </div>
    )
}


/*
            <div className="card center-vertical-absolute center-horizontal-absolute">
                <div className="card-header">
                    Welcome to Snake!
                </div>
                <div className="card-body">
                    <div className="form-group d-flex align-items-center justify-content-between">
                        <label htmlFor="default" className="mr-3">Enter a username: </label>
                        <input id="default" type="text" className="form-control w-75" />
                    </div>
                    <div className="d-flex justify-content-end mt-3">
                        <button className="btn btn-sm mr-2 btn-primary border-dark"type="button" onClick={() => setView("game")}>
                            <span className="btn-text">OK</span>
                        </button>
                    </div>
                </div>
            </div>
*/