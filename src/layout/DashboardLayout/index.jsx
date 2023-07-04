import { Layout, Spin ,Button} from "antd";
import Sidebar from "./Sidebar";
import { useQuery } from "@tanstack/react-query";
import { db } from "@/config/firebase";
import { doc, getDoc } from "firebase/firestore";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
const { Header, Content } = Layout;

import routes from "@/routes/routes";
import Link from "next/link";

const Index = ({ children }) => {
  const router = useRouter()
  const [currentUser, setCurrentUser] = useState('empty');
  const a = routes.find((doc) => {
    return router.pathname == doc.path;
  })

  useEffect(() => {
    setCurrentUser(localStorage.getItem('token'))
  },[])

  if(!currentUser){
    // router.push('/signin')
  }
  const [title, setTitle] = useState('')
  const { data, isLoading } = useQuery(["user"], async () => {
    const response = await (await fetch("/api/currentUser")).json();
    console.log("res", response);
    const userRef = doc(db, "users", response.uid);
    const userRes = await getDoc(userRef);

    if (userRes.exists) {
      return userRes.data();
    }

    return null;
  });
  console.log("user in layout", data);
  // if (isLoading) {
  //   return <Spin className="absolute top-1/2 left-1/2" />;
  // }

  const handleLogout = (e) => {
    e.preventDefault();
    localStorage.removeItem('role')
    localStorage.removeItem('token')
    localStorage.removeItem("id")
    localStorage.removeItem("email")
    router.push('/signin')
  }

  return (
    <Layout style={{ minHeight: "100vh", height: "100vh", }}>
      <Header
        className="site-layout-background"
        style={{ padding: 0, position: "fixed", top: 0, width: "100%", zIndex: 5, height: '80px' }}
      >  <div className="flex justify-between items-center px-4 ">
      <div className="flex items-center gap-4 w-full justify-start px-6">
          <Image src={"/images/logo.svg"} width={118} height={48} />
          <div className="" style={{ marginLeft: "30px" }}>
            <h2 className="text-white ">{a ? a.title : 'Dashboard'}</h2>
          </div>
       
        </div>
        <Link href='/signin'>
        <Button onClick={handleLogout} className="  px-6  rounded-md bg-white hover:bg-[blue] ">Logout</Button>
        </Link>
        </div>
      </Header>
      <div>
        <Sidebar role={data?.role} user={data} />
      </div>
      <Layout className="site-layout" style={{ overflowY: "scroll", marginTop: "50px" }} >
        <Content style={{ background: "#FAFBFF", }}>
          <div
            className=" bg-[#FAFBFF] "
            style={{ padding: 24, minHeight: 360, overflowX: "scroll" }}
          >
            {children}
          </div>
        </Content>
      </Layout>
    </Layout>


  );
};

export default Index;
