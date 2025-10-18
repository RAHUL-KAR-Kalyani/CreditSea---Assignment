import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import API from '../api';

export default function ReportView() {
    const { id } = useParams();
    const [r, setR] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        API.getReport(id).then(d => setR(d)).catch(console.error).finally(() => setLoading(false));
    }, [id]);

    if (loading) return <p>Loading...</p>;
    if (!r) return <p>Not found</p>;

    return (
        <div>
            <div className="row">
                <h2>Report — {r.name || r.firstName}</h2>
                <Link to="/">← Back</Link>
            </div>

            <section className="card">
                <ul style={{ listStyleType: 'square'}}>
                    <li><h3>Basic Details</h3></li>
                </ul>
                <ul style={{ listStyleType: 'square', marginLeft: '20px' }}>
                    <li><b>Name:</b> {r.name}</li>
                    <li><b>Mobile:</b> {r.mobile}</li>
                    <li><b>PAN:</b> {r.pan}</li>
                    <li><b>DOB:</b> {r.dateOfBirth}</li>
                </ul>
            </section>

            <section className="card">
                <ul style={{ listStyleType: 'square'}}>
                    <li><h3>Summary</h3></li>
                </ul>
                <ul style={{ listStyleType: 'square', marginLeft: '20px' }}>
                    <li><b>Credit Score:</b> {r.score} {r.scoreConfidence && `(${r.scoreConfidence})`}</li>
                    <li><b>Total Accounts:</b> {r.totalAccounts}</li>
                    <li><b>Active:</b> {r.activeAccounts}</li>
                    <li><b>Closed:</b> {r.closedAccounts}</li>
                    <li><b>Outstanding:</b> ₹{r.totalOutstanding} (Secured: ₹{r.securedOutstanding}, Unsecured: ₹{r.unsecuredOutstanding})</li>
                    <li><b>Inquiries last 7d:</b> {r.inquiriesLast7Days}</li>
                </ul>
            </section>

            <section className="card">
                <ul style={{ listStyleType: 'square'}}>
                    <li><h3>Accounts ({r.accounts?.length || 0})</h3></li>
                </ul>
                <ul style={{ listStyleType: 'square', marginLeft: '20px' }}>
                    {r.accounts?.map((a, idx) => (
                        <li key={idx}>
                            <div className="account">
                                <div className="row">
                                    <div><b>{a.subscriberName || '-'}</b> — {a.accountNumber || '-'}</div>
                                    <div className="small">Status: {a.accountStatus || '-'}</div>
                                </div>
                                <div>Balance: ₹{a.currentBalance ?? 0} • Past due: ₹{a.amountPastDue ?? 0}</div>
                                <div>Open date: {a.openDate || '-'}</div>
                            </div>
                        </li>
                    ))}
                </ul>
            </section>
        </div>
    );
}
