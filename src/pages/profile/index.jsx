// import React from 'react'
// import { useRouter } from 'next/router'

// const index = () => {
//     const router = useRouter();
//     console.log(router.query)
//     const data = router.query
//     return (
//         <div className='' style={{ marginTop: '30px',height:"100vh" }}>
//             <div className=' flex justify-between '>
//                 <div><button className='py-4 bg-white px-4 border-red-500 outline-none '>Edit Profile</button></div>
//                 <div className='flex gap-4'>
//                     <button className='btn bg-white border-red-500  text-red-500 px-4'>Accept Patient</button>
//                     <button className='btn bg-[#264798] text-white px-4'>Accept Patient</button>
//                 </div>
//             </div>
//             <div className='w-[600px] mt-4 flex flex-col items-start '>
//                 <div className='w-[600px]  bg-black h-[200px] rounded-md'>
//                     <div className='relative flex gap-4 top-36'>
//                     <div className='w-[120px] h-[120px] ml-8  bg-[#264798]  rounded-md'>
//                     </div>
//                     <div>
//                   <h2 className=' text-white'> {data.name}</h2>
//                   </div>
//                     </div>
//                 </div>
//             </div>
//             <div className='w-[250px] bg-slate-400 flex  mt-24 flex-col items-start px-2'>
//                 <div className='flex  gap-x-2 border-b border-black'>
//                     <h4>Name</h4>
//                     <h4>:</h4>
//                     <h4>{data.name}</h4>
//                 </div>
//                 <div className='flex gap-2'>
//                     <h4>Email</h4>
//                     <h4>:</h4>
//                     <h4>{data.email}</h4>
//                 </div>
//                 <div className='flex gap-2'>
//                     <h4>Role</h4>
//                     <h4>:</h4>
//                     <h4 className='capitalize'>{data.role}</h4>
//                 </div>
//             </div>
//         </div>
//     )
// }

// export default index

import {
    Table,
    Avatar,
    Tag,
    Menu,
    Dropdown,
    Alert,
    Spin,
    Popconfirm,
    DatePicker,
  } from "antd";
  import { useState } from "react";
  import avatar from "../../../public/images/user.png";
  import Head from "next/head";
  
  import {
    UserOutlined,
    MoreOutlined,
    CloseCircleOutlined,
    CheckCircleOutlined,
  } from "@ant-design/icons";
  import React from "react";
  import { Modal, Form, Input, Button, Upload, Radio,Select,Image } from "antd";
  import { UploadOutlined } from "@ant-design/icons";
  import { auth, db, storage } from "@/config/firebase";
  import {
    addDoc,
    collection,
    getDocs,
    setDoc,
    doc,
    deleteDoc,
    updateDoc,
    getDoc,
    where,
    query,
  } from "firebase/firestore";
  import { useQuery } from "@tanstack/react-query";
  import { useRouter } from "next/router";
  import Swal from 'sweetalert2'
  import withReactContent from 'sweetalert2-react-content'
  import {
    ref,
    uploadBytes,
    getDownloadURL,
    uploadBytesResumable,
    deleteObject,
  } from "firebase/storage";
