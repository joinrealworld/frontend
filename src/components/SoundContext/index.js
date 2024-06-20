"use client";

import React, { createContext, useContext, useEffect } from 'react';

const SoundContext = createContext();

export const useSound = () => useContext(SoundContext);

export const SoundProvider = ({ children }) => {
    useEffect(() => {
        const playClickSound = () => {
            if (typeof window !== 'undefined') { // Check to ensure window is defined
                const sound_click_tune = localStorage.getItem('sound_click_tune');
                if (sound_click_tune !== undefined && sound_click_tune !== null) {
                    // audio/sound-1.mp3
                    const soundUrl = '/audio/' + sound_click_tune;
                    const audio = new Audio(soundUrl);
                    audio.play();
                }
            }
        };
        document.addEventListener('click', playClickSound);
        return () => {
            document.removeEventListener('click', playClickSound);
        };
    }, []);

    return (
        <SoundContext.Provider value={null}>
            {children}
        </SoundContext.Provider>
    );
};
