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

import {
  UserOutlined,
  MoreOutlined,
  CloseCircleOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import React from "react";
import { Modal, Form, Input, Button, Upload, Radio ,Select,Image} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { db, storage } from "@/config/firebase";
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
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
const { TextArea } = Input;

const Index = () => {
  const MySwal = withReactContent(Swal);
  const [visibleAlert, setVisibleAlert] = useState(false);
  const [alertText, setAlertText] = useState("");
  const [alertType, setAlertType] = useState("success");
  const [imgUrl, setImgUrl] = useState("");
  const [imgUrl1, setImgUrl1] = useState("");
  const [imgUrl2, setImgUrl2] = useState("");
  const [uplodedUrl, setUploadedUrl] = useState("");
  const [uplodedUrl1, setUploadedUrl1] = useState("");
  const [uplodedUrl2, setUploadedUrl2] = useState("");
  const [preview, setPreview] = useState("");
  const [preview1, setPreview1] = useState("");
  const [preview2, setPreview2] = useState("");
  const [btnPre, setBtnPre] = useState(<span>Change</span>);
  const [visible, setVisible] = useState(false);
  const [form] = Form.useForm();
  const router = useRouter();
  const [editData, setEditData] = useState(false);
  const [imgName, setImgName] = useState("");
  const [imgName1, setImgName1] = useState("");
  const [imgName2, setImgName2] = useState("");
  const [btnAdd, setBtnAdd] = useState("primary");
  const [loading, setLoading] = useState(false);
  const [arr, setarr] = useState([]);
  const [inUpdate, setInUpdate] = useState(false);
  const [inUpdate1, setInUpdate1] = useState(false);
  const [inUpdate2, setInUpdate2] = useState(false);
  var previewArr = [];
  const [formData, setFormData] = useState({
    name: "",
    fees: "",
    discount: "",
    address: "",
    email: "",
    longitude: "",
    latitude: "",
    id: "",
    description: "",
    doctorAvail: false,
    powerBackup: false,
    parkingFacility: false,
    images: {
      url: "",
      name: "",
    },
  });

  const handleFormChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
  };

  const handleDoctorChange = () => {
    setFormData((e) => ({ ...e, doctorAvail: true }));
  };
  const handlePowerChange = () => {
    setFormData((e) => ({ ...e, powerBackup: true }));
  };
  const handleParkingChange = () => {
    setFormData((e) => ({ ...e, parkingFacility: true }));
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
    const desertRef = ref(storage, `rehab/${imgName}`);
    const desertRef1 = ref(storage, `rehab/${imgName1}`);
    const desertRef2 = ref(storage, `rehab/${imgName2}`);

    try {
      const res = await deleteObject(desertRef);
      console.log(res, "res");
      setPreview("");
      setImgName("");
      setImgName1("");
      setImgName2("");
      setBtnPre(<span>Deleted</span>);
      await updateDoc(doc(db, "rehab", formData.id), { images: {} });
    } catch (err) {
      console.log(err);
    }
  };
  const changeImage = async () => {
    const desertRef = ref(storage, `rehab/${formData.images.name}`);
    try {
      const res = await deleteObject(desertRef);
      console.log(res, "res");
      handleUploadImage();
      await updateDoc(doc(db, "rehab", res.id), {
        images: { url: imgUrl, name: imgUrl.name },
      });
      alert("hello");
    } catch (err) {
      console.log(err);
    }
  };
  const addData = async (imageUrl, imageUrl1, imageUrl2) => {
    // setBtnAdd("disable");
    const url = imageUrl;
    const newCityRef = collection(db, "rehab");
    // const {title,fees,address,powerAvail,doctorAvail,}=formData

    try {
      const res = await addDoc(newCityRef, {
        ...formData,
      });
      console.log(res.id);

      await updateDoc(doc(db, "rehab", res.id), {
        id: res.id,
        images: {
          url: imageUrl,
          name: imgUrl.name,
          url1: imageUrl1,
          name1: imgUrl1.name,
          url2: imageUrl2,
          name2: imgUrl2.name,
        },
      });
      setAlertType("success");
      setAlertText("Data Added SuccessFully");
      setBtnAdd("primary");
      MySwal.fire({
        title: <p>rehab added SuccessFully</p>,
        didOpen: () => {
          // `MySwal` is a subclass of `Swal` with all the same instance & static methods
          MySwal.showLoading();
        },
      }).then(() => {
        return MySwal.fire(<p>Shorthand works too</p>);
      });
      router.reload("/rehab");
      setVisibleAlert(true);
      setTimeout(() => {
        setVisibleAlert(false);
      }, 5000);
      handleOk();
      setLoading(false);
    } catch (err) {
      console.log(err);
    }
  };
  const updateData = async (docs, docs1, docs2) => {
    const newCityRef = collection(db, "rehab");
    // const {title,fees,address,powerAvail,doctorAvail,}=formData

    try {
  
      if (inUpdate && !inUpdate1 && !inUpdate2) {
        const desertRef = ref(storage, `rehab/${formData.images.name}`);
        const deleteImg = await deleteObject(desertRef);
        console.log(deleteImg);
      } else if (!inUpdate && inUpdate1 && !inUpdate2) {
        const desertRef = ref(storage, `rehab/${formData.images.name1}`);
        const deleteImg = await deleteObject(desertRef);
        console.log(deleteImg);
      } else if (inUpdate && inUpdate1 && !inUpdate2) {
        const desertRef = ref(storage, `rehab/${formData.images.name}`);
        const deleteImg = await deleteObject(desertRef);
        const desertRef1 = ref(storage, `rehab/${formData.images.name1}`);
        const deleteImg1 = await deleteObject(desertRef1);
        console.log(deleteImg);
      } else if (inUpdate && inUpdate1 && inUpdate2) {
        const desertRef = ref(storage, `rehab/${formData.images.name}`);
        const deleteImg = await deleteObject(desertRef);
        const desertRef1 = ref(storage, `rehab/${formData.images.name1}`);
        const deleteImg1 = await deleteObject(desertRef1);
        const desertRef2 = ref(storage, `rehab/${formData.images.name2}`);
        const deleteImg2 = await deleteObject(desertRef2);
        console.log(deleteImg,deleteImg2);
      } else if (!inUpdate && inUpdate1 && inUpdate2) {
        const desertRef = ref(storage, `rehab/${formData.images.name1}`);
        const deleteImg = await deleteObject(desertRef);
        const desertRef1 = ref(storage, `rehab/${formData.images.name2}`);
        const deleteImg1 = await deleteObject(desertRef1);
        console.log(deleteImg);
      } else if (inUpdate && !inUpdate1 && inUpdate2) {
        const desertRef = ref(storage, `rehab/${formData.images.name}`);
        const deleteImg = await deleteObject(desertRef);
        const desertRef1 = ref(storage, `rehab/${formData.images.name2}`);
        const deleteImg2 = await deleteObject(desertRef1);
        console.log(deleteImg);
      }
      await updateDoc(doc(db, "rehab", formData.id), { ...formData });
      if (inUpdate && !inUpdate1 && !inUpdate2) {
        await updateDoc(doc(db, "rehab", formData.id), {
          images: {
            url: docs,
            name: imgUrl.name,
            url1: formData.images.url1,
            name1: formData.images.name1,
            url2: formData.images.url2,
            name2: formData.images.name2,
          },
        });
      } else if (!inUpdate && inUpdate1 && !inUpdate2) {
        await updateDoc(doc(db, "rehab", formData.id), {
          images: {
            url: formData.images.url,
            name: formData.images.name,
            url1: docs1,
            name1: imgUrl1.name,
            url2: formData.images.url2,
            name2: formData.images.name2,
          },
        });
      } else if (inUpdate && inUpdate1 && !inUpdate2) {
        await updateDoc(doc(db, "rehab", formData.id), {
          images: {
            url: docs,
            name: imgUrl.name,
            url1: docs1,
            name1: imgUrl1.name,
            url2: formData.images.url2,
            name2: formData.images.name,
          },
        });
      } else if (inUpdate && inUpdate1 && inUpdate2) {
        await updateDoc(doc(db, "rehab", formData.id), {
          images: {
            url: docs,
            name: imgUrl.name,
            url1: docs1,
            name1: imgUrl1.name,
            url2: docs2,
            name2: imgUrl2.name,
          },
        });
      } else if (!inUpdate && inUpdate1 && inUpdate2) {
        await updateDoc(doc(db, "rehab", formData.id), {
          images: {
            url: formData.images.url,
            name: formData.images.name,
            url1: docs1,
            name1: imgUrl1.name,
            url2: docs2,
            name2: imgUrl2.name,
          },
        });
      } else if (inUpdate && !inUpdate1 && inUpdate2) {
        await updateDoc(doc(db, "rehab", formData.id), {
          images: {
            url: docs,
            name: imgUrl.name,
            url1: formData.images.url1,
            name1: formData.images.name1,
            url2: docs2,
            name2: imgUrl2.name,
          },
        });
      }

      setAlertType("success");
      setAlertText("Data Added SuccessFully");
      setInUpdate(false);
      setVisibleAlert(true);
      setTimeout(() => {
        setVisibleAlert(false);
      }, 1000);
      handleOk();
      setEditData(false);
      router.reload("/rehab");
    } catch (err) {
      console.log(err);
    }
  };
  const deleteData = async (e) => {
    console.log(e);
    try {
      const desertRef = ref(storage, `rehab/${e.images.name}`);
      const desertRef1 = ref(storage, `rehab/${e.images.name1}`);
      const desertRef2 = ref(storage, `rehab/${e.images.name2}`);
      const deleteImg = await deleteObject(desertRef);
      const deleteImg1 = await deleteObject(desertRef1);
      const deleteImg2 = await deleteObject(desertRef2);
      const res = await deleteDoc(doc(db, "rehab", e.id));
      console.log(res);
      console.log(deleteImg);
      setAlertType("error");
      setAlertText("Data Deleted SuccessFully");
      MySwal.fire({
        title: <p>rehab Deleted SuccessFully</p>,
        didOpen: () => {
          // `MySwal` is a subclass of `Swal` with all the same instance & static methods
          MySwal.showLoading();
        },
      }).then(() => {
        return MySwal.fire(<p>Shorthand works too</p>);
      });
      router.reload("/category");
      setVisibleAlert(true);
      setTimeout(() => {
        setVisibleAlert(false);
      }, 5000);
    } catch (err) {
      console.log(err);
    }
  };
  const handleUploadImage = async () => {
    setLoading(true);
    const imgRef = ref(storage, `rehab/${imgUrl ? imgUrl.name : ""}`);
    const imgRef1 = ref(storage, `rehab/${imgUrl1 ? imgUrl1.name : ""}`);
    const imgRef2 = ref(storage, `rehab/${imgUrl2 ? imgUrl2.name : ""}`);
    try {
      const res = await uploadBytes(imgRef, imgUrl);
      console.log(res, "result");
      const uploadTask = uploadBytesResumable(imgRef, imgUrl);
      const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
      const res1 = await uploadBytes(imgRef1, imgUrl1);
      console.log(res1, "result");
      const uploadTask1 = uploadBytesResumable(imgRef1, imgUrl1);
      const downloadURL1 = await getDownloadURL(uploadTask1.snapshot.ref);
      const res2 = await uploadBytes(imgRef2, imgUrl2);
      console.log(res2, "result");
      const uploadTask2 = uploadBytesResumable(imgRef2, imgUrl2);
      const downloadURL2 = await getDownloadURL(uploadTask2.snapshot.ref);
      console.log("File available at", downloadURL2);
      // addData();
      setUploadedUrl(downloadURL);
      setUploadedUrl(downloadURL1);
      setUploadedUrl(downloadURL2);
      editData
        ? updateData(downloadURL, downloadURL1, downloadURL2)
        : addData(downloadURL, downloadURL1, downloadURL2);
    } catch (err) {
      console.log(err, "message");
    }
  };

  const fetchData = async () => {
    let arr = [];
    const dbRef = collection(db, "rehab");
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
  const { isLoading, data, error } = useQuery(["rehab"], fetchData, {
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
      longitude: "",
      latitude: "",
      id: "",
      description: "",
      doctorAvail: false,
      powerBackup: false,
      parkingFacility: false,
      images: {
        url: "",
        name: "",
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
  const uploadButton1 = editData ? (
    <div className="flex">
      <Image
        src={preview1}
        className="object-cover rounded-xl"
        width={90}
        height={95}
        alt="image"
      />
    </div>
  ) : preview1 == "" ? (
    <div>
      <UploadOutlined />
      <div className="ant-upload-text">Upload</div>
    </div>
  ) : (
    <div className="flex">
      <Image
        src={preview1}
        className="object-cover rounded-xl"
        width={90}
        height={95}
        alt="image"
      />
    </div>
  );
  const uploadButton2 = editData ? (
    <div className="flex">
      <Image
        src={preview2}
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
  ) : preview2 == "" ? (
    <div>
      <UploadOutlined />
      <div className="ant-upload-text">Upload</div>
    </div>
  ) : (
    <div className="flex">
      <Image
        src={preview2}
        className="object-cover rounded-xl"
        width={90}
        height={95}
        alt="image"
      />
      <Button
        className="-ml-8 h-6 w-4 text-center flex justify-center items-center  text-red-800"
        onClick={() => {
          setPreview2("");
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
        <div className="flex items-center space-x-4 justify-center w-[160px]">
          <Image src={"/images/sort.svg"} width={20} height={20} style={{}} />
          <span className="text-base font-poppins font-medium">Facilities</span>
        </div>
      ),
      dataIndex: "payment",
      sorter: (a, b) => a.age - b.age,
      render: (_, record) => (
        <div className="w-full flex flex-col items-center  justify-center">
          {
            <>
              <span className="mx-auto text-center text-sm font-poppins font-normal text-[black] w-[160px]  py-1">
                24/7 Doctors
                {record.doctorAvail ? (
                  <span className="text-green-400 ml-5">
                    {" "}
                    <CheckCircleOutlined />
                  </span>
                ) : (
                  <span className="text-red-400 ml-2">
                    {" "}
                    <CloseCircleOutlined />
                  </span>
                )}
              </span>
              <span className="mx-auto text-center text-sm font-poppins font-normal text-[black] w-[160px]  py-1">
                PowerBackup
                {record.powerBackup ? (
                  <span className="text-green-400 ml-3">
                    {" "}
                    <CheckCircleOutlined />
                  </span>
                ) : (
                  <span className="text-red-400 ml-2">
                    {" "}
                    <CloseCircleOutlined />
                  </span>
                )}
              </span>

              <span className="mx-auto text-center text-sm font-poppins font-normal text-[black] w-[160px]  py-1">
                Parking facility
                {record.parkingFacility ? (
                  <span className="text-green-400 ml-1">
                    {" "}
                    <CheckCircleOutlined />
                  </span>
                ) : (
                  <span className="text-red-400 ml-2">
                    {" "}
                    <CloseCircleOutlined />
                  </span>
                )}
              </span>
            </>
          }
        </div>
      ),
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
        let short = record.description;

        return (
          <div className=" flex items-center w-[160px] justify-center">
            <span className="text-sm  text-clip font-poppins font-medium text-[#474747]">
              {/* {record.description} */}
              {record.description ? short.slice(0, 50) : "NA"}
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
          <span className="text-base font-poppins font-medium">Latitude</span>
        </div>
      ),
      dataIndex: "payment",
      sorter: (a, b) => a.age - b.age,
      render: (_, record) => (
        <div className="w-full flex items-center  justify-center">
          {
            <span className="mx-auto text-center text-sm font-poppins font-normal text-[black] w-[160px]  py-1">
              {record.latitude}
            </span>
          }
        </div>
      ),
    },
    {
      title: (
        <div className="flex items-center space-x-4 justify-center w-[160px]">
          <Image src={"/images/sort.svg"} width={20} height={20} style={{}} />
          <span className="text-base font-poppins font-medium">Longitude</span>
        </div>
      ),
      dataIndex: "payment",
      sorter: (a, b) => a.age - b.age,
      render: (_, record) => (
        <div className="w-full flex items-center  justify-center">
          {
            <span className="mx-auto text-center text-sm font-poppins font-normal text-[black] w-[160px]  py-1">
              {record.longitude}
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
                        setPreview1(record.images.url1);
                        setImgName1(record.images.name1);
                        setPreview2(record.images.url2);
                        setImgName2(record.images.name2);
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
        <h1 className="font-semibold font-barlow text-2xl ml-6">Rehab</h1>
        <button
          className=" bg-[#1A3578] hover:bg-blue-900 text-white font-semibold py-3 px-4 rounded "
          onClick={() => {
            setEditData(false);
            showModal();
          }}
        >
          + Add Rehab
        </button>
      </div>

      <Modal
        visible={visible}
        title="Add Rehab"
        onOk={handleOk}
        onCancel={handleCancel}
        footer={false}
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
                <label className="text-lg">Latitude</label>
              </div>
              <Input
                required
                type="text"
                className="py-1 px-2 outline-none w-full border-b  border-gray rounded-md"
                placeholder="124.000"
                value={formData.latitude}
                name="latitude"
                onChange={handleFormChange}
              />
            </div>
            <div className="col-span-6 flex space-x-2">
              <div style={{ width: "147px" }}>
                <label className="text-lg">Longitude</label>
              </div>
              <Input
                type="text"
                className="py-1 px-2 outline-none w-full border-b  border-gray rounded-md"
                placeholder="-245.00"
                value={formData.longitude}
                name="longitude"
                onChange={handleFormChange}
              />
            </div>

            <div className="col-span-12 flex ">
              <div style={{ width: "170px" }}>
                <label className="text-[17px] ">Description</label>
              </div>
              <div className=" -ml-8 w-full">
                <TextArea
                  rows="2"
                  type="text"
                  className="py-2 px-2 outline-none w-full border-b  border-gray rounded-md"
                  placeholder="Enter Details Here"
                  value={formData.description}
                  name="description"
                  onChange={handleFormChange}
                />
              </div>
            </div>
            <div className="col-span-12   -mt-4">
              <h4 className="text-lg">Facilities</h4>
              <div className="flex gap-x-12 ">
                <div className="flex items-center gap-x-2 text-lg">
                  <Input
                    type="checkbox"
                    className="h-4 w-4"
                    name="doctor"
                    onChange={handleDoctorChange}
                  />
                  <label>24/7</label>
                </div>
                <div className="flex items-center gap-x-2 text-lg">
                  <Input
                    type="checkbox"
                    className="h-4 w-4"
                    name="doctor"
                    onChange={handlePowerChange}
                  />
                  <label>Power backup</label>
                </div>
                <div>
                  <div className="flex items-center gap-x-2 text-lg">
                    <Input
                      type="checkbox"
                      className="h-4 w-4"
                      name="doctor"
                      onChange={handleParkingChange}
                    />
                    <label>Parking facilities</label>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-span-4 ml-4 mt-4">
              <Form.Item
                label="1st Image"
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
                  name="image"
                  listType="picture-card"
                  showUploadList={false}
                  beforeUpload={() => false}
                >
                  {uploadButton}
                </Upload>
              </Form.Item>
            </div>
            <div className="col-span-4 ml-6 mt-4">
              <Form.Item
                label="2nd Image"
                name="image"
                valuePropName="fileList"
                getValueFromEvent={(e) => {
                  if (Array.isArray(e)) {
                    return e;
                  }
                  setImgUrl1(e.file);
                  // handleUploadImage()
                  let b = URL.createObjectURL(e.file);
                  setPreview1(b);
                  setInUpdate1(true);
                  console.log(arr, "arr");
                  return e && e.fileList;
                }}
              >
                <Upload
                  name="image"
                  listType="picture-card"
                  showUploadList={false}
                  beforeUpload={() => false}
                >
                  {uploadButton1}
                </Upload>
              </Form.Item>
            </div>
            <div className="col-span-4 ml-6 mt-4">
              <Form.Item
                label="3rd Image"
                name="image"
                valuePropName="fileList"
                getValueFromEvent={(e) => {
                  if (Array.isArray(e)) {
                    return e;
                  }
                  setImgUrl2(e.file);
                  // handleUploadImage()
                  let b = URL.createObjectURL(e.file);
                  setPreview2(b);
                  setInUpdate2(true);
                  console.log(arr, "arr");
                  return e && e.fileList;
                }}
              >
                <Upload
                  name="image"
                  listType="picture-card"
                  showUploadList={false}
                  beforeUpload={() => false}
                >
                  {uploadButton2}
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
