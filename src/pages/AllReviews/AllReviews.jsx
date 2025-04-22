import React, { useState, useEffect, useContext } from 'react';
import SectionTitle from '../../components/SectionTitle/SectionTitle';
import { AuthContext } from '../../context/AuthContext';
import { FaEdit, FaPlus } from 'react-icons/fa';
import styles from './AllReviews.module.css';

const API_BASE = 'http://localhost:8000/TripMeUpApp';

export default function AllReviews() {
    const { user } = useContext(AuthContext);

    const [reviews, setReviews] = useState([]);
    const [places, setPlaces] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const [modalOpen, setModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [form, setForm] = useState({
        id: null,
        place: '',
        placeName: '',
        rating: 5,
        comment: ''
    });
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        async function load() {
            setLoading(true);
            try {
                const [rRes, pRes] = await Promise.all([
                    fetch(`${API_BASE}/reviews/`),
                    fetch(`${API_BASE}/places/`)
                ]);
                if (!rRes.ok) throw new Error('Could not load reviews');
                if (!pRes.ok) throw new Error('Could not load places');
                const [rData, pData] = await Promise.all([rRes.json(), pRes.json()]);
                setReviews(rData);
                setPlaces(pData);
            } catch (err) {
                console.error(err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }
        load();
    }, []);

    const openAdd = () => {
        setForm({ id: null, place: '', placeName: '', rating: 5, comment: '' });
        setIsEditing(false);
        setModalOpen(true);
    };

    const openEdit = r => {
        if (r.user !== user.user_id && r.user?.user_id !== user.user_id) return;
        setForm({
            id: r.review_id,
            place: r.place.place_id,
            placeName: r.place.name,
            rating: r.rating,
            comment: r.comment
        });
        setIsEditing(true);
        setModalOpen(true);
    };

    const onChange = (field, val) =>
        setForm(f => ({ ...f, [field]: val }));

    const handleSubmit = async e => {
        e.preventDefault();
        if (!user) { setError('Login required'); return; }
        if (!form.comment.trim()) { setError('Comment cannot be blank'); return; }
        setSubmitting(true);
        try {
            const url = isEditing
                ? `${API_BASE}/reviews/${form.id}/`
                : `${API_BASE}/reviews/`;
            const method = isEditing ? 'PATCH' : 'POST';
            const body = isEditing
                ? { rating: form.rating, comment: form.comment }
                : {
                    rating: form.rating,
                    comment: form.comment,
                    user: user.user_id,
                    place: parseInt(form.place, 10)
                };
            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });
            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.detail || 'Failed');
            }
            const updated = await res.json();
            setReviews(rs => {
                if (isEditing) {
                    return rs.map(r => r.review_id === updated.review_id ? updated : r);
                } else {
                    const placeObj = places.find(p => p.place_id === updated.place) || {};
                    return [{ ...updated, place: placeObj }, ...rs];
                }
            });
            setModalOpen(false);
            setError('');
        } catch (err) {
            console.error(err);
            setError(err.message);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className={styles.page}>
            <SectionTitle title="All Reviews" subtitle="Feedback on every place" />
            {user && (
                <button className={styles.addBtn} onClick={openAdd}>
                    <FaPlus /> Add Review
                </button>
            )}

            {!loading && !error && reviews.length > 0 && (
                <div className={styles.grid}>
                    {reviews.map(r => (
                        <div key={r.review_id} className={styles.card}>
                            <div className={styles.cardContent}>
                                <div className={styles.header}>
                                    <h3 className={styles.placeName}>{r.place?.name}</h3>
                                    <span className={styles.tag}>
                                        {r.place?.accommodation ? 'Accommodation' : 'Restaurant'}
                                    </span>
                                </div>
                                <div className={styles.rating}>
                                    {'★'.repeat(r.rating).padEnd(5, '☆')}
                                </div>
                                <p className={styles.comment}>{r.comment}</p>
                                <div className={styles.userInfo}>
                                    <span className={styles.userName}>
                                        {r.user_name ||
                                            (typeof r.user === 'object' && r.user !== null
                                                ? r.user.username || r.user.email || `User #${r.user.user_id}`
                                                : `User #${r.user || 'Unknown'}`)}
                                    </span>
                                    {user && (r.user === user.user_id || r.user?.user_id === user.user_id) && (
                                        <button className={styles.editBtn} onClick={() => openEdit(r)}>
                                            <FaEdit /> Edit
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {modalOpen && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modal}>
                        <h3>
                            {isEditing
                                ? `Edit Review for "${form.placeName}"`
                                : 'Add New Review'}
                        </h3>
                        <form onSubmit={handleSubmit} className={styles.form}>
                            {!isEditing && (
                                <div className={styles.formGroup}>
                                    <label>Place</label>
                                    <select
                                        value={form.place}
                                        onChange={e => onChange('place', e.target.value)}
                                        required
                                    >
                                        <option value="">— Select place —</option>
                                        {places.map(p => (
                                            <option key={p.place_id} value={p.place_id}>
                                                {p.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            )}
                            {isEditing && (
                                <div className={styles.formGroup}>
                                    <label>Place</label>
                                    <div className={styles.staticField}>
                                        {form.placeName}
                                    </div>
                                </div>
                            )}
                            <div className={styles.formGroup}>
                                <label>Rating</label>
                                <select
                                    value={form.rating}
                                    onChange={e => onChange('rating', +e.target.value)}
                                >
                                    {[5, 4, 3, 2, 1].map(n => (
                                        <option key={n} value={n}>{n} ★</option>
                                    ))}
                                </select>
                            </div>
                            <div className={styles.formGroup}>
                                <label>Comment</label>
                                <textarea
                                    rows="4"
                                    value={form.comment}
                                    onChange={e => onChange('comment', e.target.value)}
                                    required
                                />
                            </div>
                            {error && <p className={styles.error}>{error}</p>}
                            <div className={styles.modalActions}>
                                <button
                                    type="button"
                                    className={styles.outline}
                                    onClick={() => setModalOpen(false)}
                                    disabled={submitting}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className={styles.primary}
                                    disabled={submitting}
                                >
                                    {submitting
                                        ? (isEditing ? 'Saving…' : 'Submitting…')
                                        : (isEditing ? 'Save Changes' : 'Submit Review')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
