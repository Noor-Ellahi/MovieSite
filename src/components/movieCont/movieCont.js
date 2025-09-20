import React from "react";
import Image from "next/image";
import fallback from '@/images/fallback.jpg'


const MovieCont = ({
    moviesList,
    currentPage,
    backToPrevious,
    goToNext,
    gotoPage2
}) => {


    return (
        <>
            <div className="childCont">
                {
                    moviesList.slice(0, 49).map((item, index) => {
                        let poster = "https://image.tmdb.org/t/p/w500" + item.poster_path
                        return (
                            <ul key={index} onClick={() => gotoPage2(item.id)}>
                                <li
                                >
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
                    })

                }



            </div>

            <div className="pageFont">
                <h5>
                    Page : {currentPage.current}
                </h5>
            </div>

            <div className="btnDiv">
                <button
                    onClick={backToPrevious}
                >
                    ⬅
                </button>
                <button
                    onClick={goToNext}
                >
                    ➡
                </button>
            </div>


        </>
    )
}


export default MovieCont