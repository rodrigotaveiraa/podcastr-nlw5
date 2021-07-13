import { createContext, useState, ReactNode, useContext } from 'react';

type Episode = {
    title: string;
    members: string;
    thumbnail: string;
    duration: number;
    url: string;
}

type PlayerContextData = {
    episodeList: Episode[];
    currentEpisodeIndex: number;
    isPLaying: boolean;
    isLooping: boolean;
    hasNext: boolean;
    hasPrevious: boolean;
    isShuffling: boolean;
    play: (episode: Episode) => void;
    playList: (list: Episode[], index: number) => void;
    playNext: () => void;
    playPrevious: () => void;
    togglePlay: () => void;
    toggleLoop: () => void;
    toggleShuffle: () => void;
    setPLayingState: (state: boolean) => void;
    clearPlayerState: () => void;
}

type PlayerContextProviderProps = {
    children: ReactNode
}

export const PlayerContext = createContext({} as PlayerContextData)

export function PlayerContextProvider({ children } : PlayerContextProviderProps) {
    const [episodeList, setEpisodeList] = useState([])
    const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(0)
    const [isPLaying, setIsPLaying] = useState(false)
    const [isLooping, setIsLooping] = useState(false)
    const [isShuffling, setIsShuffling] = useState(false)

    const hasPrevious = currentEpisodeIndex > 0
    const hasNext = isShuffling || (currentEpisodeIndex + 1) < episodeList.length

    const play = (episode: Episode) => {
        setEpisodeList([episode])
        setCurrentEpisodeIndex(0)
        setIsPLaying(true)
    }

    const playList = (list : Episode[], index : number) => {
        setEpisodeList(list)
        setCurrentEpisodeIndex(index)
        setIsPLaying(true)
    }

    const playNext = () => {

        if(isShuffling) {
            let nextRandomEpisodeIndex = Math.floor(Math.random() * episodeList.length)
            setCurrentEpisodeIndex(nextRandomEpisodeIndex)
        } else if (hasNext) {
            setCurrentEpisodeIndex(currentEpisodeIndex + 1)

        }
    }

    const playPrevious = () => {

        if (hasPrevious) {
            setCurrentEpisodeIndex(currentEpisodeIndex - 1)
        }
    }

    const togglePlay = () => setIsPLaying(!isPLaying)

    const toggleLoop = () => setIsLooping(!isLooping)
    
    const toggleShuffle = () => {
        setIsShuffling(!isShuffling)
    }

    const setPLayingState = (state: boolean) => setIsPLaying(state)

    const clearPlayerState = () => {
        setEpisodeList([])
        setCurrentEpisodeIndex(0)
    }

    return (
        <PlayerContext.Provider
            value={{ 
                episodeList,
                currentEpisodeIndex,
                play,
                playList,
                isPLaying,
                isLooping,
                isShuffling,
                togglePlay,
                toggleLoop,
                toggleShuffle,
                setPLayingState,
                playNext,
                playPrevious,
                hasNext,
                hasPrevious,
                clearPlayerState
            }}>
                {children}
        </PlayerContext.Provider>
    )
}

export const usePlayer = () => {
    return useContext(PlayerContext)
}




