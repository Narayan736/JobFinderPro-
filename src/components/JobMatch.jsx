import React, { useState } from 'react';
import API from '../api/api';

function JobMatch(){
    const [resumeID,setResumeID] = useState('');
    const[jobId, setJobId] = useState('');
    const[result, setResult]= useState(null);


    const handleMatch = async() => {
        const res = await API.post('resume/match/',{resume_id: resumeID, job_id: jobId});
        setResult(res.data);
    };

    return (
        <div className="p-4">
            <h2 className="font-bold "> Match Resume with Job</h2>
            <input type = "number " placeholder = "Resume ID" value={resumeID} onChange={(e) => setResumeID(e.target.value)} 
            className="border px-2 py-1 mr-2"/>
            <input type = "number" placeholder = "Job ID" value={jobId} onChange={(e) => setJobId(e.target.value)} 
            className="border px-2 py-1 mr-2"/>
            <button className="bg-green-600 text-white px-4 py-2" onclick={handleMatch}>check Match</button>

            {result && (
                <div className = "mt-4">
                    <p><strong>Score:</strong>{result.score}%</p>
                    <p><strong>Matched Keywords:</strong>{result.matched_keywords.join(', ')}</p>
                    <p><strong>Missing keywords</strong>{result.missing_keywords.join(', ')}</p>
        </div>
    )}
        </div>
    );
}

export default JobMatch;