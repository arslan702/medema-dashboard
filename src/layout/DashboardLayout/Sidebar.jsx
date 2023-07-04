import { useEffect, useState } from "react";
import { Avatar, Layout, Menu,Dropdown,Space ,Select } from "antd";
import routes from "@/routes/routes1";
import Link from "next/link";
import { useRouter } from "next/router";
import Image from "next/image";
import dashboardIcon from '../../../public/images/icons/dashboard.svg'

import {MailOutlined} from 'antd'
import { DownOutlined } from '@ant-design/icons'
const { Sider } = Layout;

const Sidebar = ({ role, user }) => {
  const router = useRouter();
  const [current, setCurrent] = useState(router.pathname);
  const [sideLinks, setSidelinks] = useState([]);
  const [loading,setLoading]=useState(false)

  // const sideLinks = routes;
  
  const items = [
    {
      label: <a href="https://www.antgroup.com">1st menu item</a>,
      key: '0',
    },
    {
      label: <a href="https://www.aliyun.com">2nd menu item</a>,
      key: '1',
    },
    {
      type: 'divider',
    },
    {
      label: '3rd menu item',
      key: '3',
    },
  ];
  useEffect(() => {
    if (router.pathname) {
      if (current !== router.pathname) {
        setCurrent(router.pathname);
      }
    }
  }, [router, current]);

  useEffect(() => {
    const role = localStorage.getItem('role')
//     let filteredRoutes = [...routes]; // Create a copy of the routes array

// // Check if the user's role is one of the specified roles
//   if (role && ["doctor", "nurse", "aya", "patient", "physio", "expertDoctor"].includes(role)) {
//     // Filter the second and third objects in the routes array
//     filteredRoutes = routes.slice(1, 2).concat(routes.slice(2, 4));
//   }
    const filteredRoutes = routes.filter((route) => {
      return route.roles.includes(role)
    })
    console.log({routes})
    let links = [];
    filteredRoutes.map((route) => {
      // if (route.roles.includes(role)) {
        !route.childs?
        links.push({
          key: route.path,
          icon: route.icon,
          label: <Link href={route.path} className="font-normal text-base font-poppins text-white" ><button className="py-4 text-white " style={{backgroundColor:'transparent' ,border:"none"}}>{route.title}</button></Link>,
          
        }):
        links.push({
          key: route.path,
          icon: route.icon,
          label:route.title,
          children:route.childs   
        })

      // }
    });
    console.log(links,'links')

    setSidelinks(links);
    setLoading(true)
  }, []);

  return (
   
    <Sider collapsible style={{ paddingTop: "4rem",height:"100vh",}}>
    
      <div
        className="flex flex-col space-y-1 items-center user"
        style={{ marginTop: "1rem" }}
      >
        <Avatar size={100} src="/images/user.png" />
        <span
          className="text-white text-sm md:text-lg font-medium font-poppins"
          style={{ textTransform: "capitalize" }}
        >
          {user?.name}
        </span>
        <span
          className="text-white text-xs md:text-base font-normal font-poppins"
          style={{ textTransform: "capitalize" }}
        >
          {role}
        </span>
      </div>

      {
        loading?
      <Menu
        style={{
          marginTop: "1rem",
        
        }}
        className="sidebar"
        theme="dark"
        defaultSelectedKeys={[current]}
        onClick={({ key }) => {
          setCurrent(key);
        }}
        mode="inline"
        
        items={sideLinks}
      />:''}
     <div>
      {/* <div className=" parent py-4 bg-dark"  >
    
          <div className="flex  justify-around items-center text-white w-full ">
            <div className="px-4">
            <Image src={dashboardIcon}  alt="dashboard" className="h-6 w-6"/>
            </div>
            <div>
            <h2 className="">Dashboard</h2>
            </div>
          </div>
          </div> */}
    
      </div> 
  
    </Sider>
  );
};

  const styles={}
export default Sidebar;
