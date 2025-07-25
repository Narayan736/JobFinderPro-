import React, { useEffect, useState } from 'react';
import API from '../api/api';

function OnlineJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const res = await API.get('online-jobs/');
      setJobs(res.data.results || []);
    } catch (err) {
      console.error("Failed to fetch online jobs:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Latest Online Jobs (Adzuna)</h2>

      {loading ? (
        <p>Loading jobs...</p>
      ) : jobs.length === 0 ? (
        <p>No jobs found.</p>
      ) : (
        <div className="grid gap-4">
          {jobs.map((job, idx) => (
            <div key={idx} className="border p-4 rounded shadow">
              <h3 className="text-xl font-bold">{job.title}</h3>
              <p className="text-gray-600">{job.company} - {job.location}</p>
              <p className="mt-2">{job.description?.slice(0, 200)}...</p>
              <a
                href={job.redirect_url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-block text-blue-600 underline"
              >
                Apply Now
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default OnlineJobs;