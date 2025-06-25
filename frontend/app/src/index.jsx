import React from 'react';
import ReactDOM from 'react-dom/client';
//import { createHashRouter, RouterProvider } from "react-router-dom";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import './index.css';
import TopBarPresenter from './topBar/topBarPresenter';
import SideBarPresenter from './sideBar/sideBarPresenter';
import DashboardPresenter from './router/dashboard/dashBoardPresenter';
import SensorsPresenter from './router/sensors/sensorsPresenter';
import MotorsPresenter from './router/motors/motorsPresenter';
import ControlsPresenter from './router/controls/controlsPresenter';
import HydraulicSystemsPresenter from "./router/hydraulicSystems/hydraulicSystemsPresenter";
import HeadCutterPresenter from "./router/headCutter/headCutterPresenter";
import DebrisTransportPresenter from "./router/debrisTransport/debrisTransportPresenter";
//import reportWebVitals from './reportWebVitals';

function makeRouter() {
 
  return (
    <Routes>
      <Route path="/" element={<DashboardPresenter />} />
      <Route path="/dashboard" element={<DashboardPresenter />} />
      <Route path="/sensors" element={<SensorsPresenter />} />
      <Route path="/controls" element={<ControlsPresenter />} />
      <Route path="/motors" element={<MotorsPresenter />} />
      <Route path="/hydraulic" element={<HydraulicSystemsPresenter />} />
      <Route path="/cutter" element={<HeadCutterPresenter />} />
      <Route path="/transport" element={<DebrisTransportPresenter />} />
    </Routes>
  );
}


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode >
    <BrowserRouter>
      <TopBarPresenter />
      <hr />
      <div className="inline-flex min-h-screen w-full bg-[#6E89BB]">
        <SideBarPresenter />
        
        {makeRouter()}
      </div>
    </BrowserRouter>
  </React.StrictMode>
);
