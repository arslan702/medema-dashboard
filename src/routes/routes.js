import { PieChartOutlined, HomeFilled, SettingFilled } from "@ant-design/icons";
import Image from "next/image";
import Link from "next/link";
const routes = [
  {
    path: "/",
    icon: <Image src={'/images/home.svg'} width={12} height={12} />,
    title: "Dashboard",
    roles: ["admin", "user"],
  },
  {
    path: "/orders/new-orders",
    icon: <Image src={'/images/new_order_icon.svg'} width={12} height={12} />,
    title: "New orders",
    roles: ["admin", "user"],

  },
  // {
  //   path: "/orders/order-history",
  //   icon: <Image src={'/images/order_history_icon.svg'} width={12} height={12} />,
  //   title: "Order history",
  //   roles: ["user", "admin"],
  // },
  {
    path: "/orders/completed",
    icon: <Image src={'/images/completed_icon.svg'} width={12} height={12} />,
    title: "Completed",
    roles: ["user", "admin"],
  },
  {
    path: "/orders/cancelled",
    icon: <Image src={'/images/cancelled_icon.svg'} width={12} height={12} />,
    title: "Cancelled",
    roles: ["user", "admin"],
  },
  {
    path: "/orders/accepted",
    icon: <Image src={'/images/cancelled_icon.svg'} width={12} height={12} />,
    title: "Accepted",
    roles: ["user", "admin"],
  },
  {
    path: "/users",
    icon: <Image src={'/images/users_icon.svg'} width={12} height={12} />,
    title: "Users",
    roles: ["user", "admin"],
 
  },
  {
    path: "/doctors",
    icon: <Image src={'/images/doctors_icon.svg'} width={12} height={12} />,
    title: "Doctors",
    roles: ["user", "admin"],
  },
  {
    path: "/nurses",
    icon: <Image src={'/images/nurses_icon.svg'} width={12} height={12} />,
    title: "Nurses",
    roles: ["user"],
  },
  {
    path: "/physio",
    icon: <Image src={'/images/nurses_icon.svg'} width={12} height={12} />,
    title: "Physio",
    roles: ["user"],
  },
  {
    path: "/aya",
    icon: <Image src={'/images/nurses_icon.svg'} width={12} height={12} />,
    title: "Aya",
    roles: ["user"],
  },
  {
    path: "/patients",
    icon: <Image src={'/images/patients_icon.svg'} width={12} height={12} />,
    title: "Patients",
    roles: ["user", "admin"],
  },
  {
    path: "/rehab",
    icon: <Image src={'/images/patients_icon.svg'} width={12} height={12} />,
    title: "Rehab Center",
    roles: ["user", "admin"],
  },
  {
    path: "/analysis",
    icon: <Image src={'/images/analysis_icon.svg'} width={12} height={12} />,
    title: "Analysis",
    roles: ["user", "admin"],
  },
  {
    path: "/expert-category",
    icon: <Image src={'/images/analysis_icon.svg'} width={12} height={12} />,
    title: "Experts Category",
    roles: ["user", "admin"],
  },
  {
    path: "/experts",
    icon: <Image src={'/images/analysis_icon.svg'} width={12} height={12} />,
    title: "Experts",
    roles: ["user", "admin"],
  },
  {
    path: "/expert-doctor",
    icon: <Image src={'/images/analysis_icon.svg'} width={12} height={12} />,
    title: "Expert Doctors",
    roles: ["user", "admin"],
  },
];

export default routes;
