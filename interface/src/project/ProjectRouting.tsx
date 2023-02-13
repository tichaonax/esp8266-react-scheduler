import { FC } from 'react';
import { Navigate, Routes, Route } from 'react-router-dom';

//import DemoProject from './DemoProject';
import Schedule from './automation/Schedule';
import Status from './automation/Status';

const ProjectRouting: FC = () => {
  return (
    <Routes>
      {
        // Add the default route for your project below
      }
      <Route path="/*" element={<Navigate to="status" />} />
      {
        // Add your project page routes below.
      }
{/*       <Route path="demo/*" element={<DemoProject />} /> */}
      <Route path="a/*" element={<Schedule />} />
      <Route path="status/*" element={<Status />} />
    </Routes>
  );
};

export default ProjectRouting;
