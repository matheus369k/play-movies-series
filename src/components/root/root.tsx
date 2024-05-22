import { Outlet } from "react-router";
import { Header } from "../header/header";
import { Footer } from "../footer/footer";

export function Root() {
    return (
        <>
            <Header />
            <main>
                <Outlet />
            </main>
            <Footer />
        </>
    )
}