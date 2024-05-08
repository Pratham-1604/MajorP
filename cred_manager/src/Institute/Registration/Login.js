import React, { useState } from 'react'
import {
    Link, useNavigate
} from "react-router-dom";
import axios from 'axios';

export default function Login() {
    const navigate = useNavigate();
    const [Institutedata, setInstitutedata] = useState([{
        institution_name: "",
    }]);

    // Credentials
    const [InstituteName, setInstituteName] = useState("");
    const [Password, setPassword] = useState("");
    const [Visibility, setVisibility] = useState(false);

    const submit = (e) => {
        e.preventDefault();
        const sendData = {
            institution_name: InstituteName,
            password: Password,
        }

        // Send POST request to the backend
        // const handleLogIn = async () => {
        //     try {
        //         const response = await axios.post('http://localhost:3000/institutions/login', {}, {
        //             headers: {
        //                 Authorization: `Bearer ${response.data.token}`,  // Assuming token is passed from some other source
        //             },
        //         });
        //         setMessage('Login successful. Welcome ' + response.data.admin.email);
        //     } catch (error) {
        //         setMessage('Error logging in. ' + (error.response?.data?.message || 'Unknown error'));
        //     }
        // };

        axios.post('http://localhost:3000/institutions', sendData)
            .then((response) => {
                console.log('Institute added:', response.data);
                setInstitutedata([...Institutedata, response.data]);
                // Reset form after successful submission
                setInstituteName('');
                setPassword('');
            })
            .catch((error) => {
                console.error('Error adding institute:', error);
            });
        navigate('/');
    };

    return (
        <div>
            <form
                onSubmit={submit}
                className='bg-darkbg border border-white absolute rounded-xl flex flex-col justify-center items-center text-white py-8 px-16 top-[150px] left-[470px] z-20'>
                <h1 className="cursor-default text-3xl my-3 px-6 font-bold">Log-In</h1>
                <div className="m-2 w-full border-b-2 border-gray-500">
                    <label htmlFor="name">Institute Name : </label>
                    <input onChange={(e) => setInstituteName(e.target.value)} type="text"
                        value={InstituteName} placeholder="Institute" autoComplete="on" className="bg-darkbg outline-none text mx-2" />
                </div>

                <div className="w-full flex flex-row justify-between m-2 border-b-2 border-gray-500">
                    <div>
                        <i class="ri-key-fill text-xl m-1"></i>
                        <input onChange={(e) => setPassword(e.target.value)}
                            value={Password}
                            placeholder="Password" type={Visibility ? 'text' : 'password'} autoComplete="off" className="bg-darkbg outline-none text mx-2" />
                    </div>
                    <div>
                        <i onClick={() => setVisibility(!Visibility)} class={(Visibility ? "ri-eye-fill" : "ri-eye-off-fill") + " m-1 text-xl"}></i>
                    </div>
                </div>

                <button type="submit" className="text-white rounded-lg mx-6 py-3 px-5 cursor-pointer shadow-2xl hover:shadow-none border-lightbg hover:border-gray-100 bg-lightbg transition-all duration-250 ease-in-out w-max">
                    Login
                </button>
            </form>

            <Link to="/" className="cursor-default fixed top-0 left-0 h-screen w-screen bg-[rgba(0,0,0,0.66)] z-10">
            </Link>
        </div>
    )
}