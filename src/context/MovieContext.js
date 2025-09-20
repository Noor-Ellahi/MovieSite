"use client"

import React, { useContext, createContext, useEffect, useState } from "react"


const MovieContext = createContext()


export const MovieProvider = ({ children }) => {
    const [userMovieId, setUserMovieId] = useState([])


    useEffect(() => {
        const saved = localStorage.getItem("movies");
        if (saved) {
            setUserMovieId(JSON.parse(saved));
        }
    }, []);

    // Save to localStorage whenever movies change
    useEffect(() => {
        localStorage.setItem("movies", JSON.stringify(userMovieId));
    }, [userMovieId]);

    const addMovie = (movie) => {
        setUserMovieId((prev) => {
            // prevent duplicates by checking id
            if (prev.find((m) => m.title === movie.title)) {
                return [...prev]
            }
            else return [movie , ...prev];
        });
    };

    // Remove a movie by id
    const removeMovie = (id) => {
        setUserMovieId((prev) => prev.filter((m) => m.id !== id));
    };





    return (
        <MovieContext.Provider value={{ userMovieId, addMovie, removeMovie ,setUserMovieId }}>
            {children}
        </MovieContext.Provider>
    )
}


export const useMovie = () => useContext(MovieContext)