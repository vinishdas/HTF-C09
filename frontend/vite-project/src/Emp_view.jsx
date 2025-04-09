import React from 'react'
import mark from './assets/mark.png'
import { useLocation } from 'react-router-dom';
import g_round from './assets/round.png'
import checked from './assets/checked.png'
import project from './assets/project.png'
import { useNavigate } from 'react-router-dom';
import  { useEffect, useState } from 'react';
import UserProfile from './userProfile';
const Emp_view = () => {
    const location = useLocation();
    const { id, name, role } = location.state || {};
    console.log(name,id);
    const [notifications, setNotifications] = useState([]);
    const [showModal, setShowModal] = useState(false);

    const fetchNotifications = async () => {
      try {
        const res = await fetch(`http://localhost:3000/notifications/${id}`);
        const data = await res.json();
        if (data.length > 0) {
          setNotifications(data);
           // open modal if there are new ones
        }
      } catch (err) {
        console.error("Failed to fetch notifications", err);
      }
    };

    useEffect(() => {
      const interval = setInterval(fetchNotifications, 5000);
      return () => clearInterval(interval);
    }, []);
  
    const markAsRead = async (notifId) => {
      try {
        await fetch(`http://localhost:3000/notifications/confirm/${notifId}`, {
          method: 'PATCH',
        });
        // Remove from view
        setNotifications(prev => prev.filter(n => n.id !== notifId));
        if (notifications.length === 1) setShowModal(false); // hide if last
      } catch (err) {
        console.error("Error marking as read", err);
      }
    };
    const navigate = useNavigate();

    // const handleProjectClick = () => {
    //   navigate('/projects', {
    //     state: {
    //       id: id,
    //       name: name,
    //       role: role,
    //     },
    //   });
    // };
    


    const handleProjectClick = () => {
      let sixthWord = '';
    
      if (notifications.length > 0) {
        const words = message
      
      }
    
      navigate('/projects', {
        state: {
          id: id,
          name: name,
          role: role,
          projectName: sixthWord,  // passing the 6th word
        },
      });
    };
    

    return(
        <>
 <div id="navbar" className=" flex border-2 rounded shadow-lg w-full h-16 text-black "> 
    <div id="C_name" className=' flex items-center h-full  ml- text-2xl'>
       
     <img className='mr-2 ml-2' src="https://th.bing.com/th/id/OIP.IRxxFai8PM_rkeev7tx-sQHaHa?rs=1&pid=ImgDetMain" alt="" width="50px " /><h1>Cloud</h1></div>
     <div className="flex "><ul style={{color: '#7789b4'} } className='flex items-center  ml-12 text-lg'>
         <li className='mr-4'>Your Work</li>
         <li className='mr-4'>Projects</li>
         <li className='mr-4'>Dashboard</li>
        </ul></div>
        <div className=' flex items-center   justify-end ml-auto'>
        <UserProfile name={name} />
        </div>
      
 </div>
 <div id="main" className='h-full flex'>
    <div id="sidebar" style={{backgroundColor:'#C8E0FF'}}className=' rounded-md shadow-md h-screen border-2  w-[20%] '>
        <h1 style={{color: '#7789b4'}} className="font-bold text-3xl mt-10 text-center">Dashboard</h1>
        <div id="P_name" className='h-40 flex items-center justify-center'>
    <div  style={{backgroundColor:"#ffffff"}}className='w-64 h-20 rounded-md shadow-md flex items-center'><div className='ml-4'><img width="38px" src="https://cdn-icons-png.flaticon.com/512/9912/9912615.png"  alt="" /></div>
    <div className="ml-4"><p  style={{color:"#7085B5"}} className="bl text-md font-semibold">Project Alpha</p><p  style={{color:"#8F98AD"}} className="text-sm">Software Oriented</p></div>
    </div></div>
    <div className='h-auto'>
      <div className='w-56 flex items-center ml-20  hover:bg-gray-400 hover:rounded-md hover:p-2 hover:cursor'><img src={mark} width="35px" alt="" /><h1 style={{color:"#7085B5"}} className='ml-3 '>Roadmap</h1></div><br />
      <button className='w-56 flex items-center ml-20  hover:bg-gray-400 hover:rounded-md hover:p-2 hover:cursor' onClick={() => setShowModal(true)}><img src="https://images.icon-icons.com/1856/PNG/96/notifications-active_116751.png" width="35px" alt="" /><h1 style={{color:"#7085B5"}} className='ml-3 '>Notifications</h1></button><br />
      <button
      className='w-56 flex items-center ml-20 hover:bg-gray-400 hover:rounded-md hover:p-2 hover:cursor'
      onClick={handleProjectClick}
    >
      <img src={project} width="35px" alt="" />
      <h1 style={{ color: '#7085B5' }} className='ml-3'>Projects</h1>
    </button>
    </div>
    </div>
    <div id="Content" className='h-screen  w-[80%] flex'>
        {/* The box for containing the entire left */}
        <div className={'w-[40%]'}>
        <div className='text-gray-500 ml-2 mt-2 text-xl'>Project/name</div>
        <div className='mt-4'><p  style={{color:"#4066BC"}}className='text-5xl ml-4 font-bold'>Task Allocated</p></div>
        <div
  id="important_Tasks"
  style={{ backgroundColor: "#D8E9FF" }}
  className="h-[400px] w-[400px] rounded-md p-2 mt-4 ml-4 shadow-lg" // add padding here
>
  <div className="w-[338px] h-[80px] bg-white  rounded-lg mt-4 ml-6 shadow-md" >
    <p style={{color:"#4066BC"}}className="flex"><p className='ml-4 mt-2 font-bold'>Important</p></p>
    <p className='flex'>
    <p className='flex mt-3 ml-2 font-bold'><p className='text-green-600 mr-4'>1</p>Completed</p>
    <p className='flex mt-3 ml-2'>
    <p className='text-red-600 mr-1 font-bold'>1</p>Undone</p></p>
  </div>
</div>
</div>

{/* The sprint box */}

    <div className='w-[80%] border-2 border-green'>
       <div id="heading"><p style={{color:'#4066BC'}} className='text-3xl fonnt-bold mt-3 ml-3'>Sprints</p></div>
       <div id='sprint lister' className='mt-10 ml-5'>
        <div className='flex mb-4'><img src={checked} alt="" width="30px" className='mt-2'/><p className='ml-5 text-xl mt-2'style={{color:'515C75'}}>code-141</p><p className='ml-3 font-medium text-xl mt-2' >Task 1 to be allocated</p>
        <button className='border-2 border-green-500  ml-auto bg-green-700 font-bold text-md text-white p-1 rounded-md mr-4 '>Completed</button>
        </div><hr />
       </div>
       </div>
    </div>
    
 </div>

  {/* Modal */}
  {showModal && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-3/4 max-h-[80vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">Your Notifications</h2>
            {notifications.map((note) => (
              <div key={note.id} className="border-b py-2">
                <p className="mb-2">{note.message}</p>
                <button
                  onClick={() => markAsRead(note.id)}
                  className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-700"
                >
                  Confirm
                </button>
              </div>
            ))}
            <button
              onClick={() => setShowModal(false)}
              className="mt-4 bg-gray-300 px-4 py-2 rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}
 </>
    )
}

export default Emp_view
