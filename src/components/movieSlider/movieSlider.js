import React,{useRef} from "react"
import Image from 'next/image'
import fallback from "@/images/fallback.jpg"
import { useRouter } from "next/navigation";



const MovieSlider = ({
    moviesList,
    gotoPage2,
    h2Context
}) => {

    const sliderRef = useRef(null);
    const router = useRouter()

    // Scroll button:
    const slide = (direction) => {
        if (!sliderRef.current) return;
        const scrollAmount = direction === "left" ? -200 : 200;
        sliderRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    };

    return (
        <div className="mainMovieListCont listSpacing">
            <div className="movieText">
                <h2>
                    {h2Context}
                </h2>
                <h4 onClick={() => router.push("/moviePage") }>
                    View all
                </h4>
            </div>
            <div className="scrollBtnDiv">
                <button onClick={() => slide("left")}>◀</button>
                <button onClick={() => slide("right")}>▶</button>
            </div>

            <div className="movieListCont" ref={sliderRef}>
                {
                    (moviesList)
                        ?
                        (
                            moviesList.results.slice(0, 10).map((item, index) => {
                                let poster = "https://image.tmdb.org/t/p/w500" + item.poster_path
                                return (
                                    <ul key={index} onClick={() => gotoPage2(item.id)}>
                                        <li>
                                            <Image
                                                src={
                                                    item.poster_path ? (poster) : (fallback)
                                                }
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
                            }))
                        : (null)
                }
            </div>
        </div>
    )
}

export default MovieSlider