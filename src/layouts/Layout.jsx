import { Outlet } from "react-router-dom";

import Navbar from "@shared/components/Navigation/Navbar";

export default function Layout() {
  return (
    <>
      <section id="layout">
        <div id="content">
          <div className="flex flex-row">
            <div className="w-screen">
              {/* Navbar */}
              <nav className="shadow-2 mb-4">
                <Navbar />
              </nav>

              {/* Page */}
              <div className="px-4 pb-4">
                <Outlet />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
