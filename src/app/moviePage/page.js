
"use client"
import React, { useState, useRef, useEffect } from "react";
import Image from "next/image"
import "@/app/moviePage/moviePage.css"

import fallback from '@/images/fallback.jpg'
import { useRouter } from "next/navigation";
import Header from "@/components/navbar/Header";
import MovieCont from "@/components/movieCont/movieCont";

const MovieHome = () => {

    // API KEY:
    const imdbId = process.env.NEXT_PUBLIC_IMDB_ID;

    // usestates:
    const [movieData, setMovieData] = useState(null)
    let [inputVal, setInputVal] = useState("")
    let [movies, setMovies] = useState(null)
    const [loading, setLoading] = useState(true);
    const [genresMovies, setGenreMovies] = useState(null)
    const [copyGenres, setCopyGenres] = useState(null)

    // Refs :
    let inputRef = useRef()
    let testRef = useRef()
    let currentPage = useRef(1)
    let currentPage1 = useRef(1)

    // Routers:
    let router = useRouter()



    // For Enter key to work on input:
    const handleKeyDown = (event) => {
        if (event.key === "Enter") {
            inputRef.current?.click()
        }
    }

    // Not using : 20 movies Api Limit (Not using this one)

    // For a mixture of 3 apis to get 50 movies at Once
    const fetchMovies = async () => {
        const page1Count = (currentPage.current - 1) * 3 + 1;
        const page2Count = (currentPage.current - 1) * 3 + 2;
        const page3Count = (currentPage.current - 1) * 3 + 3;
        const page1 = fetch(`https://api.themoviedb.org/3/movie/popular?api_key=${imdbId}&page=${page1Count}`).then(res => res.json());
        const page2 = fetch(`https://api.themoviedb.org/3/movie/popular?api_key=${imdbId}&page=${page2Count}`).then(res => res.json());
        const page3 = fetch(`https://api.themoviedb.org/3/movie/popular?api_key=${imdbId}&page=${page3Count}`).then(res => res.json());
        const [data1, data2, data3] = await Promise.all([page1, page2, page3]);

        setMovies([...data1.results, ...data2.results, ...data3.results]); // merge both pages
        setLoading(false)
        // console.log(movies)
    };

    // Related movies API
    const movieGenres = async (genres) => {
        // If genre changes → reset page
        if (genres !== copyGenres) {
            currentPage1.current = 1;
        }

        const page1Count = (currentPage1.current - 1) * 3 + 1;
        const page2Count = (currentPage1.current - 1) * 3 + 2;
        const page3Count = (currentPage1.current - 1) * 3 + 3;
        setCopyGenres(genres)
        // console.log(genres[0])
        const page1 = fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${imdbId}&with_genres=${genres}&page=${page1Count}`).then(res => res.json())
        const page2 = fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${imdbId}&with_genres=${genres}&page=${page2Count}`).then(res => res.json())
        const page3 = fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${imdbId}&with_genres=${genres}&page=${page3Count}`).then(res => res.json())

        const [data1, data2, data3] = await Promise.all([page1, page2, page3])

        setGenreMovies([...data1.results, ...data2.results, ...data3.results]);
        setMovies(null)
        setMovieData(null)
        console.log(data1.results, data2.results, data3.results)
        // sessionStorage.setItem("genre", genres);
        // console.log(apiUrl)
    }

    // For Input Values
    const btn = () => {
        const apiUrl = `https://api.themoviedb.org/3/search/movie?api_key=${imdbId}&query=${inputVal}`
        fetch(apiUrl)
            .then((data) => {

                // console.log(data)

                return data.json()
            })
            .then((actData) => {
                // console.log(actData)
                setMovieData(actData)
            })

            .catch((err) => {
                console.log("Error :", err)
            })
        setInputVal("")
    }

    // For ABCD Events to work:
    const alphaBtnFunc = () => {
        const apiUrl = `https://api.themoviedb.org/3/search/movie?api_key=${imdbId}&query=${testRef.current}`
        fetch(apiUrl)
            .then((data) => {

                // console.log(data)

                return data.json()
            })
            .then((actData) => {
                console.log(actData)
                setMovieData(actData)
            })

            .catch((err) => {
                console.log("Error :", err)
            })

    }

    // For going To next Page
    const goToNext = () => {
        if (genresMovies) {
            currentPage1.current += 1
            movieGenres(copyGenres)
        }
        else {
            currentPage.current += 1
            fetchMovies()
        }
        // movieGenres(copyGenres)
        router.push("/moviePage")
        setTimeout(() => {
            router.refresh()
        }, (50));
    }

    const backToPrevious = () => {
        if (genresMovies) {
            if (currentPage1.current > 1) {
                currentPage1.current -= 1
                movieGenres(copyGenres)
            }
        }
        else {
            if (currentPage.current > 1) {
                currentPage.current -= 1
                fetchMovies()
            }
        }
        router.push("/moviePage")
        setTimeout(() => {
            router.refresh()
        }, (50));
    }


    const backToHome = () => {
        setMovieData(null)

    }

    const alphaFunc = (even) => {
        testRef.current = even.target.innerHTML
        // console.log(testRef.current)
        alphaBtnFunc()
        testRef.current = undefined
    }

    // Data sending to another Page
    const gotoPage2 = (item) => {
        router.push(`/movieInfo?id=${item}`)
    }

    // UseEffects:
    useEffect(() => {
        fetchMovies()
    }, [])


    // Loading Screen
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
        <div className="mainMovieCont">
            <div className="innerMovieCont">
                <Header />
                <div className="searchDiv">
                    <div>
                        <select name="movie_selection" defaultValue={"All genres"} onChange={(e) => movieGenres(e.target.value)}>
                            <option value="all">All genres</option>
                            <option value="28">Action</option>
                            <option value="12" >Adventure</option>
                            <option value="16">Animation</option>
                            <option value="35">Comedy</option>
                            <option value="80">Crime</option>
                            <option value="99">Documentary</option>
                            <option value="18">Drama</option>
                            <option value="10751">Family</option>
                            <option value="14">Fantasy</option>
                            <option value="36">History</option>
                            <option value="27">Horror</option>
                            <option value="10402">Music</option>
                            <option value="9648">Mystery</option>
                            <option value="10749">Romance</option>
                            <option value="878">Sci-fi</option>
                            <option value="53">Thriller</option>
                            <option value="10752">War</option>
                            <option value="37">Western</option>
                        </select>
                        <input
                            type="text"
                            placeholder="Search...."
                            value={inputVal}
                            onChange={(e) => {
                                setInputVal(e.target.value)
                            }}
                            onKeyDown={handleKeyDown}
                        />
                        <button
                            ref={inputRef}
                            onClick={btn}
                        >
                            🔍︎
                        </button>
                    </div>

                    <div className="alphaSearch" >
                        <a onClick={alphaFunc}>a</a>
                        <a onClick={alphaFunc}>b</a>
                        <a onClick={alphaFunc}>c</a>
                        <a onClick={alphaFunc}>d</a>
                        <a onClick={alphaFunc}>e</a>
                        <a onClick={alphaFunc}>f</a>
                        <a onClick={alphaFunc}>g</a>
                        <a onClick={alphaFunc}>h</a>
                        <a onClick={alphaFunc}>i</a>
                        <a onClick={alphaFunc}>j</a>
                        <a onClick={alphaFunc}>k</a>
                        <a onClick={alphaFunc}>l</a>
                        <a onClick={alphaFunc}>m</a>
                        <a onClick={alphaFunc}>n</a>
                        <a onClick={alphaFunc}>o</a>
                        <a onClick={alphaFunc}>p</a>
                        <a onClick={alphaFunc}>q</a>
                        <a onClick={alphaFunc}>r</a>
                        <a onClick={alphaFunc}>s</a>
                        <a onClick={alphaFunc}>t</a>
                        <a onClick={alphaFunc}>u</a>
                        <a onClick={alphaFunc}>v</a>
                        <a onClick={alphaFunc}>w</a>
                        <a onClick={alphaFunc}>x</a>
                        <a onClick={alphaFunc}>y</a>
                        <a onClick={alphaFunc}>z</a>
                    </div>
                </div>
                <div className="movieFont">
                    <h5>
                        Movies : <span>All</span>
                    </h5>
                </div>
                {
                    (movieData)
                        ?
                        (
                            <>
                                <div className="childCont">
                                    {
                                        movieData.results.map((item, index) => {

                                            let poster = "https://image.tmdb.org/t/p/w500" + item.poster_path

                                            return (
                                                <ul
                                                    key={index}
                                                    onClick={() => gotoPage2(item.id)}
                                                >
                                                    <li>
                                                        <Image
                                                            src={item.poster_path ? (poster) : (fallback)}
                                                            height={100}
                                                            width={100}
                                                            alt="Img"
                                                            priority="true"
                                                        />
                                                        <div>
                                                            <h3>{item.original_title}</h3>
                                                            <p>{item.overview}</p>
                                                            <p className="voting">⭐ {item.vote_average.toFixed(1)}</p>
                                                            <h3>{item.release_date.slice(0, 4)}</h3>
                                                        </div>
                                                    </li>
                                                </ul>
                                            )
                                        })
                                    }
                                </div>
                                <div className="backHomeDiv">
                                    <button
                                        onClick={backToHome}
                                    >
                                        🏠︎
                                    </button>
                                </div>
                            </>
                        ) : (null)
                }



                {
                    (movies && !movieData) ?
                        (
                            <MovieCont
                                moviesList={movies}
                                currentPage={currentPage}
                                backToPrevious={backToPrevious}
                                goToNext={goToNext}
                                gotoPage2={gotoPage2}
                            />
                        )
                        :
                        (
                            null
                        )
                }

                {
                    (genresMovies && !movies && !movieData) ?
                        (
                            <MovieCont
                                moviesList={genresMovies}
                                currentPage={currentPage1}
                                backToPrevious={backToPrevious}
                                goToNext={goToNext}
                                gotoPage2={gotoPage2}
                            />
                        ) :
                        (
                            null
                        )
                }

            </div>
        </div>
    )
}


export default MovieHome



