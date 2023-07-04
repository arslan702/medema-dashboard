import {
  Table,
  Avatar,
  Tag,
  Menu,
  Dropdown,
  Alert,
  Spin,
  Popconfirm,
} from "antd";
import { useState } from "react";
import avatar from "../../../public/images/user.png";
import Head from "next/head";
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
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
} from "firebase/firestore";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  uploadBytesResumable,
  deleteObject,
} from "firebase/storage";
import { useRef } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
const { TextArea } = Input;

const Index = () => {
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
  var previewArr = [];
  const MySwal = withReactContent(Swal)
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

  const handleFormChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
  };

  const handleGenderChange = (value) => {
    setFormData((e) => ({ ...e, gender: value }));
  };
  const handlePowerChange = () => {
    setFormData((e) => ({ ...e, powerBackup: true }));
  };
  const handleParkingChange = () => {
    setFormData((e) => ({ ...e, parkingFacility: true }));
  };
  
  const createUser = async () => {
    createUserWithEmailAndPassword(auth , formData?.email, formData?.password)
      .then((userCredential) => {
        // User signed up successfully
        const user = userCredential.user;
        // Additional user data to be stored in the database
        const userData = {
          name: formData?.name,
          email: formData?.email,
          role: 'aya'
        };
        const usersCollectionRef = collection(db, "users");
        const userDocRef = doc(usersCollectionRef, user.uid);

        setDoc(userDocRef, userData)
          .then(() => {
            handleUploadImage(user?.uid)
            console.log("User data saved successfully!");
            // Do something else, like redirecting to another page
          })
          .catch((error) => {
            console.log("Error saving user data:", error);
          });
      })
      .catch((error) => {
        // Handle signup errors
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorMessage);
        // Handle specific error codes or display a generic error message
      });
  }
  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (editData) {
      handleUploadImage();
    } else {
      createUser();
      // handleUploadImage();
    }
  };
  const delteImage = async () => {
    const desertRef = ref(storage, `aya/${imgName}`);

    try {
      const res = await deleteObject(desertRef);
      console.log(res, "res");
      setPreview("");
      setImgName("");
      setBtnPre(<span>Deleted</span>);
      await updateDoc(doc(db, "aya", formData.id), { images: {} });
    } catch (err) {
      console.log(err);
    }
  };
  const changeImage = async () => {
    const desertRef = ref(storage, `aya/${formData.images.name}`);
    try {
      const res = await deleteObject(desertRef);
      console.log(res, "res");
      handleUploadImage();
      await updateDoc(doc(db, "aya", res.id), {
        images: { url: imgUrl, name: imgUrl.name },
      });
      alert("hello");
    } catch (err) {
      console.log(err);
    }
  };
  const addData = async (imageUrl, id) => {
    // setBtnAdd("disable");
    const url = imageUrl;
    const newCityRef = collection(db, "aya");
    // const {title,fees,address,powerAvail,doctorAvail,}=formData

    try {
      const res = await addDoc(newCityRef, {
        ...formData, auth_id: id
      });
      console.log(res.id);

      await updateDoc(doc(db, "aya", res.id), {
        id: res.id,
        images: { url: imageUrl, name: imgUrl.name },
      });
      MySwal.fire('Added Data Successfully')
      setBtnAdd("primary");
      router.reload("/aya");
      setVisibleAlert(true);
      setTimeout(() => {
        setVisibleAlert(false);
      }, 5000);
      handleOk();
      setLoading(false);
    } catch (err) {
    
      MySwal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Something went wrong!',
   
      })
      setLoading(false)
      console.log(err);
    }
  };
  const updateData = async (docs) => {
    const newCityRef = collection(db, "aya");
    // const {title,fees,address,powerAvail,doctorAvail,}=formData

    try {
      if (inUpdate) {
        const desertRef = ref(storage, `aya/${formData.images.name}`);
        const deleteImg = await deleteObject(desertRef);
        console.log(deleteImg);
      }
      await updateDoc(doc(db, "aya", formData.id), { ...formData });
      if (inUpdate) {
        await updateDoc(doc(db, "aya", formData.id), {
          images: { url: docs, name: imgUrl.name },
        });
      }
      MySwal.fire('Updated Data Successfully')
      setInUpdate(false);
      setVisibleAlert(true);
      setTimeout(() => {
        setVisibleAlert(false);
      }, 1000);
      handleOk();
      setEditData(false);
      router.reload("/aya");
    } catch (err) {
      MySwal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Something went wrong!',
   
      })
      setLoading(false)
      console.log(err);
    }
  };
  const deleteData = async (e) => {
    console.log(e);
    try {
      const desertRef = ref(storage, `aya/${e.images.name}`);
      const deleteImg = await deleteObject(desertRef);
      const res = await deleteDoc(doc(db, "aya", e.id));
      console.log(res);
      console.log(deleteImg);
      setAlertType("error");
      MySwal.fire('Deleted Data Successfully')
      router.reload("/category");
      setVisibleAlert(true);
      setTimeout(() => {
        setVisibleAlert(false);
      }, 5000);
    } catch (err) {
      MySwal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Something went wrong!',
   
      })
      setLoading(false)
      console.log(err);
    }
  };
  const handleUploadImage = async (id) => {
    setLoading(true);
    const imgRef = ref(storage, `aya/${imgUrl ? imgUrl.name : ""}`);

    try {
      const res = await uploadBytes(imgRef, imgUrl);
      console.log(res, "result");
      const uploadTask = uploadBytesResumable(imgRef, imgUrl);

      const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
      console.log("File available at", downloadURL);
      // addData();
      setUploadedUrl(downloadURL);
      editData ? updateData(downloadURL) : addData(downloadURL, id);
    } catch (err) {
      console.log(err, "message");
    }
  };

  const fetchData = async () => {
    let arr = [];
    const dbRef = collection(db, "aya");
    try {
      const res = await getDocs(dbRef);
      res.docs.map((doc) => {
        arr.push(doc.data());
      });
      return arr;
    } catch (error) {
      console.log(error);
    }
  };
  const { isLoading, data, error } = useQuery(["Aya"], fetchData, {
    staleTime: 60000,
  });
  console.log(isLoading, data);

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
            src={record.images?record.images.url:''}
            alt={record.name}
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
      sorter: (a, b) => a.age - b.age,
      render: (_, record) => {
        let short = record.name;
        return record?.name ? (
          <div className="flex items-center w-[160px] justify-center space-x-2">
            <span className="text-sm font-poppins text-clip font-medium text-[#474747]">
              {record.name ? short.slice(0, 50) : "NA"}
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
          {record.gender=="male"?
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
        let short = record.details;

        return (
          <div className=" flex items-center w-[160px] justify-center">
            <span className="text-sm  text-clip font-poppins font-medium text-[#474747]">
              {/* {record.description} */}
              {record.details ? short.slice(0, 50) : "NA"}
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
            {record.fees + "" + "$"}
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
              {record.discount + "" + "$"}
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
                Email: {record.email}
              </span>
              <span className="mx-auto text-center  text-sm font-poppins font-normal text-[black] w-[160px]  py-1">
                Phone: {record.phone}
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
              {record.education}
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
              {record.experience}
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
            Working At
          </span>
        </div>
      ),
      dataIndex: "payment",
      sorter: (a, b) => a.age - b.age,
      render: (_, record) => (
        <div className="w-full flex items-center  justify-center">
          {
            <span className="mx-auto text-center text-sm font-poppins font-normal text-[black] w-[160px]  py-1">
              {record.workingAt}
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
                        setPreview(record.images.url);
                        setImgName(record.images.name);
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
        <h1 className="font-semibold font-barlow text-2xl ml-6">Aya</h1>
        <button
          className=" bg-[#1A3578] hover:bg-blue-900 text-white font-semibold py-3 px-4 rounded "
          onClick={() => {
            setEditData(false);
            showModal();
          }}
        >
          + Add Aya
        </button>
      </div>
      <Modal
        visible={visible}
        title="Add Aya"
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
                placeholder=""
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
                placeholder=""
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
              <div style={{ width: "170px" }}>
                <label className="text-lg">Password</label>
              </div>
              <Input
                type="password"
                className="py-1 px-2 outline-none w-full border-b  border-gray rounded-md"
                placeholder="password"
                value={formData.password}
                name="password"
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
            <div className="col-span-6 flex space-x-2">
              <div style={{ width: "147px" }}>
                <label className="text-lg">Gender</label>
              </div>
              <div>
              <Select
                  className="w-[147px] px-2 ml-6 rounded-md text-black"
                name="gender"
                placeholder="Gender"
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
            <div className="col-span-12 flex ">
              <div style={{ width: "170px" }}>
                <label className="text-[17px] ">Details</label>
              </div>
              <div className=" -ml-[35px] w-full">
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
                className="ml-12"
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
          dataSource={data}
          onChange={onChange}
          id="newOrders"
          scroll={{ x: 900 }}
        />
      </div>
    </div>
  );
};

export default Index;
