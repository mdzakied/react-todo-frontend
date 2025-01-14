import {  Outlet } from "react-router-dom";

//import HeroRegister from "@/assets/images/register-customer.png";
//import HeroTransaction from "@assets/images/transaction.png";

export default function Dashboard() {
  return (
    <>
      <section id="dashboardPage">
        {/* Outlet */}
        <Outlet />

        {/* Header */}
        <div className="flex flex-row justify-content-between align-items-center">
          {/*  Title and Subtitle */}
          <div>
            {/* Title */}
            <div>
              <span className="text-2xl font-medium">Dashboard</span>
            </div>
            {/* Subtitle */}
            <div>
              <span className="text-xs font-medium text-gray-500">
                Welcome back user to Todo Apps
              </span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-row">
          <div className="flex flex-row justify-content-center">
            <div className="grid w-full align-items-center ">

            </div>
          </div>
        </div>
      </section>
    </>
  );
}