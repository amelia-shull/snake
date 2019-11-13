import React from 'react';

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
