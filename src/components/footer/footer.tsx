
// icons
import { BsTwitterX } from "react-icons/bs";
import { FaInstagramSquare } from "react-icons/fa";
import { FaFacebook } from "react-icons/fa";
import { FaYoutube } from "react-icons/fa";
import { MdEmail } from "react-icons/md";

export function Footer() {
    return (
        <footer className="p-6 bg-black mt-10 max-xl:p-2">
            <h1
                className="text-gray-100 font-bold text-4xl mb-6 max-md:text-center max-sm:text-3xl">
                <span
                    className="text-red-600">
                    Play
                </span> Movie and Series
            </h1>
            <div className="flex justify-between items-center max-md:flex-col max-md:gap-6">
                <ul className="flex gap-6">
                    <li><BsTwitterX className="w-8 h-auto cursor-pointer" /></li>
                    <li><FaInstagramSquare className="w-8 h-auto cursor-pointer" /></li>
                    <li><FaFacebook className="w-8 h-auto cursor-pointer" /></li>
                    <li><FaYoutube className="w-8 h-auto cursor-pointer" /></li>
                    <li><MdEmail className="w-8 h-auto cursor-pointer" /></li>
                </ul>
                <ul className="flex gap-6 list-none flex-wrap justify-center max-sm:gap-3">
                    <li><a href="#">Release</a></li>
                    <li><a href="#">Recommendation</a></li>
                    <li><a href="#">Movies</a></li>
                    <li><a href="#">Series</a></li>
                </ul>
            </div>
        </footer>
    )
}