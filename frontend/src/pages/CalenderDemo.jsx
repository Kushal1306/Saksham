import { Calendar } from "@/components/ui/calendar"
import { Card,CardContent,CardDescription,CardFooter,CardHeader,CardTitle } from "@/components/ui/card";
import axios from 'axios';
import React, { useEffect, useState } from 'react'
const events = [
    { event_from: '11:30 AM', title: 'Purchase order 23', description: 'PO 23 ORDERED BY YOU IS ARRIVING' },
    { event_from: '6:30 PM', title: 'Purchase order 23', description: 'PO 23 ORDERED BY YOU IS ARRIVING' },
    { event_from: '8:30 PM', title: 'Purchase order 23', description: 'PO 23 ORDERED BY YOU IS ARRIVING' },
    { event_from: '11:30 PM', title: 'Purchase order 23', description: 'PO 23 ORDERED BY YOU IS ARRIVING' },
    { event_from: '11:30 AM', title: 'Purchase order 23', description: 'PO 23 ORDERED BY YOU IS ARRIVING' },
    { event_from: '6:30 PM', title: 'Purchase order 23', description: 'PO 23 ORDERED BY YOU IS ARRIVING' },
    { event_from: '8:30 PM', title: 'Purchase order 23', description: 'PO 23 ORDERED BY YOU IS ARRIVING' },
    { event_from: '11:30 PM', title: 'Purchase order 23', description: 'PO 23 ORDERED BY YOU IS ARRIVING' },
    { event_from: '8:30 PM', title: 'Purchase order 23', description: 'PO 23 ORDERED BY YOU IS ARRIVING' },
    { event_from: '11:30 PM', title: 'Purchase order 23', description: 'PO 23 ORDERED BY YOU IS ARRIVING' }
    
  ];

function CalenderDemo() {
    const [date, setDate] = useState(new Date());
    const [events,setEvents]=useState([]);
    // console.log(date);
    // const updated = new Date(date);
    // console.log("updated",updated);
    // const day = updated.getDate(); // 1-31
    // const month = updated.getMonth() + 1; // 0-11, so add 1
    // const year = updated.getFullYear(); // e.g. 2024
    // console.log(`${day}/${month}/${year}`);
    
    // const timestamp=date.getTime();
    // const updatedDate=new Date(timestamp);
    // console.log("updateDate:",updatedDate);
    const fetchEvents = async (user_id, clicked_date) => {
        try {
          const response = await axios.get(`http://localhost:3000/events/${user_id}`, {
            params: { clicked_date },
          });
          setEvents(response.data.events || []); // assuming `events` is returned in response data
        } catch (error) {
          console.log("Error occurred:", error.message);
        }
      };
    
      useEffect(() => {
        const updated = new Date(date);
        const clickedDate = `${updated.getDate()}/${updated.getMonth() + 1}/${updated.getFullYear()}`;
        console.log("clicked date is:",clickedDate);
        fetchEvents(1, clickedDate);
      }, [date]);
 return (
    <div className="flex flex-col  space-y-4 md:space-y-0 h-screen w-1/5 pt-2 pl-2">
  {/* Calendar Section */}
  <div className="">
    <Calendar
      mode="single"
      selected={date}
      onSelect={setDate}
      className="rounded-md border w-full"
    />
  </div>

  {/* Events Section */}
  <div className="overflow-y-scroll max-h-screen pt-4 pl-2 scrollbar-hide">
        {events.length > 0 ? (
          events.map((event, index) => (
            <div key={index} className="mb-2">
              <div className="flex flex-col">
                <div className="text-sm font-semibold pb-1">{event.event_from}</div>
                <div className="text-base font-bold pb-1">{event.title}</div>
                <div className="text-sm text-gray-600 pb-1">{event.description}</div>
              </div>
              {index < events.length - 1 && (
                <hr className="my-2 border-t border-gray-200" />
              )}
            </div>
          ))
        ) : (
          <div className="text-center text-gray-500 mt-4">No events</div>
        )}
      </div>
    </div>
  );
}

export default CalenderDemo;
