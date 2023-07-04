import DashboardLayout from "@/layout/DashboardLayout";
import GeneralLayout from "@/layout/GeneralLayout";
import "@/styles/globals.css";
import '@/styles/table.css'
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useState } from "react";

const queryClient = new QueryClient();

const App = ({ Component, pageProps }) => {
  const router = useRouter();
  const [user, setUser] = useState('');
  const [roles, setRoles] = useState('');

  useEffect(() => {
    setUser(localStorage.getItem('token'))
    setRoles(localStorage.getItem('role'))
  },[])

  // if(user == null) {
  //   router.push('/signin')
  // }

  console.log({roles})

  if (router.pathname === "/signin") {
    return (
      <QueryClientProvider client={queryClient}>
        <GeneralLayout>
          <Component {...pageProps} />
          <ReactQueryDevtools initialIsOpen={false} />
        </GeneralLayout>
      </QueryClientProvider>
    );
  }
  return (
    <QueryClientProvider client={queryClient}>
      <DashboardLayout>
        <Component {...pageProps} roles={roles}/>
        <ReactQueryDevtools initialIsOpen={false} />
      </DashboardLayout>
    </QueryClientProvider>
  );
};

export default App;
