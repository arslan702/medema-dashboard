import React from 'react'
// import logo1 from '../../../public/images/logo1.png'
import Image from 'next/image'
// import { AiOutlineGooglePlus, } from "react-icons/ai";
// import { BsFacebook, BsGoogle, BsApple } from "react-icons/bs";
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { auth, db } from '@/config/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { collection, doc, getDoc } from 'firebase/firestore';

const index = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    signInWithEmailAndPassword(auth, email, password)
      .then(async(userCredential) => {
        // User logged in successfully
        console.log({userCredential})
        const user = userCredential.user;
        const token = user.accessToken;
        const userRef = doc(db,"users", user?.uid);
        const res = await getDoc(userRef);
        console.log({res})
      if (res.exists) {
        // Extract the user data from the document
        const userData = res.data();

        // Access the name and role
        const email = userData?.email;
        const role = userData?.role;
        localStorage.setItem('role', userData?.role);
        console.log("User name:", email);
        console.log("User role:", role);
      }
        localStorage.setItem("token", token);
        localStorage.setItem("email", email);
        localStorage.setItem("id", user?.uid);
        router.push('/')
        // Do something after successful login, like redirecting to another page
      })
      .catch((error) => {
        // Handle login errors
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorMessage)
        // Handle specific error codes or display a generic error message
      });
  };
  return (
    <div className={` parent h-[115vh]  lg:h-[100vh] font-poppins`}  >
      <div className='bg-[#1A3578C8] font-[poppinsregular] flex flex-1 flex-col h-full px-6 py-4'>
        {/* <div className='fixed top-6 left-6 '>
          <Image src={logo1} className='h-[50px] w-[130px] lg:h-[80px] lg:w-[200px] object-contain lg:ml-16 ' alt='logo' />
        </div> */}
        <div className='flex justify-center items-center -mt-24 flex-1 lg:mt-0  '>
          <form>
            <div className=' justify-center  bg-slate-950 bg-opacity-30 w-full sm:w-[450px] rounded-md flex flex-col gap-3 px-8 shadow-sm shadow-blue-950 py-6 '>
              <h1 className=' text-2xl lg:text-3xl font-[barlowregular] text-[#C6ED73]'>Log in</h1>
             
              <div className='flex flex-col mt-2'>
                <label className='text-xs lg:text-sm text-[#C6ED73] -mb-1'>Enter Email</label>
                <input type='text' value={email} onChange={(e) => setEmail(e.target.value)} placeholder='Your Email' className='text-xs lg:text-sm py-2 outline-none bg-transparent border mt-2 px-4  text-white rounded-md' />
              </div>
              <div className='flex flex-col'>
                <label className='text-xs lg:text-sm text-[#C6ED73] -mb-1'>Enter Password</label>
                <input type='text' value={password} onChange={(e) => setPassword(e.target.value)} placeholder='Password' className='text-xs lg:text-sm py-2 outline-none bg-transparent border mt-2 px-4  text-white rounded-md' />
              </div>
              <div className='flex justify-between'>
                <div className='flex gap-2 items-center'>
                  <input type='checkbox' className='h-4 w-4' />
                  <h2 className='text-xs lg:text-sm text-white '>Remember Me</h2>
                </div>
                <div>
                  <Link href='/forget'>
                  <h2 className='text-xs lg:text-sm text-[#C6ED73]'>Forgot Password?</h2>
                  </Link>
                </div>
              </div>
              <div className='mt-4'>
                <button onClick={handleLogin} className='w-full py-2 hover:bg-[#7ba129] text-sm bg-[#C6ED73] font-semibold rounded-md'>Log in</button>
              </div>
            
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default index
