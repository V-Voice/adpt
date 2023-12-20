import React, { useState, useEffect } from 'react';

type CheckboxProps = {
    callback: (e: React.MouseEvent<HTMLDivElement>, value: boolean) => void;
    customToggle?: boolean;
    customStatus?: boolean;
}

const Checkbox: React.FC<CheckboxProps> = ({ callback, customToggle = false, customStatus = false }) => {
    const [status, setStatus] = useState<boolean>(customToggle ? customStatus : false);

    const toggleStatus = (e: React.MouseEvent<HTMLDivElement>) => {
        const value = !status;
        callback(e, value);
        if (!customToggle) {
            setStatus(value);
        }
    };

    useEffect(() => {
        if (customToggle) {
            setStatus(customStatus);
        }
    }, [customStatus, customToggle]);

    return (
        <div className={`checkbox ${status ? 'active' : ''}`} onClick={toggleStatus} />
    );
}

export default Checkbox;