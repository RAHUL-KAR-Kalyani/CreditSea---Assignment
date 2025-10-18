import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api';

export default function UploadPage() {
    const [file, setFile] = useState(null);
    const [msg, setMsg] = useState('');
    const [loading, setLoading] = useState(false);
    const nav = useNavigate();

    async function handleSubmit(e) {
        e.preventDefault();
        if (!file) return setMsg('Select an XML file');
        setLoading(true);
        setMsg('');
        try {
            const res = await API.upload(file);
            setMsg('Uploaded — Report ID: ' + res.id);
            nav(`/reports/${res.id}`);
        } catch (err) {
            setMsg(err.error || JSON.stringify(err));
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="card">
            <h2>Upload Experian XML</h2>
            <form onSubmit={handleSubmit} className="form">
                <input type="file" accept=".xml" onChange={e => setFile(e.target.files[0])} />
                <button disabled={loading} className="btn">{loading ? 'Uploading...' : 'Upload'}</button>
            </form>
            {msg && <div className="note">{msg}</div>}
        </div>
    );
}
