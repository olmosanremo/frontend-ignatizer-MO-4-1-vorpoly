import React from 'react';

const ControlPanel = ({ setColor, toggleEraseMode, isErasing }) => {
    return (
        <div>
            <button onClick={() => setColor('red')} onTouchStart={() => setColor('red')} style={{ backgroundColor: 'red' }}>Red</button>
            <button onClick={() => setColor('yellow')} onTouchStart={() => setColor('yellow')} style={{ backgroundColor: 'yellow' }}>Yellow</button>
            <button onClick={() => setColor('green')} onTouchStart={() => setColor('green')} style={{ backgroundColor: 'green' }}>Green</button>
            <button onClick={toggleEraseMode} onTouchStart={toggleEraseMode}>{isErasing ? "Switch to Draw" : "Switch to Erase"}</button>
        </div>
    );
};

export default ControlPanel;
