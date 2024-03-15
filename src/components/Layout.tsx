import React from "react";
import { Outlet } from "react-router-dom";
import { SideBar } from "./SideBar";

export const Layout: React.FC = () => {
  return (
    <section className="h-[100dvh] text-[#393939]">
      <SideBar />

      <div className="container-block pt-[60px] pl-[335px] pr-8">
        <Outlet />
      </div>
      
    </section>
  );
};
