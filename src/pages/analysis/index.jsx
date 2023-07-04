import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,


} from 'chart.js';
import { Select } from 'antd';
import Image from 'next/image';
import { Line } from 'react-chartjs-2';
const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'];
const Index = () => {

  ChartJS.register(CategoryScale, LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Filler,
  )

  const options = {
    responsive: true,
    indexAxis: 'x',
    scales: {
      y: {
        beginAtZero: true,

      }
    },
    plugins: {

      //  title: {
      //     display: true,
      //     text: 'Patient State',

      //   },
    },
  };
  const data = {
    labels,
    datasets: [
      {
        
        fill: true,
        data: [20, 40, 30, 60, 50, 70, 80, 90],
        borderColor: 'rgb(53, 162, 235)',
        backgroundColor: [
          'rgb(173, 216, 230)',


        ],
        borderWidth: 2


      },
    ],
  };
  const data1 = {
    labels,
    datasets: [
      {

        fill: true,
        data: [20, 40, 30, 60, 50, 70, 80, 90],
        borderColor: 'rgb(53, 162, 235)',
        backgroundColor: [
          'rgb(	144, 238, 144)',


        ],
        borderWidth: 2


      },
    ],
  };

  return (
    <div className='mt-[40px]  h-[400px] w-[900px] gap-6 grid grid-cols-2 ml-6 '>
      <div className='h-[350px] w-[430px]  col-span-1 bg-slate-100  border border-spacing-2 flex flex-col items-center shadow-xl  rounded-md p-4' >
        <div className='flex justify-between items-center px-3 w-full'>
          <h2>Patients State</h2>
          <div className='h-[20px]'>
            <Select
              suffixIcon={
                <Image
                  src={"/images/dropdown.svg"}
                  width={7.18}
                  height={4.59}
                />
              }
              style={{
                width: "5rem",
                boxShadow: "0px 2px 24px rgba(0, 0, 0, 0.12)",
              }}
              bordered={false}
              className="text-xs font-normal"
              placeholder="Today"
              options={[
                { value: "Paid", label: "Paid" },
                { value: "UnPaid", label: "UnPaid" },
              ]}
            />
          </div>
        </div>
        <div className=''>

          {/* <div className='rotate-270 h-[20px] w-[180px] inline '>Patients Visits</div> */}
          <div className='-rotate-90 h-[20px] w-[180px]  relative top-[60px] -left-[96px] font-poppins text-xs text-darkgray'>Patients Visits</div>
          <div className=''>
            <Line options={options} data={data} style={{ height: "270px", width: "400px" }} />
          </div>
          <div className='flex justify-center text-sm'>
            <h2 className='text-sm font-poppins font-normal'>Months</h2>
          </div>
        </div>
      </div>
      <div className='h-[350px] w-[430px]  col-span-1 bg-slate-100  border border-spacing-2 flex flex-col items-center shadow-xl  rounded-md p-4' >
        <div className='flex justify-between items-center px-3 w-full'>
          <h2>Orders State</h2>
          <div className='h-[20px]'>
            <Select
              suffixIcon={
                <Image
                  src={"/images/dropdown.svg"}
                  width={7.18}
                  height={4.59}
                />
              }
              style={{
                width: "5rem",
                boxShadow: "0px 2px 24px rgba(0, 0, 0, 0.12)",
              }}
              bordered={false}
              className="text-xs font-normal"
              placeholder="Today"
              options={[
                { value: "Paid", label: "Paid" },
                { value: "UnPaid", label: "UnPaid" },
              ]}
            />
          </div>
        </div>
        <div className=''>

          {/* <div className='rotate-270 h-[20px] w-[180px] inline '>Patients Visits</div> */}
          <div className='-rotate-90 h-[20px] w-[180px]  relative top-[60px] -left-[96px] font-poppins text-xs text-darkgray'>Patients Visits</div>
          <div className=''>
            <Line options={options} data={data1} style={{ height: "270px", width: "400px" }} />
          </div>
          <div className='flex justify-center text-sm'>
            <h2 className='text-sm font-poppins font-normal'>Months</h2>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Index;



