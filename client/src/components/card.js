import React from 'react';

export function Card({children, cardTheme}) {
    return (
        <div className={`${cardTheme != null ? cardTheme + " ": ""}card`}>
            {children}
        </div>
    )
}

export function CardHeader({children}) {
    return (
        <div className="card-header">
            {children}
        </div>
    )
}

export function CardBody({children}) {
    return (
        <div className="card-body">
            {children}
        </div>
    )
}