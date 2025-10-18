import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import UploadPage from './pages/UploadPage';
import ReportsList from './pages/ReportsList';
import ReportView from './pages/ReportView';

export default function App() {
	return (
		<div>
			<header className="header">
				<div className="container">
					<Link to="/"><h1>SoftPull Reports</h1></Link>
					<nav>
						<Link to="/upload">Upload XML</Link>
						<Link to="/">Reports</Link>
					</nav>
				</div>
			</header>
			<main className="container">
				<Routes>
					<Route path="/" element={<ReportsList />} />
					<Route path="/upload" element={<UploadPage />} />
					<Route path="/reports/:id" element={<ReportView />} />
				</Routes>
			</main>
			<footer className="container footer">Experian SoftPull Demo</footer>
		</div>
	);
}
