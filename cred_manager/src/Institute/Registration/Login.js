import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';

export default function Login() {
    const navigate = useNavigate();
    const [InstituteName, setInstituteName] = useState("");
    const [Password, setPassword] = useState("");
    const [Visibility, setVisibility] = useState(false);
    const [Message, setMessage] = useState("");

    const handleRegister = () => {
        navigate("/register");
    };

    const submit = async (e) => {
        e.preventDefault();
        const sendData = {
            institution_name: InstituteName,
            password: Password,
        };

        try {
            const response = await axios.post('http://localhost:3001/institutions/login', sendData);
            const token = response.data.token;
            const institutionId = response.data.institution.id;

            localStorage.setItem('authToken', token);
            localStorage.setItem('login', "Institute");
            localStorage.setItem('id', institutionId);
            setMessage('Login successful. Welcome ' + response.data.institution.name);
            navigate('/institution_home');
        } catch (error) {
            setMessage('Error logging in. ' + (error.response?.data?.message || 'Unknown error'));
            console.error('Error logging in:', error);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center w-full">
            <form
                onSubmit={submit}
                className='bg-darkbg border border-white rounded-xl flex flex-col justify-center items-center text-white py-8 px-16'>
                <h1 className="cursor-default text-3xl my-3 px-6 font-bold">Institute Log-In</h1>
                {Message && <p className="text-red-500">{Message}</p>}
                <div className="m-2 w-full border-b-2 border-gray-500">
                    <label htmlFor="name">Institute Name : </label>
                    <input onChange={(e) => setInstituteName(e.target.value)} type="text"
                        value={InstituteName} placeholder="Institute" autoComplete="on" className="bg-darkbg outline-none text mx-2" />
                </div>

                <div className="w-full flex flex-row justify-between m-2 border-b-2 border-gray-500">
                    <div>
                        <i className="ri-key-fill text-xl m-1"></i>
                        <input onChange={(e) => setPassword(e.target.value)}
                            value={Password}
                            placeholder="Password" type={Visibility ? 'text' : 'password'} autoComplete="off" className="bg-darkbg outline-none text mx-2" />
                    </div>
                    <div>
                        <i onClick={() => setVisibility(!Visibility)} className={(Visibility ? "ri-eye-fill" : "ri-eye-off-fill") + " m-1 text-xl"}></i>
                    </div>
                </div>

                <button type="submit" className="text-white rounded-lg mx-6 py-3 px-5 cursor-pointer shadow-2xl hover:shadow-none border-lightbg hover:border-gray-100 bg-lightbg transition-all duration-250 ease-in-out w-max">
                    Login
                </button>
                <button onClick={handleRegister} className="text-white rounded-lg mx-6 py-3 px-5 cursor-pointer shadow-2xl hover:shadow-none border-lightbg hover:border-gray-100 bg-lightbg transition-all duration-250 ease-in-out w-max">
                    Register
                </button>
            </form>
        </div>
    );
}