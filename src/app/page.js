"use client"
import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

// Components
import Header from "@/components/navbar/Header";
import MovieSlider from "@/components/movieSlider/movieSlider";
import Footer from "@/components/footer/Footer";
// import MovieHome from "@/components/home.js";

const App = () => {
  // API KEY:
  const imdbId = process.env.NEXT_PUBLIC_IMDB_ID;

  // UseRouter:
  let router = useRouter()

  // refs:
  const divFadeRef = useRef(null)
  const sliderRef = useRef(null);
  const sliderRef1 = useRef(null);
  const sliderRef2 = useRef(null);

  // Usestates for Data :
  let [movieData, setMovieData] = useState(null)
  let [popularMovies, setPopularMovies] = useState(null)
  let [topMovies, setTopMovies] = useState(null)

  let [slideData, setSlideData] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0);
  const [trailerKey, setTrailerKey] = useState(null);
  const [loading, setLoading] = useState(true);



  const homeMovies = () => {
    const apiUrl = `https://api.themoviedb.org/3/movie/popular?api_key=${imdbId}&page=1`

    fetch(apiUrl)
      .then((data) => {

        return data.json()
      })
      .then((actData1) => {
        // console.log(actData1)
        setMovieData(actData1)
        setSlideData(actData1.results.slice(0, 3))
        setLoading(false)

      })
      .catch((err) => {
        console.log("Error :", err)
      })

  }


  const popularMoviesApi = async () => {
    // const apiUrl = "GET https://api.themoviedb.org/3/trending/movie/{time_window}?api_key=YOUR_API_KEY"
    const apiUrl = `https://api.themoviedb.org/3/trending/movie/day?api_key=${imdbId}`
    const res = await fetch(apiUrl)
    const data = await res.json()
    setPopularMovies(data)
    // console.log(data)
  }

  const HighRatedMovies = async () => {
    // const apiUrl = "https://api.themoviedb.org/3/movie/top_rated?api_key=296019a2e4f838e98830ce3aee9cd5e9&language=en-US&page=1"
    const apiUrl = `https://api.themoviedb.org/3/movie/top_rated?api_key=${imdbId}&language=en-US&page=1`

    const res = await fetch(apiUrl)
    const data = await res.json()
    setTopMovies(data)
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


  // Data sending to another Page
  const gotoPage2 = (item) => {
    router.push(`/movieInfo?id=${item}`)
  }

  // Change slide every 2 seconds
  useEffect(() => {
    if (slideData.length === 0) return;
    const interval = setInterval(() => {

      divFadeRef.current.style.opacity = "0"
      setTimeout(() => {
        setCurrentIndex(prevIndex =>
          prevIndex === slideData.length - 1 ? 0 : prevIndex + 1
        );
        divFadeRef.current.style.opacity = "1"

      }, 250)
    }, 8000);

    return () => clearInterval(interval); // cleanup when component unmounts
  }, [slideData]);

  const currentSlide = slideData.length > 0 ? slideData[currentIndex] : null;


  useEffect(() => {
    homeMovies()
    popularMoviesApi()
    HighRatedMovies()
  }, [])


  // Loading Screen:
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

    <div className="main">
      <Header />
      {currentSlide && (
        <div
          style={{
            backgroundImage: `linear-gradient(to right, rgba(0,0,0,1) 20%,rgba(0,0,0,0.6) 50%, rgba(0,0,0,0) 60% ), 
            url(https://image.tmdb.org/t/p/w500${currentSlide.backdrop_path})`,
            height: "91vh",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
          ref={divFadeRef}
          className="frontBackImg"
        >
          <div className="frontPage">
            <div className="innerFrontDiv">
              <h1 style={{ color: "white" }}>{currentSlide.title}</h1>
              <p style={{ color: "white" }}>{currentSlide.overview}</p>
              <div className="frontBtnDiv">
                <button onClick={() => getTrailer(currentSlide.id)} className="frontSpecialBtn">Watch Trailer</button>
                <button onClick={() => gotoPage2(currentSlide.id)}>More Info</button>
              </div>
            </div>
          </div>
        </div>
      )
      }

      <MovieSlider
      moviesList={movieData}
      gotoPage2={gotoPage2}
      h2Context={"Latest Movies"}
      />

      <MovieSlider
      moviesList={popularMovies}
      gotoPage2={gotoPage2}
      h2Context={"Popular Movies of the Month"}
      />

      <MovieSlider
      moviesList={topMovies}
      gotoPage2={gotoPage2}
      h2Context={"High Rated Movies of all Time"}
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



export default App