import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { openDB } from 'idb';
import { DB_NAME, STORE_NAME } from './App'; // Assuming these constants are exported from App.js
import ViewFiles from './ViewFiles';
const ViewFiles = () => {
  const { token } = useParams();
  const [files, setFiles] = useState([]);

  useEffect(() => {
    const fetchFiles = async () => {
      const db = await openDB(DB_NAME, 1);
      const allFiles = await db.getAllFromIndex(STORE_NAME, 'by_token', token);
      setFiles(allFiles.map(fileEntry => fileEntry.file));
    };

    fetchFiles();
  }, [token]);

  return (
    <div>
      <h1>Uploaded Files</h1>
      {files.map((file, index) => (
        <div key={index}>
          <p>{file.name}</p>
          {/* Add more file details or a download link here */}
        </div>
      ))}
    </div>
  );
};

export default ViewFiles;
