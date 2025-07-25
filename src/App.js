import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import JobList from './components/JobList';
import ResumeUpload from './components/ResumeUpload';
import JobMatch from './components/JobMatch';
import JobPostForm from './components/JobPostForm';
import ResumeList from './components/ResumeList';
import ResumeMatchAllJobs from './components/ResumeMatchAllJobs';
import MatchOnlineJobs from './components/MatchOnlineJobs';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import AdminPanel from './components/AdminPanel';
import UserPanel from './components/UserPanel';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<JobList />} />
        <Route path="/upload" element={<ResumeUpload />} />
        <Route path="/match" element={<JobMatch />} />
        <Route path="/post-job" element={<JobPostForm />} />
        <Route path="/resumes" element={<ResumeList />} />
        <Route path="/match-resume" element={<ResumeMatchAllJobs />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/match-online-jobs" element={<MatchOnlineJobs />} />
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="/user" element={<UserPanel />} />

      </Routes>
    </Router>
  );
}
export default App;