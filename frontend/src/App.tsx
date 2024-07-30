import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Test from "./Test";
import Login from "./pages/Login";

function App() {
  return (
    <main className="bg-zinc-900 w-full overflow-hidden text-zinc-200 min-h-dvh p-32 flex flex-col gap-8">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/test" element={<Test />} />
      </Routes>
    </main>
  );
}

export default App;
