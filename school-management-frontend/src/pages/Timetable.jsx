import React, { useState } from 'react';
import { Clock, Calendar, User, Book } from 'lucide-react';

const Timetable = () => {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const times = ['08:00 AM', '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '01:00 PM', '02:00 PM'];

  const schedule = [
    { day: 'Monday', time: '08:00 AM', subject: 'Mathematics', teacher: 'Amit Sharma', room: 'Room 101' },
    { day: 'Monday', time: '09:00 AM', subject: 'Physics', teacher: 'Sunita Sharma', room: 'Lab A' },
    { day: 'Tuesday', time: '08:00 AM', subject: 'Chemistry', teacher: 'Rajesh Verma', room: 'Lab B' },
    { day: 'Wednesday', time: '10:00 AM', subject: 'English', teacher: 'Priya Sharma', room: 'Room 202' },
  ];

  return (
    <div>
      <h1 className="page-title">Class Timetable</h1>

      <div className="card" style={{ padding: '0', overflow: 'auto' }}>
        <table className="table" style={{ borderCollapse: 'separate', borderSpacing: '0' }}>
          <thead>
            <tr>
              <th style={{ backgroundColor: 'var(--bg-body)', position: 'sticky', left: 0, zIndex: 2 }}>Time / Day</th>
              {days.map(day => (
                <th key={day} style={{ textAlign: 'center' }}>{day}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {times.map(time => (
              <tr key={time}>
                <td style={{ fontWeight: 600, backgroundColor: 'var(--bg-body)', position: 'sticky', left: 0, zIndex: 1 }}>{time}</td>
                {days.map(day => {
                  const entry = schedule.find(s => s.day === day && s.time === time);
                  return (
                    <td key={`${day}-${time}`} style={{ minWidth: '150px', padding: '10px' }}>
                      {entry ? (
                        <div style={{ backgroundColor: 'var(--primary-light)', padding: '12px', borderRadius: '8px', borderLeft: '4px solid var(--primary)' }}>
                          <p style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--primary)' }}>{entry.subject}</p>
                          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                            <User size={10} /> {entry.teacher}
                          </p>
                          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                            <Clock size={10} /> {entry.room}
                          </p>
                        </div>
                      ) : (
                        <div style={{ minHeight: '60px', border: '1px dashed var(--border-color)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <span style={{ color: 'var(--border-color)', fontSize: '0.8rem' }}>+</span>
                        </div>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Timetable;