import dayjs from "dayjs";

  const { TextArea } = Input;
  
  const Index = ({roles}) => {
    console.log({roles})
    const MySwal = withReactContent(Swal)
    const [visibleAlert, setVisibleAlert] = useState(false);
    const [alertText, setAlertText] = useState("");
    const [alertType, setAlertType] = useState("success");
    const [imgUrl, setImgUrl] = useState("");
    const [uplodedUrl, setUploadedUrl] = useState("");
    const [preview, setPreview] = useState("");
    const [btnPre, setBtnPre] = useState(<span>Change</span>);
    const [visible, setVisible] = useState(false);
    const [form] = Form.useForm();
    const router = useRouter();
    const [editData, setEditData] = useState(false);
    const [imgName, setImgName] = useState("");
    const [btnAdd, setBtnAdd] = useState("primary");
    const [loading, setLoading] = useState(false);
    const [arr, setarr] = useState([]);
    const [inUpdate, setInUpdate] = useState(false);
    const role = router.query;
    var previewArr = [];
    const [formData, setFormData] = useState({
      name: "",
      fees: "",
      discount: "",
      address: "",
      email: "",
      password: "",
      phone: "",
      details: "",
      experience: "",
      workingAt: "",
      education: "",
      id: "",
      gender: "male",
      availability: "weekdays",
      unavailability: [],
      images: {
        url: "",
        name: "",
      },
    });

    let base = "";
        if(roles === "doctor") {
            base = "doctors"
        } else if(roles === "nurse") {
            base = "nurses"
        } else if(roles === "patient") {
            base = "patient"
        } else if(roles === "aya") {
            base = "aya"
        } else if(roles === "physio") {
          base = "physio"
        }

    const handleDateSelect = (date) => {
      const selectedDate = new Date(date);
      const formattedDate = selectedDate.toISOString().split('T')[0];
      
      setFormData((prevFormData) => ({
        ...prevFormData,
        unavailability: [...prevFormData.unavailability, formattedDate],
      }));
    };
  
    const handleRemoveDate = (dateToRemove) => {
      setFormData((prevFormData) => ({
        ...prevFormData,
        unavailability: prevFormData.unavailability.filter((date) => date !== dateToRemove)
      }));
    };

    console.log('unavailable===  ',formData?.unavailability)
  
    const handleFormChange = (event) => {
      const { name, value } = event.target;
      setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
    };
  
    const handleGenderChange = (value) => {
      setFormData((e) => ({ ...e, gender: value }));
    };
   
    const handleFormSubmit = (e) => {
      e.preventDefault();
      if (editData) {
        handleUploadImage();
      } else {
        handleUploadImage();
      }
    };
    const delteImage = async () => {
      const desertRef = ref(storage, `${base}/${imgName}`);
  
      try {
        const res = await deleteObject(desertRef);
        console.log(res, "res");
        setPreview("");
        setImgName("");
        setBtnPre(<span>Deleted</span>);
        await updateDoc(doc(db, base, formData.id), { images: {} });
      } catch (err) {
        console.log(err);
      }
    };
  
    const addData = async (imageUrl) => {
      // setBtnAdd("disable");
      const url = imageUrl;
      const newCityRef = collection(db, base);
      // const {title,fees,address,powerAvail,doctorAvail,}=formData
  
      try {
        const res = await addDoc(newCityRef, {
          ...formData,
        });
        console.log(res.id);
  
        await updateDoc(doc(db, base, res.id), {
          id: res.id,
          images: { url: imageUrl, name: imgUrl.name },
        });
        setAlertType("success");
        
        setBtnAdd("primary");
        MySwal.fire({
          title: <p>{roles} added SuccessFully</p>,
          didOpen: () => {
            // `MySwal` is a subclass of `Swal` with all the same instance & static methods
            MySwal.showLoading()
          },
        }).then(() => {
          return MySwal.fire(<p>Shorthand works too</p>)
        })
        router.reload("/profile");
        setVisibleAlert(true);
        setTimeout(() => {
          setVisibleAlert(false);
        }, 5000);
        handleOk();
        setLoading(false);
      } catch (err) {
        console.log(err);
        MySwal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Something went wrong!',
          
        })
        setLoading(false)
        handleCancel()
      }
    };
    const updateData = async (docs) => {
      const newCityRef = collection(db, base);
      // const {title,fees,address,powerAvail,doctorAvail,}=formData
  
      try {
        if (inUpdate) {
          const desertRef = ref(storage, `${base}/${formData.images.name}`);
          const deleteImg = await deleteObject(desertRef);
          console.log(deleteImg);
        }
        await updateDoc(doc(db, base, formData.id), { ...formData });
        if (inUpdate) {
          await updateDoc(doc(db, base, formData.id), {
            images: { url: docs, name: imgUrl.name },
          });
        }
       
        setInUpdate(false);
        setVisibleAlert(true);
        setTimeout(() => {
          setVisibleAlert(false);
        }, 1000);
        handleOk();
        setEditData(false);
        MySwal.fire({
          title: <p> Updated SuccessFully</p>,
          didOpen: () => {
            // `MySwal` is a subclass of `Swal` with all the same instance & static methods
            MySwal.showLoading()
          },
        }).then(() => {
          return MySwal.fire(<p>Shorthand works too</p>)
        })
        router.reload("/profile");
      } catch (err) {
        console.log(err);
        MySwal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Something went wrong!',
          
        })
        setLoading(false)
        handleCancel()
      }
    };
    const deleteData = async (e) => {
      console.log(e);
      try {
        const desertRef = ref(storage, `${base}/${e.images.name}`);
        const deleteImg = await deleteObject(desertRef);
        const res = await deleteDoc(doc(db, base, e.id));
        console.log(res);
        console.log(deleteImg);
        setAlertType("error");
       
        MySwal.fire({
          title: <p>Data Deleted SuccessFully</p>,
          didOpen: () => {
            // `MySwal` is a subclass of `Swal` with all the same instance & static methods
            MySwal.showLoading()
          },
        }).then(() => {
          return MySwal.fire(<p>Shorthand works too</p>)
        })
        router.reload("/category");
        setVisibleAlert(true);
        setTimeout(() => {
          setVisibleAlert(false);
        }, 5000);
      } catch (err) {
        console.log(err);
        MySwal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Something went wrong!',
          
        })
        
        handleCancel()
        setLoading(false)
      }
    };
    const handleUploadImage = async () => {
      setLoading(true);
      const imgRef = ref(storage, `${base}/${imgUrl ? imgUrl.name : ""}`);
  
      try {
        const res = await uploadBytes(imgRef, imgUrl);
        console.log(res, "result");
        const uploadTask = uploadBytesResumable(imgRef, imgUrl);
  
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        console.log("File available at", downloadURL);
        // addData();
        setUploadedUrl(downloadURL);
        editData ? updateData(downloadURL) : addData(downloadURL);
      } catch (err) {
        console.log(err, "message");
      }
    };
        
    const getData = async () => {
      const result = query(collection(db, base), where("auth_id", "==", localStorage.getItem('id')));
      const querySnapshot = await getDocs(result);
      console.log({querySnapshot})
    
      if (querySnapshot.docs.length > 0) {
        const doctorDoc = querySnapshot.docs[0];
        return {
          ...doctorDoc.data(),
          id: doctorDoc.id,
        };
      } else {
        console.log(`${base} not found`)
        return null; // Return null or handle the case where the doctor is not found
      }
    };
    
    
    const { data, isLoading, error } = useQuery([base], getData, {
      staleTime: 60000,
    })
    const newData = []
    newData.push(data)
    console.log('data----  ',data);
  
    const handleCloseAlert = () => {
      setVisibleAlert(false);
    };
    const showModal = () => {
      setVisible(true);
    };
  
    const handleOk = () => {
      form.submit();
    };
  
    const handleCancel = () => {
      setFormData({
        name: "",
        fees: "",
        discount: "",
        address: "",
        email: "",
        password: "",
        phone: "",
        details: "",
        experience: "",
        workingAt: "",
        education: "",
        id: "",
        gender: "male",
        availability: "weekdays",
        unavailability: [],
        images: {
          url: uplodedUrl,
          name: imgUrl.name,
        },
      });
      setPreview("");
      setImgName("");
      setVisible(false);
    };
  
    const onFinish = (values) => {
      console.log(values);
      handleCancel();
    };
  
    const uploadButton = editData ? (
      <div className="flex">
        <Image
          src={preview}
          className="object-cover rounded-xl"
          width={90}
          height={95}
          alt="image"
        />
        <Button
          className="-ml-8 h-6 w-4 text-center flex justify-center items-center  text-red-800"
          onClick={delteImage}
        >
          X
        </Button>
      </div>
    ) : preview == "" ? (
      <div>
        <UploadOutlined />
        <div className="ant-upload-text">Upload</div>
      </div>
    ) : (
      <div className="flex">
        <Image
          src={preview}
          className="object-cover rounded-xl"
          width={90}
          height={95}
          alt="image"
        />
        <Button
          className="-ml-8 h-6 w-4 text-center flex justify-center items-center  text-red-800"
          onClick={() => {
            setPreview("");
          }}
        >
          X
        </Button>
      </div>
    );
  
    const [current, setCurrent] = useState("mail");
    const onClick = (e) => {
      console.log("click ", e);
      setCurrent(e.key);
    };
    console.log(Menu, "menue");
    const items = [
      {
        label: (
          <label className="text-green-300 bg-blue-900 w-full px-4 py-1 rounded-md ">
            Edit
          </label>
        ),
        key: "edit",
      },
      {
        label: (
          <label className="text-white bg-red-800 w-full px-2 py-1 rounded-md ">
            Delete
          </label>
        ),
        key: "delete",
      },
    ];
    const columns = [
      {
        title: (
          <div className="flex items-center justify-center space-x-4">
           
            {/* <Image
              src={"/images/sort.svg"}
              width={20}
              height={20}
           
            /> */}
             <span className="text-base font-poppins font-medium">#</span>
          </div>
        ),
        dataIndex: "no",
        sorter: (a, b) => a.age - b.age,
        render: (_, record,index) => (
          <div className="w-full flex items-center justify-center">
            <span className="text-base font-poppins font-medium text-[#474747]">
              {index+1}
            </span>
          </div>
        ),
      },
      {
        title: (
          <div className="flex items-center space-x-4">
               <Image
              src={"/images/sort.svg"}
              width={20}
              height={20}
              style={{ marginLeft: "8px" }}
            />
            <span className="text-base font-poppins font-medium">Image</span>
         
          </div>
        ),
        dataIndex: "date",
        render: (_, record) => (
          <div className="w-full flex justify-center items-center">
            {/* <Avatar
                    icon={<UserOutlined />}
                    src={
                      record?.user?.image
                        ? `${process.env.NEXT_PUBLIC_API_URL}${record?.user?.image.url}`
                        : ""
                    }
                    className="flex items-center justify-center"
                  /> */}
            <Image
              src={record?.images ? record?.images?.url : ''}
              alt={record?.name}
              width={40}
              height={40}
              style={{ marginLeft: "0px" }}
            />
          </div>
        ),
      },
      {
        title: (
          <div className="flex items-center w-[160px] justify-center space-x-4">
            <Image
              src={"/images/sort.svg"}
              width={20}
              height={20}
              style={{ marginLeft: "0px" }}
            />
            <span className="text-base font-poppins font-medium">Name</span>
          </div>
        ),
        dataIndex: "name",
        sorter: (a, b) => a?.age - b?.age,
        render: (_, record) => {
          let short = record?.name;
          return record?.name ? (
            <div className="flex items-center w-[160px] justify-center space-x-2">
              <span className="text-sm font-poppins text-clip font-medium text-[#474747]">
                {record?.name ? short?.slice(0, 50) : "NA"}
              </span>
            </div>
          ) : (
            "N/A"
          );
        },
      },
  
      {
        title: (
          <div className="flex items-center space-x-4">
            <Image
              src={"/images/sort.svg"}
              width={20}
              height={20}
              style={{ marginLeft: "8px" }}
            />
            <span className="text-base font-poppins font-medium">Gender</span>
          </div>
        ),
        dataIndex: "provider",
        sorter: (a, b) => a.age - b.age,
        render: (_, record) => {
          return record?.gender ? (
            <div className="flex items-center justify-center  space-x-2">
            {record?.gender=="male"?
               <div className="w-[60px] py-1 bg-[#DCEDE5] text-center text-[#3CB43C]">Male</div>
           :
           <div className="w-[60px] py-1 bg-[#E7E3F6] text-center text-[#8472CA]">Female</div>
              }
            
            </div>
          ) : (
            "N/A"
          );
        },
      },
      {
        title: (
          <div className="flex items-center justify-center  w-[160px] space-x-4">
            <Image src={"/images/sort.svg"} width={20} height={20} />
            <span className="text-base font-poppins font-medium">Details</span>
          </div>
        ),
        dataIndex: "service",
        sorter: (a, b) => a.age - b.age,
        render: (_, record) => {
          let short = record?.details;
  
          return (
            <div className=" flex items-center w-[160px] justify-center">
              <span className="text-sm  text-clip font-poppins font-medium text-[#474747]">
                {/* {record.description} */}
                {record?.details ? short?.slice(0, 50) : "NA"}
              </span>
            </div>
          );
        },
      },
      {
        title: (
          <div className="flex items-center  justify-center  w-[160px] space-x-4">
            <Image src={"/images/sort.svg"} width={20} height={20} style={{}} />
            <span className="text-base font-poppins font-medium">Fees</span>
          </div>
        ),
        dataIndex: "status",
        sorter: (a, b) => a.age - b.age,
        render: (_, record) => (
          <div className=" flex items-center w-[160px] justify-center">
            <span className="mx-auto text-sm font-poppins font-normal text-[black]  py-1">
              {record?.fees + "" + "$"}
            </span>
          </div>
        ),
      },
      {
        title: (
          <div className="flex items-center space-x-4 justify-center w-[160px]">
            <Image src={"/images/sort.svg"} width={20} height={20} style={{}} />
            <span className="text-base font-poppins font-medium">Discount</span>
          </div>
        ),
        dataIndex: "payment",
        sorter: (a, b) => a.age - b.age,
        render: (_, record) => (
          <div className="w-[160px] flex items-center  justify-center">
            {
              <span className="mx-auto text-center text-sm font-poppins font-normal text-[black] w-[160px]  py-1">
                {record?.discount + "" + "$"}
              </span>
            }
          </div>
        ),
      },
  
      {
        title: (
          <div className="flex items-center space-x-4 justify-center w-[160px]">
            <Image src={"/images/sort.svg"} width={20} height={20} style={{}} />
            <span className="text-base font-poppins font-medium">Contact</span>
          </div>
        ),
        dataIndex: "payment",
        sorter: (a, b) => a.age - b.age,
        render: (_, record) => (
          <div className="w-full flex flex-col items-center  justify-center">
            {
              <>
                <span className="mx-auto text-center text-sm font-poppins font-normal text-[black] w-[160px]  py-1">
                  Email: {record?.email}
                </span>
                <span className="mx-auto text-center  text-sm font-poppins font-normal text-[black] w-[160px]  py-1">
                  Phone: {record?.phone}
                </span>
              </>
            }
          </div>
        ),
      },
  
      {
        title: (
          <div className="flex items-center space-x-4 justify-center w-[160px]">
            <Image src={"/images/sort.svg"} width={20} height={20} style={{}} />
            <span className="text-base font-poppins font-medium">Education</span>
          </div>
        ),
        dataIndex: "payment",
        sorter: (a, b) => a.age - b.age,
        render: (_, record) => (
          <div className="w-full flex items-center  justify-center">
            {
              <span className="mx-auto text-center text-sm font-poppins font-normal text-[black] w-[160px]  py-1">
                {record?.education}
              </span>
            }
          </div>
        ),
      },
      {
        title: (
          <div className="flex items-center space-x-4 justify-center w-[160px]">
            <Image src={"/images/sort.svg"} width={20} height={20} style={{}} />
            <span className="text-base font-poppins font-medium">Experience</span>
          </div>
        ),
        dataIndex: "payment",
        sorter: (a, b) => a.age - b.age,
        render: (_, record) => (
          <div className="w-full flex items-center  justify-center">
            {
              <span className="mx-auto text-center text-sm font-poppins font-normal text-[black] w-[160px]  py-1">
                {record?.experience}
              </span>
            }
          </div>
        ),
      },
      {
        title: (
          <div className="flex items-center space-x-4 justify-center w-[160px]">
            <Image src={"/images/sort.svg"} width={20} height={20} style={{}} />
            <span className="text-base font-poppins font-medium">Availability</span>
          </div>
        ),
        dataIndex: "available",
        sorter: (a, b) => a.age - b.age,
        render: (_, record) => (
          <div className="w-full flex items-center  justify-center">
            {
              <span className="mx-auto text-center text-sm font-poppins font-normal text-[black] w-[160px]  py-1">
                {record?.availability}
              </span>
            }
          </div>
        ),
      },
      {
        title: (
          <div className="flex items-center space-x-4 justify-center w-[160px]">
            <Image src={"/images/sort.svg"} width={20} height={20} style={{}} />
            <span className="text-base font-poppins font-medium">Unavailability</span>
          </div>
        ),
        dataIndex: "unavailable",
        sorter: (a, b) => a.age - b.age,
        render: (_, record) => (
          <div className="w-full flex items-center  justify-center">
            {
              <span className="mx-auto text-center text-sm font-poppins font-normal text-[black] w-[160px]  py-1">
                {record?.unavailability?.map((un) => (
                  <span className="ml-1">{dayjs(un.toString()).format('DD MMM YYYY')},</span>
                ))}
              </span>
            }
          </div>
        ),
      },
      {
        title: (
          <div className="flex items-center space-x-4 justify-center w-[160px]">
            <Image src={"/images/sort.svg"} width={20} height={20} style={{}} />
            <span className="text-base font-poppins font-medium">
             Working at
            </span>
          </div>
        ),
        dataIndex: "payment",
        sorter: (a, b) => a.age - b.age,
        render: (_, record) => (
          <div className="w-full flex items-center  justify-center">
            {
              <span className="mx-auto text-center text-sm font-poppins font-normal text-[black] w-[160px]  py-1">
                {record?.workingAt}
              </span>
            }
          </div>
        ),
      },
      {
        title: (
          <div className="flex items-center space-x-4">
            <Image
              src={"/images/sort.svg"}
              width={20}
              height={20}
              style={{ marginLeft: "8px" }}
            />
            <span className="text-base font-poppins font-medium">Action</span>
          </div>
        ),
        render: (_, record) => (
          <div className="w-full flex items-center justify-center bg-white text-white">
            <Dropdown
              menu={{
                items: [
                  {
                    label: (
                      <Button
                        className="text-green-300 hover:text-white bg-blue-900 w-full px-4 py-1 rounded-md "
                        onClick={() => {
                          showModal();
                          setFormData(record);
                          setPreview(record?.images?.url);
                          setImgName(record?.images?.name);
                          setEditData(true);
                        }}
                      >
                        Edit
                      </Button>
                    ),
                    key: "edit",
                  },
                  {
                    label: (
                      <Button
                        onClick={() => {
                          deleteData(record);
                        }}
                        danger
                      >
                        Delete
                      </Button>
  
                      // className="text-white bg-red-800 w-full px-2 py-1 rounded-md "
                    ),
                    key: "delete",
                  },
                ],
              }}
              placement="bottomLeft"
              theme={"dark"}
            >
              <Button>
                <MoreOutlined />
              </Button>
            </Dropdown>
            {/* <button className="text-2xl hover:text-3xl font-bold " onClick={onClick}>
                  <MoreOutlined />
                </button> */}
          </div>
        ),
      },
    ];
  
    const headings = [
      "#",
      "Date",
      "User",
      "Provider",
      "Service",
      "Status",
      "Payment",
      "Actions",
    ];
  
    const onChange = (pagination, filters, sorter, extra) => {
      console.log("params", pagination, filters, sorter, extra);
    };
    console.log(typeof headings.length.toString());
    return (
      <div className="flex flex-col bg-white space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="font-semibold font-barlow text-2xl ml-6">{roles?.toUpperCase()}</h1>
          {!data ? 
          <button
            className=" bg-[#1A3578] hover:bg-blue-900 text-white font-semibold py-3 px-4 rounded "
            onClick={() => {
              setEditData(false);
              showModal();
            }}
          >
            + Create Profile
          </button>
          : ''}
        </div>
        <Modal
          visible={visible}
          title="Add doctors"
          onOk={handleOk}
          onCancel={handleCancel}
          footer={false}
          // style={{overflowY:"scroll"}}
        >
          <form onSubmit={handleFormSubmit}>
            <div className="grid grid-cols-12 gap-x-4 gap-y-3">
              <div className="col-span-6 flex space-x-2">
                <div style={{ width: "170px" }}>
                  <label className="text-lg   ">Name</label>
                </div>
  
                <Input
                  type="text"
                  required
                  className="py-1 px-2 w-full outline-none border-b  border-gray rounded-md"
                  placeholder="Enter Title"
                  value={formData.name}
                  name="name"
                  onChange={handleFormChange}
                />
              </div>
              <div className="col-span-6 flex space-x-2">
                <div style={{ width: "147px" }}>
                  <label className="text-lg">Fees</label>
                </div>
                <Input
                  required
                  type="number"
                  className="py-1 px-2 w-full outline-none border-b  border-gray rounded-md"
                  placeholder="14$"
                  value={formData.fees}
                  name="fees"
                  onChange={handleFormChange}
                />
              </div>
              <div className="col-span-6 flex space-x-2">
                <div style={{ width: "170px" }}>
                  <label className="text-lg">Discount</label>
                </div>
                <Input
                  type="number"
                  className="py-1 px-2 outline-none border-b w-full  border-gray rounded-md"
                  placeholder="2$"
                  value={formData.discount}
                  name="discount"
                  onChange={handleFormChange}
                />
              </div>
  
              <div className="col-span-6 flex space-x-2">
                <div style={{ width: "147px" }}>
                  <label className="text-lg">Address</label>
                </div>
                <Input
                  required
                  type="text"
                  className="py-1 px-2 outline-none w-full border-b  border-gray rounded-md"
                  placeholder="Addres"
                  value={formData.address}
                  name="address"
                  onChange={handleFormChange}
                />
              </div>
              <div className="col-span-6 flex space-x-2">
                <div style={{ width: "170px" }}>
                  <label className="text-lg">Experience</label>
                </div>
                <Input
                  required
                  type="text"
                  className="py-1 px-2 outline-none w-full border-b  border-gray rounded-md"
                  placeholder="Experience"
                  value={formData.experience}
                  name="experience"
                  onChange={handleFormChange}
                />
              </div>
              <div className="col-span-6 flex space-x-2">
                <div style={{ width: "147px" }}>
                  <label className="text-lg">Education</label>
                </div>
                <Input
                  type="text"
                  className="py-1 px-2 outline-none w-full border-b  border-gray rounded-md"
                  placeholder="Education"
                  value={formData.education}
                  name="education"
                  onChange={handleFormChange}
                />
              </div>
              <div className="col-span-6 flex space-x-2">
                <div style={{ width: "170px" }}>
                  <label className="text-lg">Email</label>
                </div>
                <Input
                  type="email"
                  className="py-1 px-2 outline-none w-full border-b  border-gray rounded-md"
                  placeholder="jhon@abc.com"
                  value={formData.email}
                  name="email"
                  onChange={handleFormChange}
                />
              </div>
              <div className="col-span-6 flex space-x-2">
                <div style={{ width: "147px" }}>
                  <label className="text-lg">phone</label>
                </div>
                <Input
                  type="text"
                  className="py-1 px-2 outline-none w-full border-b  border-gray rounded-md"
                  placeholder="444-222-444"
                  value={formData.phone}
                  name="phone"
                  onChange={handleFormChange}
                />
              </div>
              <div className="col-span-6 flex ">
                <div style={{ width: "147px" }}>
                  <label className="text-lg">Gender</label>
                </div>
                <div>
                <Select
                  className="w-[147px] px-2 ml-8 rounded-md text-black"
                  name="gender"
                  onChange={handleGenderChange}
                >
                  <Select.Option defaultChecked value="male">
                    Male
                  </Select.Option>
                  <Select.Option value="female">Female</Select.Option>
                </Select>
                </div>
              </div>
              <div className="col-span-6 flex items-center space-x-2">
                <div style={{ width: "147px" }}>
                  <label className="text-sm">Working At</label>
                </div>
                <Input
                  required
                  type="text"
                  className="py-1 px-2 outline-none w-full border-b  border-gray rounded-md"
                  placeholder="working at"
                  value={formData.workingAt}
                  name="workingAt"
                  onChange={handleFormChange}
                />
              </div>
              <div className="col-span-6 flex ">
                <div style={{ width: "87px" }}>
                  <label className="text-lg">Availability</label>
                </div>
                <div>
                <Select
                  className="w-[147px] px-2 rounded-md text-black"
                  name="gender"
                  onChange={handleGenderChange}
                >
                  <Select.Option defaultChecked value="weekdays">
                    Weekdays 
                  </Select.Option>
                  <Select.Option value="weekend">Weekend</Select.Option>
                  <Select.Option value="fullWeek">Full Week</Select.Option>
                </Select>
                </div>
              </div>
              <div className="col-span-6 flex">
                <div style={{width: '117px'}}>
                  <label className="text-lg">UnAvailability</label>
                </div>
                <DatePicker onSelect={handleDateSelect} />
              </div>
              <div className="flex ml-1 px-1">
              {formData?.unavailability?.map((date) => (
          <div key={date.toString()}>
            <span>{dayjs(date.toString()).format('DD MMM YYYY')}</span>
            <Button onClick={() => handleRemoveDate(date)}>Remove</Button>
          </div>
        ))}
        </div>
              <div className="col-span-12 flex ">
                <div style={{ width: "180px" }}>
                  <label className="text-[17px] ">Details</label>
                </div>
                <div className=" -ml-12 w-full">
                  <TextArea
                    rows="2"
                    type="text"
                    className="py-1 px-2 outline-none w-full border-b  border-gray rounded-md"
                    placeholder="Enter Details Here"
                    value={formData.details}
                    name="details"
                    onChange={handleFormChange}
                  />
                </div>
              </div>
  
              <div className="col-span-6 mt-4">
                <Form.Item
                  label="Image"
                  name="image"
                  valuePropName="fileList"
                  getValueFromEvent={(e) => {
                    if (Array.isArray(e)) {
                      return e;
                    }
                    setImgUrl(e.file);
                    // handleUploadImage()
                    let b = URL.createObjectURL(e.file);
                    setPreview(b);
                    setInUpdate(true);
                    console.log(arr, "arr");
                    return e && e.fileList;
                  }}
                >
                  <Upload
                  className="ml-11"
                    name="image"
                    listType="picture-card"
                    showUploadList={false}
                    beforeUpload={() => false}
                  >
                    {uploadButton}
                  </Upload>
                </Form.Item>
          
              </div>
              <div>
                {previewArr !== []
                  ? previewArr.map((doc, index) => {
                      return (
                        <div key={index}>
                          <Image src={doc} height={25} width={25} alt="img" />
                        </div>
                      );
                    })
                  : ""}
              </div>
            </div>
            <div className="flex justify-center col-span-12">
              {loading ? (
                <div className="h-24 w-24 flex justify-center">
                  <Spin />
                </div>
              ) : editData ? (
                <Button
                  type="primary"
                  style={{ width: "120px" }}
                  htmlType="submit"
                >
                  Update
                </Button>
              ) : (
                <Button
                  type={btnAdd}
                  style={{ width: "120px" }}
                  htmlType="submit"
                >
                  Add
                </Button>
              )}
            </div>
          </form>
  
        </Modal>
  
        <div className="">
          <Table
            columns={columns}
            dataSource={newData ? newData : []}
            onChange={onChange}
            id="newOrders"
            scroll={{ x: 900 }}
          />
        </div>
      </div>
    );
  };
  
  export default Index;
  