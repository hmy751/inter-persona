import {create} from 'zustand';

interface AudioState {
    audioElement: HTMLAudioElement | null;
    setAudioElement: (audio: HTMLAudioElement) => void;
    audioFile: string;
    setAudioFile: (audioFile: string) => void;
    play: () => void;
}

export const useAudioStore = create<AudioState>((set) => ({
    audioElement: null,
    setAudioElement: (audioElement: HTMLAudioElement) => set({ audioElement }),
    audioFile: '/audios/sound1.mp3',
    setAudioFile: (audioFile: string) => set({ audioFile: audioFile }),
    play: () => {
        set((state) => { 
            state.audioElement?.play();
            return state;
        });
    },
}));