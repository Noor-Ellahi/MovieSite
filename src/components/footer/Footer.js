import React from "react";

// Css
import "@/components/footer/Footer.css"

// Icons:
import { FaFacebookF, FaGithub, FaLinkedin, FaGoogle } from "react-icons/fa";

const Footer = () => {


    return (
        <div className="mainFoot">
            <div className="mainIcon">
                <FaFacebookF className="footerIcon" />
                <FaGithub className="footerIcon" />
                <FaLinkedin className="footerIcon" />
                <FaGoogle className="footerIcon" />
            </div>
            <footer className="footer">
                © 2025 Noor. All Rights Reserved.
            </footer>
        </div>
    )
}


export default Footer