import { BsTwitterX } from "react-icons/bs";
import { FaInstagramSquare } from "react-icons/fa";
import { FaFacebook } from "react-icons/fa";
import { FaYoutube } from "react-icons/fa";
import { MdEmail } from "react-icons/md";

export function Footer() {
    return (
        <footer className="p-6 bg-black mt-10">
            <h1
                className="text-gray-100 font-bold text-4xl mb-6">
                <span
                    className="text-red-600">
                    Play
                </span> Filmes e Series
            </h1>
            <div className="flex justify-between items-center">
                <ul className="flex gap-6">
                    <li><BsTwitterX className="w-8 h-auto" /></li>
                    <li><FaInstagramSquare className="w-8 h-auto" /></li>
                    <li><FaFacebook className="w-8 h-auto" /></li>
                    <li><FaYoutube className="w-8 h-auto" /></li>
                    <li><MdEmail className="w-8 h-auto" /></li>
                </ul>
                <nav className="flex gap-6 list-none">
                    <li><a href="">Lançamentos</a></li>
                    <li><a href="">Recomendados</a></li>
                    <li><a href="">Filmes</a></li>
                    <li><a href="">Series</a></li>
                </nav>
            </div>
        </footer>
    )
}