import React, { useState } from 'react';
import './deleteacc.css';
import { Sidebar } from '../Sidebar/sidebar.jsx';
import { useNavigate } from 'react-router-dom';
import { host, showError, showSuccess } from "../utils/toast.jsx";
import axios from 'axios';

export const DeleteAccount = () => {
	const [password, setPassword] = useState('');
	const [confirmText, setConfirmText] = useState('');
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');
	const [showConfirm, setShowConfirm] = useState(false);
	const navigate = useNavigate();

	const token = localStorage.getItem('token');

	const Deleteacc=async()=>{
		try{
			setLoading(true);
			const res=await axios.post(`${host}/delete-account`, { password }, { headers: { token: token } });
			showSuccess(res.data.message);
			localStorage.removeItem('token');
			navigate('/signin');
		} catch (err) {
			showError(err.response.data.message);
			setError(err.response.data.message);
		} finally {
			setLoading(false);
		}
	}
	const openConfirm = (e) => {
		e.preventDefault();
		setError('');
		if (!password) {
			setError('Please enter your password');
			return;
		}
		setShowConfirm(true);
	};

	const closeConfirm = () => {
		setShowConfirm(false);
		setConfirmText('');
	};

	const handleDelete = async () => {
		setError('');	
		if (confirmText.trim() !== 'DELETE') {
			setError('Type DELETE in the confirmation box to proceed');
			return;
		}
		if (!token) {
			setError('No auth token found. Please sign in again.');
			return;
		}
		try {
			setLoading(true);
			const res=await axios.post(`${host}/delete-account`, { password }, { headers: { token: token } });
			const data=res?.data;
			if (!res.ok) {
				throw new Error(res.data.message || 'Failed to delete account');
			}
			showSuccess(data?.message || 'Account deleted successfully');
			showSuccess(res.data.message);
			localStorage.removeItem('token');
			navigate('/signin');
		} catch (err) {
			showError(err?.message || 'Delete failed');
			setError(err?.message || 'Delete failed');
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="profile-page-wrapper">
			<div className="profile-dashboard-layout">
				<Sidebar />
				<main className="main-content">
					<header className="profile-header sticky">
						<div>
							<h1 className="header-title">Delete account</h1>
							<p className="header-subtitle">Permanently remove your account and all data</p>
						</div>
					</header>

					<section className="fresh-card delete-account-root" role="region" aria-label="delete account">
						<p style={{color:'#9aa3b2', marginTop:0}}>This action cannot be undone. Please enter your password to continue.</p>
						{error ? <div className="error" role="alert">{error}</div> : null}
						<form onSubmit={openConfirm}>
							<label htmlFor="password" style={{display:'block', fontWeight:700, marginBottom:6}}>Password</label>
							<input
								id="password"
								type="password"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								placeholder="Enter your password"
								style={{width:'100%', padding:'10px 12px', borderRadius:8, border:'1px solid #e5e7eb'}}
							/>
							<div style={{height:12}}></div>
							<button className="btn-danger" type="submit" disabled={loading}>{loading ? 'Processing...' : 'Delete my account'}</button>
						</form>
					</section>

					{showConfirm && (
						<div className="confirm-overlay" role="dialog" aria-modal="true">
							<div className="confirm-card">
								<button className="close-x" aria-label="Close" onClick={closeConfirm}>×</button>
								<h3>Confirm deletion</h3>
								<p>Type DELETE to confirm you want to permanently remove your account.</p>
								<input
									value={confirmText}
									onChange={(e) => setConfirmText(e.target.value)}
									placeholder="Type DELETE"
									style={{width:'100%', padding:'10px 12px', borderRadius:8, border:'1px solid #e5e7eb'}}
								/>
								<div className="confirm-actions">
									<button onClick={closeConfirm}>Cancel</button>
									<button className="btn-danger" onClick={handleDelete} disabled={loading}>{loading ? 'Deleting...' : 'Confirm delete'}</button>
								</div>
							</div>
						</div>
					)}
				</main>
			</div>
		</div>
	);
};

export default DeleteAccount;