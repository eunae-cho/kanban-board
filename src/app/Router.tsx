import { BrowserRouter, Routes, Route } from "react-router";
import LoginPage from "@pages/LoginPage";
import RegistPage from "@src/pages/RegistPage";
import KanbanPage from "@src/pages/KanbanPage";


export default function Router() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/"  element={<LoginPage/>} />
                <Route path="/regist" element={<RegistPage/>} />
                <Route path="/main" element={<KanbanPage/>} />
            </Routes>
        </BrowserRouter>
    )
}

