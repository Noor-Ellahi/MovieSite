import React, { useRef } from 'react'
import { useOnClickOutside } from 'usehooks-ts'
import Image from 'next/image'
import fallback from "@/images/fallback.jpg"
import { formatDistanceToNow } from 'date-fns'

const MovieWishItem = ({
  item,
  index,
  isOpen,
  onToggle,
  onClose,
  removeWishList,
  gotoPage2
}) => {
  const dropdownRef = useRef(null)
  const toggleButtonRef = useRef(null)
  useOnClickOutside(dropdownRef, ()=>{
    if (toggleButtonRef.current?.contains(event.target)) return;
    onClose()
  })

  let poster = "https://image.tmdb.org/t/p/w500" + item.path

  return (
    <li className="wishListy"  >
      <div className="wishListyInfoDiv" onClick={() => gotoPage2(item.movieId)}>
        <div>
          <Image src={item.path ? poster : fallback} priority={true} width={100} height={100} alt="MovieImg" />
        </div>
        <div className="wishInfoChild">
          <p>{item.title}</p>
          <p>{item.genresArr.map((item1, index1) => (
            <span key={index1} className="wishGenres">{item1.join(" • ")} </span>
          ))} • {item.lang ? item.lang + ' •' : null}  {formatDistanceToNow(new Date(item.timeStored), { addSuffix: true })}</p>
        </div>
      </div>
      <div className="wishListEndDiv">
        <p> ⭐ {item.rating.toFixed(1)}</p>
        <div className="wishEndDivBtn">
          <button
            ref={toggleButtonRef}
            onClick={(e) => {
              e.stopPropagation()
              // onOpen()
              onToggle()
            }}
          >⋮</button>
        </div>
      </div>
      {isOpen && (
        <div className="dropDownWish" ref={dropdownRef}>
          <ul onClick={(e) => e.stopPropagation()}>
            <li onClick={() => gotoPage2(item.movieId)}>Watch</li>
            <li onClick={() => removeWishList(item, index, item.movieId)}>🗑 Remove</li>
          </ul>
        </div>
      )}
    </li>
  )
}

export default MovieWishItem