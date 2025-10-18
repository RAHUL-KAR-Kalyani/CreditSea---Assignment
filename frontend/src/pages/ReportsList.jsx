import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../api';

export default function ReportsList() {
    const [list, setList] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        API.listReports().then(d => setList(d)).catch(console.error).finally(() => setLoading(false));
    }, []);

    return (
        <div>
            <h2>Reports</h2>
            {loading ? <p>Loading...</p> : (
                <div>
                    {list.length === 0 && <p>No reports yet. Upload one.</p>}
                    <ul className="reports">
                        {list.map(r => (
                            <li key={r._id} className="report-item">
                                <Link to={`/reports/${r._id}`}>
                                    <strong>{r.name || 'Unnamed'}</strong>
                                </Link>
                                <div>Score: {r.score ?? '-'} • Accounts: {r.totalAccounts ?? '-'}</div>
                                <div className="small">{new Date(r.createdAt).toLocaleString()}</div>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}
