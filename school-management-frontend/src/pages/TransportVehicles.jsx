import React, { useState } from 'react';
import { Bus, Plus, Search, Filter, Shield, Activity, Calendar, MoreVertical, Settings } from 'lucide-react';

const TransportVehicles = () => {
  const [vehicles, setVehicles] = useState([
    { id: 1, reg: 'ABC-1234', model: 'Mercedes-Benz Sprinter', capacity: 20, lastService: '2026-04-15', fitnessExp: '2027-04-15', status: 'Optimal' },
    { id: 2, reg: 'XYZ-5678', model: 'Volvo 9400 B11R', capacity: 55, lastService: '2026-03-20', fitnessExp: '2027-03-20', status: 'Optimal' },
    { id: 3, reg: 'LMN-9012', model: 'Toyota Coaster', capacity: 25, lastService: '2025-12-10', fitnessExp: '2026-06-10', status: 'Due Soon' },
  ]);

  return (
    <div style={{ padding: '20px' }}>
      <h1 className="page-title">Institutional Vehicle Fleet</h1>
      <div className="card">
         <table style={{ width: '100%' }}>
            <thead>
               <tr>
                  <th>Vehicle</th>
                  <th>Capacity</th>
                  <th>Status</th>
               </tr>
            </thead>
            <tbody>
               {vehicles.map(v => (
                 <tr key={v.id}>
                    <td>{v.reg} ({v.model})</td>
                    <td>{v.capacity} Seats</td>
                    <td>{v.status}</td>
                 </tr>
               ))}
            </tbody>
         </table>
      </div>
    </div>
  );
};

export default TransportVehicles;
