import { useState } from 'react'
import './App.css'
import { db } from '../db'
import Swal from 'sweetalert2'
import { useLiveQuery } from 'dexie-react-hooks'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { IonIcon } from '@ionic/react'
import { add, calendar, checkmarkOutline, closeCircle } from "ionicons/icons"
import Modal from './Modal'
import EditDateCmp from './EditDateCmp'

function getTimeAgo(inputdate) {
  const currentDate = new Date();
  const inputDate = new Date(inputdate);
  const timeDifference = currentDate - inputDate;

  const seconds = Math.floor(timeDifference / 1000);
  const minutes = Math.floor(seconds / 60);
  const h = Math.floor(minutes / 60);
  const d = Math.floor(h / 24);
  const w = Math.floor(d / 7);
  const m = Math.floor(d / 30); // Approximate value
  const y = Math.floor(d / 365); // Approximate value

  if (y > 0) {
    return y + (y === 1 ? "y ago" : "y ago");
  } else if (m > 0) {
    const remainingDays = d - m * 30;
    if (remainingDays > 0) {
      return m + (m === 1 ? "m" : "m") +
        ", " + remainingDays + (remainingDays === 1 ? "d ago" : "d ago");
    } else {
      return m + (m === 1 ? "m ago" : "m ago");
    }
  } else if (w > 0) {
    const remainingDays = d - w * 7;
    if (remainingDays > 0) {
      return w + (w === 1 ? "w" : "w") +
        ", " + remainingDays + (remainingDays === 1 ? "d ago" : "d ago");
    } else {
      return w + (w === 1 ? "w ago" : "w ago");
    }
  } else if (d > 0) {
    return d + (d === 1 ? "d ago" : "d ago");

  } else if (h > 0) {
    const remainingMinutes = minutes - h * 60;
    if (remainingMinutes > 0) {
      return h + (h === 1 ? "h" : "h") +
        ", " + remainingMinutes + (remainingMinutes === 1 ? "m ago" : "m ago");
    } else {
      return h + (h === 1 ? "h ago" : "h ago");
    }
  } else if (minutes > 0) {
    return minutes + (minutes === 1 ? " minute ago" : " minutes ago");
  } else {
    return "Just now";
  }
}

function toDate(d) {
  let date = new Date(d)
  return (date.getDay() < 10 ? "0" + date.getDay() : date.getDay()) + "/" + (date.getMonth() < 10 ? "0" + date.getMonth() : date.getMonth()) + "/" + date.getFullYear() + " " + (date.getHours() < 10 ? "0" + date.getHours() : date.getHours()) + ":" + (date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes())
}

function App() {
  const [editModalShow, setEditModalShow] = useState(false);
  const [toEdit, setToEdit] = useState({})
  const [name, setName] = useState("")

  const habitsData = useLiveQuery(
    () => db.actions.orderBy("date").toArray()
  );

  const addItem = (e) => {
    e.preventDefault()
    if (name)
      db.actions.add({
        name,
        date: new Date()
      }).then(() => {
        toast.success('Habit created successfully', {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        setName("")
      })
  }

  function deleteHabit(habit) {
    db.actions.delete(habit.id).then(() => {
      toast.success('Habit deleted successfully', {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    })
  }

  function didHabit(e, habit) {
    const newDate = e.target.value ? new Date(e.target.value) : new Date()

    db.actions.update(habit.id, { date: newDate }).then(function (updated) {
      if (updated)
        toast.success('Habit updated', {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      else
        Swal.fire("Error", "there was an error", "error")
    });

  }

  return (
    <>
      <div className="flex flex-col h-screen py-10 gap-8">
        <nav className='shadow-xl h-[40px] flex items-center font-bold text-xl fixed top-0 w-full px-8 bg-white'>LasTime</nav>
        <div className='p-2 flex-col flex gap-4 h-[calc(100vh-40px)]'>
          <form className="p-4 flex justify-center items-center rounded" onSubmit={addItem}>
            <div className="focus-within:ring ring-black rounded-full transition duration-200 flex">
              <input type="text" className="outline-none border rounded-l-full p-2 " onChange={(e) => setName(e.target.value)} value={name} />
              <button className="bg-black py-2 px-4 text-white flex justify-center items-center rounded-r-full border border-black" type="submit"> <IonIcon icon={add} className="font-bold" /> </button>
            </div>
          </form>
          <div className="p-2 w-full max-w-4xl mx-auto flex flex-col gap-4 flex-grow overflow-auto">
            {habitsData?.length > 0 ?
              habitsData?.map(habit =>
                <div key={habit.id} className="relative shadow-lg grid grid-cols-12 gap-4 p-4 justify-items-center items-center">
                  <button className="text-2xl text-red-500 absolute right-[-5px] top-[-5px]" onClick={() => deleteHabit(habit)}><IonIcon icon={closeCircle} className="" /></button>
                  <div className="col-span-4 justify-self-start font-bold break-all">{habit.name}</div>
                  <div className="col-span-5 text-gray-500 flex gap-2 items-center"><div className="flex flex-col items-center"><div>{getTimeAgo(habit.date)}</div><div className="text-sm hidden sm:block">{toDate(habit.date)}</div> </div></div>
                  <div className="col-span-3 justify-self-end flex flex-col sm:flex-row gap-2">
                    <button className="bg-black py-2 px-4 rounded-full text-white flex items-center" onClick={() => { setToEdit(habit); setEditModalShow(true) }}><IonIcon icon={calendar} /></button>
                    <button className="bg-black py-2 px-4 rounded-full text-white flex items-center" type='button' onClick={(e) => didHabit(e, habit)} ><IonIcon icon={checkmarkOutline} /> </button>
                  </div>
                </div>)
              :
              <div className="text-2xl p-8 text-center font-bold flex justify-center items-center">
                you have no habits, create one now !
              </div>
            }

          </div>
        </div>
      </div>
      <ToastContainer />
      <Modal
        show={editModalShow}
        hide={() => {
          setEditModalShow(false);
        }}
        dialogClassName="w-full sm:max-w-2xl h-fit my-auto pb-5 rounded-xl"
      >
        <EditDateCmp habit={toEdit} close={setEditModalShow} />
      </Modal>
    </>
  )
}

export default App
