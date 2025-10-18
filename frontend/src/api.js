const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8000/api';

async function upload(file) {
    const fd = new FormData();
    fd.append('file', file);
    const res = await fetch(`${API_BASE}/upload`, { method: 'POST', body: fd });
    if (!res.ok) {
        const err = await res.json().catch(() => ({ error: 'Upload failed' }));
        throw err;
    }
    return res.json();
}

async function listReports(page = 0, limit = 20) {
    const res = await fetch(`${API_BASE}/reports?page=${page}&limit=${limit}`);
    if (!res.ok) throw new Error('Failed to fetch reports');
    return res.json();
}

async function getReport(id) {
    const res = await fetch(`${API_BASE}/reports/${id}`);
    if (!res.ok) throw new Error('Failed to fetch report');
    return res.json();
}

export default { upload, listReports, getReport };
