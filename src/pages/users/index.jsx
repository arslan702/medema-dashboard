import { Table, Avatar, Tag, Menu } from "antd";

import { useState } from "react";
import Head from "next/head";
import Image from "next/image";
import { UserOutlined, MoreOutlined, CloseCircleOutlined, CheckCircleOutlined } from "@ant-design/icons";
const Index = () => {
  const [current, setCurrent] = useState('mail');
  const onClick = (e) => {
    console.log('click ', e);
    setCurrent(e.key);
  };
  console.log(Menu, 'menue')
  const items = [
    {
      label: <label className="text-green-300 ">Accept</label>,
      key: "accept",

    },
    {
      label: <label className="text-red-300 ">Reject</label>,
      key: "reject",

    }
  ]
  const columns = [
    {
      title: (
        <div className="flex items-center space-x-4">
          <span className="text-base font-poppins font-medium">#</span>
          <Image
            src={"/images/sort.svg"}
            width={20}
            height={20}
            style={{ marginLeft: "8px" }}
          />
        </div>
      ),
      dataIndex: "no",
      sorter: (a, b) => a.age - b.age,
      render: (_, record) => (
        <div className="w-full flex items-center justify-center">
          <span className="text-base font-poppins font-medium text-[#474747]">
            {record.no}
          </span>
        </div>
      ),
    },
    {
      title: (
        <div className="flex items-center space-x-4">
          <span className="text-base font-poppins font-medium">Image</span>
        </div>
      ),
      dataIndex: "date",
      render: (_, record) => (
        <div className="w-full flex items-center">
         <Avatar
              icon={<UserOutlined />}
              src={
                record?.user?.image
                  ? `${process.env.NEXT_PUBLIC_API_URL}${record?.user?.image.url}`
                  : ""
              }
              className="flex items-center justify-center"
            />
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
            style={{ marginLeft: "0px" }}
          />
          <span className="text-base font-poppins font-medium">Name</span>
        </div>
      ),
      dataIndex: "name",
      sorter: (a, b) => a.age - b.age,
      render: (_, record) => {
        return record?.name ? (
          <div className="flex items-center justify-center space-x-2">
           
            <span className="text-sm font-poppins font-medium text-[#474747]">
              {record?.name}
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
          {record.gender=="Male"?
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
        <div className="flex items-center justify-center  w-[80px] space-x-4">
          <Image
            src={"/images/sort.svg"}
            width={20}
            height={20}

          />
          <span className="text-base font-poppins font-medium">Adress</span>
        </div>
      ),
      dataIndex: "service",
      sorter: (a, b) => a.age - b.age,
      render: (_, record) => (
        <div className=" flex items-center w-[80px] justify-center">
          <span className="text-sm w-full text-ellipsis font-poppins font-medium text-[#474747]">
            {record.address}
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
          <span className="text-base font-poppins font-medium">Mobile</span>
        </div>
      ),
      dataIndex: "status",
      sorter: (a, b) => a.age - b.age,
      render: (_, record) => (
        <div className="w-full flex items-center justify-center">
          <span
          
            className="mx-auto text-sm font-poppins font-normal text-[black] px-6 py-1"
          >
            {record.mobile}
          </span>
        </div>
      ),
    },
    {
      title: (
        <div className="flex items-center space-x-4 w-[120px] ">
          <Image
            src={"/images/sort.svg"}
            width={20}
            height={20}
            style={{ marginLeft: "8px" }}
          />
          <span className="text-base font-poppins font-medium">Role</span>
        </div>
      ),
      dataIndex: "payment",
      sorter: (a, b) => a.age - b.age,
      render: (_, record) => (
        <div className="flex items-center w-[120px] justify-center" >
          {
        
              <span
               
                className="mx-auto w-full text-center text-sm font-poppins font-normal text-[black] px-4 py-1"
              >
                {record.role}
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
          {
            record.payment == "Paid" ?
              <div className="text-black text-xl">
                <CheckCircleOutlined />
              </div>
              :
              <div className="text-black text-xl">
                <CloseCircleOutlined />
              </div>
          }

        </div>
      ),
    },
  ];
  const data = [
    {
      key: "1",
      name: "John Brown",
      no: 1,
      gender: "Male",
      address: "11, street a.....",
      mobile: "43545354667",
      role: "User",
      service: "Rehab",
    },
    {
      key: "2",
      name: "John Brown",
      no: 2,
      gender: "Male",
      address: "11, street a.....",
      mobile: "43545354667",
      role: "Doctor",
      service: "Physio",
    },
    {
      key: "3",
      name: "Emma",
      no: 3,
      gender: "Female",
      address: "11, street a.....",
      mobile: "43545354667",
      role: "Nurse",
      service: "Aya",
    },
    {
      key: "4",
      name: "John Brown",
      no: 4,
      gender: "Male",
      address: "11, street a.....",
      mobile: "43545354667",
      role: "Aya",
      service: "Rehab",
    },
    {
      key: "5",
      name: "Emma",
      no: 4,
      gender: "Female",
      address: "11, street a.....",
      mobile: "43545354667",
      role: "patient",
      service: "Rehab",
    },
  ];
  const headings = ['#', 'Date', 'User', 'Provider', 'Service', 'Status', 'Payment', 'Actions']

  const onChange = (pagination, filters, sorter, extra) => {
    console.log("params", pagination, filters, sorter, extra);
  };
  console.log(typeof (headings.length.toString()))
  return (
    <div className="flex flex-col bg-white space-y-6">
      <h1 className="font-semibold font-barlow text-2xl">Users</h1>
      <div className="felx flex-col" >

        <div className="">
          {/* <Table
          columns={columns}
          dataSource={data}
          onChange={onChange}
          id="newOrders"
          scroll={{ x: 900 }}
        /> */}
          
          <Table
          columns={columns}
          dataSource={data}
          onChange={onChange}
          id="newOrders"
          scroll={{ x: 900 }}
        />
        </div>
      </div>
    </div>
  );
};

export default Index;
