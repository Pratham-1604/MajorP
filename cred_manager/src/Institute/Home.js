import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

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
                // const response = await axios.get(`http://localhost:3001/institutions/${institutionId}`);
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
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-4">Institution Details</h1>
            <div className="border p-4 mb-2 rounded">
                <p><strong>Name:</strong> {institution.institution_name}</p>
                <p><strong>Email:</strong> {institution.email}</p>
                {/* Add more fields as needed */}
            </div>
        </div>
    );
}