"use client"
import { PieChartOutlined, HomeFilled, SettingFilled } from "@ant-design/icons";
import Image from "next/image";
import Link from "next/link";

const routes = [
  {
    path: "/",
    icon: <Image src={"/images/home.svg"} width={12} height={12} />,
    title: "Dashboard",
    roles: ["admin", "user"],
  },
  {
    path: "/orders/new-orders",
    icon: <Image src={"/images/new_order_icon.svg"} width={12} height={12} />,
    title: "New orders",
    roles: ["admin", "user", "nurse", "doctor", "aya", "patient", "physio"],
  },
  {
    path: "/orders/order-history",
    icon: (
      <Image src={"/images/order_history_icon.svg"} width={12} height={12} />
    ),
    title: "Orders History",
    roles: ["user", "admin", "doctor", "nurse", "aya", "patient", "physio"],
    childs: [
      {
        path: "/orders/completed",
        icon: (
          <Image src={"/images/completed_icon.svg"} width={12} height={12} />
        ),
        label: (
          <Link
            href="/orders/completed"
            className="font-normal  text-base font-poppins "
          >
            <button
              className="py-4 text-white px-4 bg-slate-700 "
              style={{ backgroundColor: "transparent", border: "none" }}
            >
              Completed
            </button>
          </Link>
        ),
        roles: ["admin", "user", "doctor", "aya", "patient", "physio"],
      },
      {
        path: "/orders/accepted",
        icon: (
          <Image src={"/images/completed_icon.svg"} width={12} height={12} />
        ),
        label: (
          <Link
            href="/orders/accepted"
            className="font-normal  text-base font-poppins "
          >
            <button
              className="py-4 text-white px-4 bg-slate-700 "
              style={{ backgroundColor: "transparent", border: "none" }}
            >
              Accepted
            </button>
          </Link>
        ),
        roles: ["admin", "user", "doctor", "aya", "patient", "physio"],
      },
      {
        path: "/orders/cancelled",
        icon: (
          <Image src={"/images/cancelled_icon.svg"} width={12} height={12} />
        ),
        label: (
          <Link
            href="/orders/cancelled"
            className="font-normal  text-base font-poppins "
          >
            <button
              className="py-4 text-white px-4 bg-slate-700 "
              style={{ backgroundColor: "transparent", border: "none" }}
            >
              Cancelled
            </button>
          </Link>
        ),
        roles: ["admin", "user", "doctor", "aya", "patient", "physio"],
      },
    ],
  },
  {
    path: `/profile`,
    icon: <Image src={"/images/analysis_icon.svg"} width={12} height={12} />,
    title: "Profile",
    roles: ["admin", "user", "nurse", "aya", "patient", "physio"],
  },
  {
    path: "/users",
    icon: <Image src={"/images/users_icon.svg"} width={12} height={12} />,
    title: "Users",
    roles: ["user", "admin", "rehab"],
    childs: [
      {
        path: "/doctors",
        icon: <Image src={"/images/doctors_icon.svg"} width={12} height={12} />,
        label: (
          <Link
            href="/doctors"
            className="font-normal  text-base font-poppins "
          >
            <button
              className="py-4 text-white px-4 bg-slate-700 "
              style={{ backgroundColor: "transparent", border: "none" }}
            >
              Doctors
            </button>
          </Link>
        ),
        roles: ["user", "admin", "rehab"],
      },
      {
        path: "/nurses",
        icon: <Image src={"/images/nurses_icon.svg"} width={12} height={12} />,
        label: (
          <Link href="/nurses" className="font-normal  text-base font-poppins ">
            <button
              className="py-4 text-white px-4 bg-slate-700 "
              style={{ backgroundColor: "transparent", border: "none" }}
            >
              Nurses
            </button>
          </Link>
        ),
        roles: ["user", "admin", "rehab"],
      },
      {
        path: "/patients",
        icon: (
          <Image src={"/images/patients_icon.svg"} width={12} height={12} />
        ),
        label: (
          <Link
            href="/patients"
            className="font-normal  text-base font-poppins "
          >
            <button
              className="py-4 text-white px-4 bg-slate-700 "
              style={{ backgroundColor: "transparent", border: "none" }}
            >
              Patients
            </button>
          </Link>
        ),
        roles: ["user", "admin", "rehab"],
      },
      {
        path: "/rehab",
        icon: <Image src={"/images/doctors_icon.svg"} width={12} height={12} />,
        label: (
          <Link href="/rehab" className="font-normal  text-base font-poppins ">
            <button
              className="py-4 text-white px-4 bg-slate-700 "
              style={{ backgroundColor: "transparent", border: "none" }}
            >
              Rehab Center
            </button>
          </Link>
        ),
        roles: ["user", "admin", "rehab"],
      },
      {
        path: "/aya",
        icon: <Image src={"/images/nurses_icon.svg"} width={12} height={12} />,
        label: (
          <Link href="/aya" className="font-normal  text-base font-poppins ">
            <button
              className="py-4 text-white px-4 bg-slate-700 "
              style={{ backgroundColor: "transparent", border: "none" }}
            >
              Aya
            </button>
          </Link>
        ),
        roles: ["user", "admin", "rehab"],
      },
      {
        path: "/physio",
        icon: <Image src={"/images/nurses_icon.svg"} width={12} height={12} />,
        label: (
          <Link href="/physio" className="font-normal  text-base font-poppins ">
            <button
              className="py-4 text-white px-4 bg-slate-700 "
              style={{ backgroundColor: "transparent", border: "none" }}
            >
              Physio
            </button>
          </Link>
        ),
        roles: ["user", "admin", "rehab"],
      },
    ],
  },
  {
    path: "/category",
    icon: <Image src={"/images/analysis_icon.svg"} width={12} height={12} />,
    title: "Category",
    roles: ["user", "admin"],
  },

  {
    path: "/analysis",
    icon: <Image src={"/images/analysis_icon.svg"} width={12} height={12} />,
    title: "Analysis",
    roles: ["user", "admin"],
  },
  // {
  //   path: "/expert-category",
  //   icon: <Image src={"/images/analysis_icon.svg"} width={12} height={12} />,
  //   title: "Experts Category",
  //   roles: ["user", "admin"],
  // },
  {
    path: "/expertProfile",
    icon: <Image src={"/images/analysis_icon.svg"} width={12} height={12} />,
    title: "Expert Profile",
    roles: ["expert"],
  },
  {
    // path: "/orders/order-history",
    icon: (
      <Image src={"/images/nurses_icon.svg"} width={12} height={12} />
    ),
    title: "Expert",
    roles: ["user", "admin", "expert"],
    childs: [
      {
        path: "expert-category",
        icon: (
          <Image src={"/images/completed_icon.svg"} width={12} height={12} />
        ),
        label: (
          <Link
            href="expert-category"
            className="font-normal  text-base font-poppins "
          >
            <button
              className="py-4 text-white px-4 bg-slate-700 "
              style={{ backgroundColor: "transparent", border: "none" }}
            >
             Categories
            </button>
          </Link>
        ),
        roles: ["user", "admin"],
      },
      {
        path: "experts",
        icon: (
          <Image src={"/images/completed_icon.svg"} width={12} height={12} />
        ),
        label: (
          <Link
            href="experts"
            className="font-normal  text-base font-poppins "
          >
            <button
              className="py-4 text-white px-4 bg-slate-700 "
              style={{ backgroundColor: "transparent", border: "none" }}
            >
            Experts Hospitals
            </button>
          </Link>
        ),
        roles: ["user", "admin"],
      },
      {
        path: "expert-doctor",
        icon: (
          <Image src={"/images/doctors_icon.svg"} width={12} height={12} />
        ),
        label: (
          <Link
            href="expert-doctor"
            className="font-normal  text-base font-poppins "
          >
            <button
              className="py-4 text-white px-4 bg-slate-700 "
              style={{ backgroundColor: "transparent", border: "none" }}
            >
            Experts Doctor
            </button>
          </Link>
        ),
        roles: ["user", "admin", "expert"],
      },
  
    ],
  },
];

export default routes;
