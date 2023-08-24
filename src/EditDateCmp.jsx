/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState } from 'react'
import { db } from '../db';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';

export default function EditDateCmp({ habit, close }) {
    const [date, setDate] = useState(null)

    const didHabit = () => {
        const newDate = new Date(date)

        db.actions.update(habit.id, { date: newDate }).then(function (updated) {
            if (updated) {
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
                close(false)
            }
            else
                Swal.fire("Error", "there was an error", "error")
        });

    }
    return (
        <div className="">
            <div className="font-bold bg-gray-100 w-full p-4 flex items-center rounded-t-xl text-xl">
                Change Date
            </div>
            <form className="pb-5 p-10 flex flex-col items-center justify-center gap-4" onSubmit={didHabit}>
                <input type='date' placeholder="Change date" className="outline-none border py-2 px-4 rounded-full" onChange={(e) => setDate(e.target.value)} />
                <button type="submit" className="bg-black py-2 px-4 rounded-full text-white flex items-center font-bold">Save</button>
            </form>
        </div>
    )
}
