import React, { useEffect, useState } from 'react';
import { getFeedbacks } from '../services/api.js';
import Panel from '../components/Panel.jsx';

export default function Feedbacks() {
  const [feedbacks,setFeedbacks] = useState([]);
  const [loading,setLoading] = useState(true);
  const [error,setError] = useState('');
  const [status,setStatus] = useState('');

  const loadFeedbacks = async () => {
    setLoading(true);
    try{
      const res = await getFeedbacks(status);
      setFeedbacks(res.data.data || []);
      setError('');
    } catch(err){ setError('Lỗi tải Feedbacks'); }
    setLoading(false);
  }

  const handleReview = async (id,newStatus) => {
      const note = prompt('Ghi chú admin (tùy chọn):','');
      try{
        await reviewFeedback(id,newStatus,note);
        alert('Cập nhật thành công!');
        loadReports();
      }catch(err){ alert('Lỗi cập nhật'); }
    }

  useEffect(()=>{ loadFeedbacks(); }, [status]);

  return (
    <Panel>
      <div style={{display:'flex', justifyContent:'space-between', marginBottom:12}}>
        <h2>Danh sách Feedback</h2>
        <button className="btn" onClick={loadFeedbacks}>Làm mới</button>
      </div>
      <label>
        Lọc trạng thái: 
        <select value={status} onChange={e=>setStatus(e.target.value)}
                style={{marginLeft:8,padding:6,borderRadius:6,border:'1px solid #ccc'}}>
          <option value="">Tất cả</option>
          <option value="Pending">Chưa giải quyết</option>
          <option value="Processing">Chờ xử lý</option>
          <option value="Resolved">Đã duyệt</option>
          <option value="Rejected">Từ chối</option>
        </select>
      </label>
      {loading ? <p style={{color:'#6b7280'}}>Đang tải...</p> :
       error ? <p style={{color:'red'}}>{error}</p> :
       <div style={{overflowX:'auto', marginTop:12}}>
         <table>
           <thead>
             <tr>
               <th>ID</th><th>Title</th><th>Description</th><th>Status</th><th>User</th>
             </tr>
           </thead>
           <tbody>
             {feedbacks.map(f=>(
               <tr key={f.id}>
                 <td>{f.id}</td>
                 <td>{f.title}</td>
                 <td>{f.description}</td>
                 <td>{f.status}</td>
                 <td>{f.user?.FullName || '-'}</td>
                  <td>
                   {f.status==='Pending' && <>
                     <button className="btn" onClick={()=>handleReview(f.id,'Approved')}>✅ Duyệt</button>
                     <button className="btn" style={{background:'#ef4444'}} onClick={()=>handleReview(f.id,'Rejected')}>❌ Từ chối</button>
                   </>}
                 </td>
               </tr>
             ))}
           </tbody>
         </table>
       </div>
      }
    </Panel>
  );
}
