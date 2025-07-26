import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Layout from "@/components/organisms/Layout";
import TodayFocus from "@/components/pages/TodayFocus";
import TeamView from "@/components/pages/TeamView";
import MyProgress from "@/components/pages/MyProgress";
import WeeklySummaryPage from "@/components/pages/WeeklySummaryPage";
import APICatalogPage from "@/components/pages/APICatalogPage";

function App() {
  return (
    <BrowserRouter>
      <div className="App font-body">
        <Routes>
<Route path="/" element={<Layout />}>
            <Route index element={<TodayFocus />} />
            <Route path="team" element={<TeamView />} />
            <Route path="progress" element={<MyProgress />} />
            <Route path="summary" element={<WeeklySummaryPage />} />
            <Route path="apis" element={<APICatalogPage />} />
          </Route>
        </Routes>
        
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
          style={{ zIndex: 9999 }}
        />
      </div>
    </BrowserRouter>
  );
}

export default App;