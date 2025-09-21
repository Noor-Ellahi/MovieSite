"use client"
import React, { useEffect, useState, useRef } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import fallback from "@/images/fallback.jpg"

// Context:
import { useMovie } from "@/context/MovieContext";

// Components:
import Header from "@/components/navbar/Header";
import Footer from "@/components/footer/Footer";
import MovieSlider from "@/components/movieSlider/movieSlider";

// Css:
import "@/app/movieInfo/movieInfo.css"
import { useRouter } from "next/navigation";

// Alert library :(
import { ToastContainer,toast } from 'react-toastify';

const MovieInfo = () => {

    // API KEY:
    const imdbId = process.env.NEXT_PUBLIC_IMDB_ID;

    // context:
    const { userMovieId, addMovie } = useMovie()

    // Movie Id
    const searchParams = useSearchParams();
    const id = searchParams.get("id");

    // Routers:
    const router = useRouter()

    // Refs:
    // const sliderRef = useRef(null);
    const idRef = useRef(id)

    // Usestate:
    const [movieId, setMovieId] = useState(null)
    const [genreMovie, setGenreMovies] = useState(null)
    const [trailerKey, setTrailerKey] = useState(null)
    const [loading, setLoading] = useState(true);


    // Related movies API
    const movieGenres = async (genres) => {
        // console.log(genres[0])
        const apiUrl = `https://api.themoviedb.org/3/discover/movie?api_key=${imdbId}&with_genres=${genres[0].id}`
        const res = await fetch(apiUrl)
        const data = await res.json()
        setGenreMovies(data)
        // console.log(data)
    }

    // APi for Getting trailer by getting movie id 
    const getTrailer = async (movieId) => {
        const apiUrl = `https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=${imdbId}`
        const res = await fetch(apiUrl);
        const data = await res.json()
        // console.log(data.results)
        const trailer = data.results.find(v => v.site === "YouTube" && v.type === "Trailer");
        if (trailer) {
            // window.open(`https://www.youtube.com/watch?v=${trailer.key}`, "_blank")
            setTrailerKey(trailer.key)
        }
        else {
            alert("Trailer not found")
        }
    }

    // Get Movie Data With ID coming from params
    const getMovie = async () => {
        const apiUrl = `https://api.themoviedb.org/3/movie/${idRef.current}?api_key=${imdbId}`
        const res = await fetch(apiUrl)
        const data = await res.json()
        setMovieId(data)
        movieGenres(data.genres)
        setLoading(false)
        // console.log(data)
    }

    // WishList:
    const Wishlist = (id) => {
        const getItem = localStorage.getItem("movies")
        const jsoN = JSON.parse(getItem)
        var valCheck = false
        let obj = {
            path: id.poster_path,
            title: id.original_title,
            rating: id.vote_average,
            runtime: id.runtime,
            movieId: id.id,
            timeStored: new Date().toISOString(),
            genresArr: []
        }
        id.spoken_languages.map((item, index) => {
            if (item.english_name === "English") {
                obj.lang = item.english_name
            }
        })
        let arr = []
        id.genres.map((item, index) => {
            arr.push(item.name)
        })
        obj.genresArr.push(arr.slice(0, 2))
        addMovie(obj)
        jsoN.map((item)=>{
            // console.log(item.title)
            if(item.title === id.original_title){
                valCheck = true
                return valCheck
            }
        })
        if(valCheck){
            toast(`Movie(${id.original_title}) is already added`)
        }
        else{
            toast(`Movie(${id.original_title}) added`)
        }
        
        // console.log(obj.genresArr)
        // console.log(jsoN.title)
        // console.log(userMovieId)

    }

    // Data sending to another Page
    const gotoPage2 = (item) => {
        router.push(`/movieInfo?id=${item}`)
        router.refresh()
        idRef.current = null
    }

    // Importing for Rendering movies IN movieInfo Page
    useEffect(() => {
        // if(id){
        //     getMovie(id)
        // }
        if (idRef.current != null) {
            null
        }
        else {
            const newId = searchParams.get("id")
            // console.log(newId)
            idRef.current = newId
            getMovie()
        }
    }, [idRef.current])
    // }, [id]);


    useEffect(() => {
        getMovie()
    }, [])

    if (loading) {
        return (
            <div className="mainLoad">
                <div className="jumpDotsDiv">
                    <span className="dot"></span>
                    <span className="dot"></span>
                    <span className="dot"></span>
                    <span className="dot"></span>
                </div>
            </div>
        )
    }

    return (
        <div>
            <ToastContainer theme="dark"/>
            <Header />


            <div className="mainInfoDiv">
                {
                    (movieId) ?
                        (<>
                            <div>
                                <Image
                                    src={movieId.poster_path ? `https://image.tmdb.org/t/p/w500${movieId.poster_path}` : fallback}
                                    alt="movieImg"
                                    priority={true}
                                    width={100}
                                    height={100}
                                />
                            </div>
                            <div className="innerInfoDiv">
                                <div className="infoChildDiv">
                                    <div className="lastInnerDiv">
                                        <h1>{movieId.original_title}</h1>
                                        <ul>
                                            {movieId.production_companies.slice(0, 1).map((item, index) => {
                                                return (
                                                    <li key={index}>
                                                        {item.name}
                                                    </li>
                                                )
                                            })}
                                        </ul>
                                        <ul>
                                            {movieId.genres.map((item, index) => {
                                                return (
                                                    <li key={index}>
                                                        {item.name}
                                                    </li>
                                                )
                                            })}
                                        </ul>

                                        <div>
                                            <p>{movieId.runtime} mins</p>
                                            <p>{movieId.release_date}</p>
                                        </div>

                                        <p>{movieId.overview}</p>
                                    </div>

                                    <div className="childBtnDiv">
                                        <div>
                                            <button onClick={() => Wishlist(movieId)}>Add to wishlist</button>
                                            <button className="specialInfoBtn" onClick={() => getTrailer(movieId.id)}>Watch Trailer</button>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </>)
                        :
                        (null)
                }
            </div>

            <MovieSlider
            moviesList={genreMovie}
            gotoPage2={gotoPage2}
            h2Context={"Related Movies"}
            />

            {trailerKey && (
                <div className="modalOverlay" onClick={() => setTrailerKey(null)}>
                    <div className="modalContent" onClick={e => e.stopPropagation()}>
                        <button onClick={() => setTrailerKey(null)}>X</button>

                        <iframe
                            width="560"
                            height="315"
                            src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1`}
                            title="YouTube trailer"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        ></iframe>
                    </div>
                </div>
            )}

            <Footer />
        </div>
    )
}

export default MovieInfo