import React from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import '../pixel.css';

export function Form({children}) {
    return (
        <div>
            {children}
        </div>
    )
}

export function Input({label, setInputText}) {
    return (
        <div className="form-group d-flex align-items-center justify-content-between">
            <label for="default" className="mr-3">{label + ": "}</label>
            <input id="default" type="text" className="form-control w-75" />
        </div>
    )
}

export function Button({children, onClick}) {
    return (
        <div className="d-flex justify-content-end">
            <button onClick={onClick} className="btn mr-2 mb-2 btn-primary" type="button">
                <span className="btn-text">{children}</span>
            </button>
        </div>
    )
}
