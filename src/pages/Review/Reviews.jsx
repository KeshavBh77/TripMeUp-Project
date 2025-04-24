import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import SectionTitle from '../../components/SectionTitle/SectionTitle';
import { AuthContext } from '../../context/AuthContext';
import styles from './Reviews.module.css';

const API_BASE = 'http://localhost:8000/TripMeUpApp/reviews/';

export default function Reviews() {
    const { user } = useContext(AuthContext);
    const { placeId } = useParams();
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!placeId) return;
        setLoading(true);
        setError('');

        fetch(`${API_BASE}?place=${placeId}`)
            .then((res) => {
                if (!res.ok) throw new Error(`Server returned ${res.status}`);
                return res.json();
            })
            .then((data) => {
                const reviewsWithUsernames = data.map((review) => ({
                    ...review,
                    username: review.user?.username || 'Anonymous',
                    placeId: review.place?.place_id || review.place,
                }));
                setReviews(reviewsWithUsernames);
            })
            .catch((err) => {
                console.error(err);
                setError('Could not load reviews for this place.');
            })
            .finally(() => setLoading(false));
    }, [placeId]);

    return (
        <div className={styles.page}>
            <SectionTitle
                title={`Reviews`}
                subtitle="What people are saying"
            />

            {loading && <p>Loading reviews…</p>}
            {!loading && error && <p className={styles.error}>{error}</p>}
            {!loading && !error && reviews.length === 0 && (
                <p>No reviews yet for this place.</p>
            )}

            {!loading && !error && reviews.length > 0 && (
                <ul className={styles.list}>
                    {reviews
                        .filter((review) => review.placeId === parseInt(placeId))
                        .map((r) => (
                            <li key={r.review_id} className={styles.reviewCard}>
                                <div className={styles.header}>
                                    <strong className={styles.author}>
                                        {r.username || 'Anonymous'}
                                    </strong>
                                    <span className={styles.rating}>
                                        ★ {r.rating ? r.rating.toFixed(1) : 'N/A'}
                                    </span>
                                </div>
                                <p className={styles.comment}>{r.comment}</p>
                                <div className={styles.date}>
                                    {new Date(r.created_at || r.date).toLocaleDateString()}
                                </div>
                            </li>
                        ))}
                </ul>
            )}

            {user ? (
                <AddReviewForm
                    placeId={placeId}
                    onNewReview={(rev) =>
                        setReviews([
                            {
                                ...rev,
                                username: user.username,
                                placeId: parseInt(placeId, 10),
                            },
                            ...reviews,
                        ])
                    }
                />
            ) : (
                <p className={styles.loginPrompt}>
                    <em>You must be logged in to leave a review.</em>
                </p>
            )}
        </div>
    );
}

function AddReviewForm({ placeId, onNewReview }) {
    const { user } = useContext(AuthContext);
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!comment.trim()) return;
        setSubmitting(true);
        setError('');
        try {
            const res = await fetch(API_BASE, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    rating,
                    comment,
                    user_id: user.user_id,      
                    place_id: parseInt(placeId), 
                }),

            });
            if (!res.ok) {
                const errJson = await res.json();
                throw new Error(errJson.detail || 'Failed to submit review');
            }
            const newRev = await res.json();
            onNewReview(newRev);
            setComment('');
            setRating(5);
        } catch (err) {
            console.error(err);
            setError(err.message);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <form className={styles.form} onSubmit={handleSubmit}>
            <h3>Leave Your Review</h3>
            {error && <p className={styles.error}>{error}</p>}
            <div className={styles.formGroup}>
                <label htmlFor="rating">Rating</label>
                <select
                    id="rating"
                    value={rating}
                    onChange={(e) => setRating(parseInt(e.target.value, 10))}
                >
                    {[5, 4, 3, 2, 1].map((n) => (
                        <option key={n} value={n}>
                            {n} ★
                        </option>
                    ))}
                </select>
            </div>
            <div className={styles.formGroup}>
                <label htmlFor="comment">Comment</label>
                <textarea
                    id="comment"
                    rows="3"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Tell us what you thought…"
                    required
                />
            </div>
            <button
                type="submit"
                className={styles.submitBtn}
                disabled={submitting || !comment.trim()}
            >
                {submitting ? 'Submitting…' : 'Submit Review'}
            </button>
        </form>
    );
}
