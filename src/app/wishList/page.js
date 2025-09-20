"use client"
import Header from "@/components/navbar/Header";

import React, { useEffect, useRef, useState } from "react";
// Libaries
import { formatDistanceToNow, set } from 'date-fns';
import { useOnClickOutside } from 'usehooks-ts';
import Button from '@mui/material/Button';

import fallback from "@/images/fallback.jpg"
import Image from "next/image";

// Context:
import { useMovie } from "@/context/MovieContext";

import MovieWishItem from "@/components/movieWishItem/movieWishItem"; // NEW component for each item

import "@/app/wishList/wishList.css"
import { useRouter } from "next/navigation";


const MovieWishList = () => {

    // API KEY:
    const imdbId = process.env.NEXT_PUBLIC_IMDB_ID;

    // // context:
    const { setUserMovieId, addMovie } = useMovie()

    // Router:
    const router = useRouter()

    // UseStates:
    const [getList, setGetList] = useState(null)
    const [genresBtnList, setGenresBtnList] = useState([])
    const [show, setShow] = useState(false)
    // const [open, setOpen] = useState(false)
    const [saveGenre, setSaveGenre] = useState(null)


    const [openIndex, setOpenIndex] = useState(null) // for main list
    // const [openGenreIndex, setOpenGenreIndex] = useState(null) // for genre list

    // Refs:
    const wishDropRef = useRef([])
    const genreDropRef = useRef(null)
    const sortDropRef = useRef(null)
    const toggleButtonRef = useRef(null)
    const toggleButtonRef1 = useRef(null)


    // Mobile Dropper
    const [showGenres, setShowGenres] = useState(false)

    const openGenres = () => setShowGenres(true)
    const closeOverlay = () => setShowGenres(false)



    // Library(UseHook-ts) items: // For genreDrop Closer after clicking outside
    useOnClickOutside(genreDropRef, (event) => {
        // close your dropdown instead of toggling
        if (toggleButtonRef.current?.contains(event.target)) return;
        genreDropRef.current?.classList.remove('genreDropActive')
    })

    // Library(UseHook-ts) items: // For sortDrop Closer after clicking outside
    useOnClickOutside(sortDropRef, (event) => {
        // close your dropdown instead of toggling
        if (toggleButtonRef1.current?.contains(event.target)) return;
        sortDropRef.current?.classList.remove('sortDropDivActive')
    })


    // Genre Dropper
    const GetGenresItems = () => {
        if (genreDropRef.current) {
            setTimeout(() => {
                genreDropRef.current.classList.toggle("genreDropActive")
            }, (200));
        }
    }


    // Sort Dropper
    const GetSortList = () => {
        if (sortDropRef.current) {
            setTimeout(() => {
                sortDropRef.current.classList.toggle("sortDropDivActive")

            }, (200));
        }
    }


    // Calling Genre Through Dropdown
    const callGenreList = (e, list) => {
        // console.log(list)
        setSaveGenre(e)
        let arr = []
        if (e.target.tagName === "LI") {
            if (list && list.length > 0) {
                list.map((item, index) => {
                    // console.log(item.genresArr)
                    item.genresArr.map((item1, index1) => {
                        // console.log(item1)
                        if (item1.includes(e.target.textContent)) {
                            // console.log(item)
                            arr.push(item)
                        }
                    })
                })
            }
            else {
                getList.map((item, index) => {
                    // console.log(item.genresArr)
                    item.genresArr.map((item1, index1) => {
                        // console.log(item1)
                        if (item1.includes(e.target.textContent)) {
                            // console.log(item)
                            arr.push(item)
                        }
                    })
                })
            }
            setGenresBtnList(arr)
            setShow(true)
            toggleButtonRef1.current.style.display = 'none'

        }
        e.stopPropagation()

    }

    // Calling SortVal through Dropdown
    const callSortList = (e) => {
        // console.log(e.target.textContent)
        if (e.target.textContent === "Date Added (Oldest)") {
            const sorted = [...getList].sort((a, b) => {
                return new Date(a.timeStored).getTime() - new Date(b.timeStored).getTime();
            });
            setGetList(sorted)
            // console.log(sorted)
        }
        else if (e.target.textContent === "Manual" || e.target.textContent === "Date Added (Newest)") {
            const getItem = localStorage.getItem("movies")
            const jsonData = JSON.parse(getItem)
            // console.log(jsonData)
            setGetList(jsonData)
        }
        else if (e.target.textContent === "Most popular") {
            const getItem = [...getList].sort((a, b) => {
                return b.rating - a.rating
            })
            setGetList(getItem)
            // console.log(getItem)
        }

        // setOpen(true)
    }

    // Call All wishMovies  by All Btn
    const GetAllItems = () => {
        if (localStorage.getItem("movies") != null) {
            let fetch = localStorage.getItem("movies")
            let json = JSON.parse(fetch)
            setGetList(json)
            setShow(false)
            toggleButtonRef1.current.style.display = 'block'
            // console.log(json)
        }
    }


    // Removing movie through Li Dropdown
    const removeWishList = (item, index, movieId1) => {
        // console.log(item , index)
        if (!show) {
            console.log(index)
            let bucket = [...getList]
            // console.log(bucket)
            bucket.splice(index, 1)
            setGetList(bucket)
            setUserMovieId(bucket)
            localStorage.setItem("movies", JSON.stringify(bucket))
            // wishDropRef.current[index].classList.toggle('wishActive')
            // console.log(bucket)
        }
        else {

            let inde1x = getList.findIndex(obj => obj.movieId === movieId1)
            // console.log(getList)
            // console.log(inde1x)
            let bucket = [...getList]
            // console.log(bucket)
            bucket.splice(inde1x, 1)
            setGetList(bucket)
            setUserMovieId(bucket)
            localStorage.setItem("movies", JSON.stringify(bucket))
            // wishDropRef.current[index].classList.toggle('wishActive')
            callGenreList(saveGenre, bucket)

            // console.log(genresBtnList)
        }

    }


    // For testing purpose
    // // wishDropdown:
    // const WishDrop = (item, index, e) => {
    //     if (open == index) {
    //         // console.log(open , index)
    //         wishDropRef.current[index].classList.toggle('wishActive')
    //     }
    //     else {
    //         wishDropRef.current[open].classList.toggle('wishActive')
    //     }
    //     e.stopPropagation()
    //     setOpen(index)
    // }


    // For toggling Li Dropdown By using component
    const handleToggle = (index) => {
        setOpenIndex(prev => {
            // console.log("Pre" , prev , "aft" , index)
            return (prev === index ? null : index)
        })
    }

    // Data sending to another Page
    const gotoPage2 = (item) => {
        // console.log(item)
        router.push(`/movieInfo?id=${item}`)
    }

    // Getting DataList:
    useEffect(() => {
        if (localStorage.getItem("movies") != null) {
            let fetch = localStorage.getItem("movies")
            let json = JSON.parse(fetch)
            setGetList(json)
            // console.log(json)
        }
    }, [])


    return (

        <div>
            <Header />
            <div className="backWishDiv">
                <div className="innerWishDiv">
                    {/* <h1 style={{color : "#FFF", opacity: ".7"}}>
                        Watch Later
                    </h1> */}
                    <div className="sideWishBar">
                        <Image
                            src={(getList !== null && getList.length > 0) ? "https://image.tmdb.org/t/p/w500" + getList[0].path : fallback}
                            width={100}
                            height={100}
                            priority={true}
                            alt="sideImg"
                        />
                        <div className="sideInfoBar">
                            <h1>Watch Later</h1>
                            <p>{getList && getList.length > 0 ? getList.length : "No available"} Movies</p>
                            <p>{getList !== null && getList.length > 0 ? "Last updated " + formatDistanceToNow(new Date(getList[0].timeStored), { addSuffix: true }) : "No Item Found"}</p>
                        </div>
                    </div>

                    <div className="wishListCont">
                        <div className="wishBtnsDiv">
                            <div className="innerWishBtns">
                                <Button onClick={GetSortList} ref={toggleButtonRef1} className={"special1"}  ><span style={{ fontSize: '20px', paddingRight: '5px' }}>♦</span> Sort</Button>
                                <button onClick={GetAllItems} className={!show ? "innerWishOne" : ""} >All</button>
                                <button onClick={openGenres} className={"mobileGenrer"}>Genres</button>
                                <button onClick={GetGenresItems} ref={toggleButtonRef} className={show ? "innerWishOne" : ""} id="displayGenrer">Genres</button>
                            </div>

                            <div className="sortDropDiv" ref={sortDropRef} onClick={e => callSortList(e)}>
                                <ul>
                                    <li>Date Added (Newest)</li>
                                    <li>Date Added (Oldest)</li>
                                    <li>Manual</li>
                                    <li>Most popular</li>
                                </ul>
                            </div>

                            {/* For genre drop */}
                            <div className="genreDropDiv" ref={genreDropRef} onClick={e => callGenreList(e)}>
                                <div>
                                    <ul >
                                        <li>Action</li><li>Adventure</li><li>Animation</li><li>Comedy</li>
                                    </ul>
                                    <ul>
                                        <li>Crime</li><li>Documentary</li><li>Drama</li><li>Family</li>
                                    </ul>
                                    <ul>
                                        <li>Fantasy</li><li>History</li><li>Horror</li><li>Music</li>
                                    </ul>
                                    <ul>
                                        <li>Mystery</li><li>Romance</li><li>Science Fiction</li>
                                    </ul>
                                    <ul>
                                        <li>Thriller</li><li>War</li><li>Western</li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* Overlay for filters */}
                        <div className={`overlay ${showGenres ? 'active' : ''}`} onClick={closeOverlay}>
                            <div className="overlayContent" onClick={e => callGenreList(e)}>
                                <h3>Choose a Genre</h3>
                                <ul>
                                    <li>Action</li><li>Adventure</li><li>Animation</li><li>Comedy</li>
                                    <li>Crime</li><li>Documentary</li><li>Drama</li><li>Family</li>
                                    <li>Fantasy</li><li>History</li><li>Horror</li><li>Music</li>
                                    <li>Thriller</li><li>War</li><li>Western</li>
                                </ul>
                            </div>
                        </div>



                        {/* <ul>
                            {
                                (getList && getList.length > 0 && !show) ?
                                    (
                                        getList.map((item, index) => {
                                            let poster = "https://image.tmdb.org/t/p/w500" + item.path
                    
                                            return (
                                                <li key={index} className="wishListy" onClick={() => gotoPage2(item.movieId)} >
                                                    <div className="wishListyInfoDiv">
                                                        <div>
                                                            <Image
                                                                src={item.path ? poster : fallback}
                                                                priority={true}
                                                                width={100}
                                                                height={100}
                                                                alt="MovieImg"
                                                            />
                                                        </div>
                                                        <div className="wishInfoChild">
                                                            <p>{item.title}</p>
                                                            <p>{item.genresArr.map((item1, index1) => { return <span key={index} className="wishGenres">{item1.join(" • ")} </span> })} • {(item.lang)} • {formatDistanceToNow(new Date(item.timeStored), { addSuffix: true })}</p>
                                                        </div>

                                                    </div>
                                                    <div className="wishListEndDiv">
                                                        <p> ⭐ {item.rating.toFixed(1)}</p>
                                                        <div className="wishEndDivBtn">
                                                            <button
                                                                onClick={(e) => WishDrop(item, index, e)}
                                                            >⋮</button>
                                                        </div>
                                                    </div>

                                                    <div
                                                        className="dropDownWish"
                                                        ref={(el) => (wishDropRefs.current[index] = el)}

                                                    >
                                                        <ul onClick={(e) => e.stopPropagation()}>
                                                            <li onClick={() => gotoPage2(item.movieId)}>
                                                                Watch
                                                            </li>
                                                            <li onClick={() => removeWishList(item, index)}>
                                                                🗑 Remove
                                                            </li>
                                                        </ul>
                                                    </div>

                                                </li>
                                            )
                                        })
                                    ) :
                                    (
                                        // <div className="notFoundDiv"><h1 onClick={() => router.push('/moviePage')}>Add movies</h1></div>
                                        null
                                    )
                            }
                        </ul> */}

                        <ul>
                            {getList && getList.length > 0 && !show && getList.map((item, index) => (
                                <MovieWishItem
                                    key={item.movieId}
                                    item={item}
                                    index={index}
                                    isOpen={openIndex === index}
                                    // onOpen={() => setOpenIndex(index)}
                                    onToggle={() => handleToggle(index)}
                                    onClose={() => setOpenIndex(null)}
                                    removeWishList={removeWishList}
                                    gotoPage2={gotoPage2}
                                />
                            ))}


                        </ul>

                        <ul>
                            {show && genresBtnList && genresBtnList.length > 0 && (
                                genresBtnList.map((item, index) =>
                                    <MovieWishItem
                                        key={item.movieId}
                                        item={item}
                                        index={index}
                                        isOpen={openIndex === index}
                                        // onOpen={() => setOpenIndex(index)}
                                        onToggle={() => handleToggle(index)}
                                        onClose={() => setOpenIndex(null)}
                                        removeWishList={removeWishList}
                                        gotoPage2={gotoPage2}
                                    />
                                )
                            )}
                        </ul>

                    </div>
                </div>
            </div>
        </div>
    )

}


export default MovieWishList






