"use client"

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import "@/components/navbar/Header.css";
import { FaHome ,FaFilm , FaSave } from "react-icons/fa";


const  Header = () => {

  // Router:
  const router = useRouter()

  // Usestates :
  const [isActive  , setIsActive] = useState(false)


  // UseRefs:
  let dropDivRef = useRef() 



  const DropDown = () =>{


    setIsActive(!isActive)    
    // console.log(dropDivRef.current.style)

    // Smooth Transition
    dropDivRef.current.style.height = "0vh"
    dropDivRef.current.style.transition = ".5s"
    setTimeout(() => {
      dropDivRef.current.style.height = "25vh"
    }, (50));
  }



  return (
    <>
      <div className="header">
        <div className="logo" onClick={() => router.push("/") }>MovieJunction<span>.</span></div>
        <nav>
          <div onClick={()=> router.push("/")}><FaHome className="headerIcon"/> Home</div>
          <div onClick={()=>router.push("/moviePage")}><FaFilm className="headerIcon"/> Movies</div>
          <div onClick={()=> router.push("/wishList")}><FaSave className="headerIcon"/> WishList</div>
          {/* <Link href={"/"}>Home</Link>
          <Link href={"/moviePage"}>Movies</Link>
          <Link href={"/wishList"}>Wishlist</Link>
          <Link href={"/"}>Search</Link> */}
        </nav>
        <button className="burgerDropdown" onClick={DropDown}>☰</button>
      </div>

      <div className={`dropdown${!isActive ? "Div" : "Active" }`} ref={dropDivRef}>

        <ul className="dropList">
          {/* <li><Link href={"/"}>Home</Link></li>
          <li><Link href={"/moviePage"}>Movies</Link></li>
          <li><Link href={"/"}>Portfolio</Link></li>
          <li><Link href={"/"}>Contact</Link></li> */}
          <Link href={"/"}>Home</Link>
          <Link href={"/moviePage"}>Movies</Link>
          <Link href={"/wishList"}>WishList</Link>
          {/* <Link href={"/"}>Contact</Link> */}
        </ul>

      </div>

    </>
  );
}

export default Header;