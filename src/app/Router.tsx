import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "@pages/LoginPage";
import RegistPage from "@src/pages/RegistPage";


export default function Router() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<LoginPage/>} />
                <Route path="/regist" element={<RegistPage/>} />
            </Routes>
        </BrowserRouter>
    )
}

