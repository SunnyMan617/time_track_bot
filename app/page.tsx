'use client';

import { FiClock, FiCalendar, FiSmile } from 'react-icons/fi';
import { FaNewspaper } from 'react-icons/fa';
import { MdOutlineAssignmentTurnedIn } from 'react-icons/md';

export default function Home() {
  return (
    <div
      className="min-h-screen flex items-center justify-center from-gray-700 via-gray-800 to-gray-900 text-white"
      
    >
      <div className="flex flex-col gap-30 px-4 bg-gray-800 min-h-160 rounded-2xl items-center justify-center" 
        style={{
          backgroundImage:
            "linear-gradient(rgba(24, 24, 27, 0.8), rgba(24, 24, 27, 0.8)), url('/bgimage.jpg')",
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
        }}
      >
        <div className="text-center">
          <h1
            className="text-3xl font-semibold mb-2 tracking-wide"
            style={{ fontFamily: 'cursive' }}
          >
            Team Work
          </h1>
          <div className="text-lg font-normal opacity-80">Visit everyone for management team</div>
        </div>
        <div className="bg-gray-800/10 rounded-3xl p-6 shadow-lg border justify-center align-middle border-gray-700 backdrop-blur-md">
          <div className="max-w-80 gap-6 flex flex-wrap justify-center">
            {/* News */}
            <div className="flex flex-col min-w-20 items-center bg-gray-700/40 rounded-2xl p-4">
              <FaNewspaper className="text-2xl mb-2" aria-label="news icon" />
              <span className="text-sm font-medium mt-1">News</span>
            </div>
            {/* Report Work Time */}
            <div className="flex flex-col min-w-20 items-center bg-gray-700/40 rounded-2xl p-4">
              <FiClock className="text-2xl mb-2" aria-label="report work time icon" />
              <span className="text-sm font-medium mt-1 text-center leading-tight">Report</span>
            </div>
            {/* Report Bid Count */}
            <div className="flex flex-col min-w-20 items-center bg-gray-700/40 rounded-2xl p-4">
              <MdOutlineAssignmentTurnedIn className="text-2xl mb-2" aria-label="report bid count icon" />
              <span className="text-sm font-medium mt-1 text-center leading-tight">Bid</span>
            </div>
            {/* Meeting */}
            <div className="flex flex-col min-w-20 items-center bg-gray-700/40 rounded-2xl p-4">
              <FiCalendar className="text-2xl mb-2" aria-label="meeting icon" />
              <span className="text-sm font-medium mt-1">Meeting</span>
            </div>
            {/* Memes */}
            <div className="flex flex-col min-w-20 items-center bg-gray-700/40 rounded-2xl p-4">
              <FiSmile className="text-2xl mb-2" aria-label="memes icon" />
              <span className="text-sm font-medium mt-1">Memes</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
