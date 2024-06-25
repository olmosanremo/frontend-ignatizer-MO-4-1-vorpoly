import React from 'react';

const SoundControls = ({ isPlaying, playPauseSound, stopSound }) => {
    return (
        <div>
            <button onClick={playPauseSound} onTouchStart={playPauseSound}>{isPlaying ? "Pause Sound" : "Play Sound"}</button>
            <button onClick={stopSound} onTouchStart={stopSound}>Stop Sound</button>
        </div>
    );
};

export default SoundControls;
