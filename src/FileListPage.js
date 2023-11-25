// FileListPage.js
import React, { useState, useEffect } from 'react';
import { openDB } from 'idb';
import { Link } from 'react-router-dom';

const DB_NAME = 'fileUploadDB';
const STORE_NAME = 'files';

function FileListPage() {
  const [files, setFiles] = useState([]);

  useEffect(() => {
    const fetchFiles = async () => {
      const db = await openDB(DB_NAME, 1);
      const fileKeys = await db.getAllKeys(STORE_NAME);
      setFiles(fileKeys);
    };

    fetchFiles();
  }, []);

  const viewFile = async (fileKey) => {
    const db = await openDB(DB_NAME, 1);
    const file = await db.get(STORE_NAME, fileKey);
    const url = URL.createObjectURL(file);
    window.open(url, '_blank');
  };

  return (
    <div>
      <h1>Uploaded Files</h1>
      <ul>
        {files.map((fileKey) => (
          <li key={fileKey}>
            {fileKey} <button onClick={() => viewFile(fileKey)}>View</button>
          </li>
        ))}
      </ul>
      <Link to="/">Go Back</Link>
    </div>
  );
}

export default FileListPage;
