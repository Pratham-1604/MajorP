import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import CoursesList from './CoursesList'; // Import the CoursesList component

export default function HomePage() {
    const navigate = useNavigate();
    const [institution, setInstitution] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchInstitution = async () => {
            const token = localStorage.getItem('authToken');
            const institutionId = localStorage.getItem('institutionId');
            if (!token || !institutionId) {
                navigate('/login');
                return;
            }

            try {
                const response = await axios.get(`http://localhost:3001/institutions/${institutionId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setInstitution(response.data);
            } catch (err) {
                setError('Error fetching institution data: ' + (err.response?.data?.message || 'Unknown error'));
                console.error('Error fetching institution data:', err);
            }
        };

        fetchInstitution();
    }, [navigate]);

    if (error) {
        return <p className="text-red-500">{error}</p>;
    }

    if (!institution) {
        return <p>Loading...</p>;
    }

    return (
        <div>
        <div className="container mx-auto p-4">
            <CoursesList institutionId={institution._id} />
        </div>
        </div>
        
    );
}
