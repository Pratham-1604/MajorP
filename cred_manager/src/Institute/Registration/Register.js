import React, { useState } from 'react'
import {
    Link, useNavigate
} from "react-router-dom";
import axios from 'axios';
// import bcrypt from "bcryptjs";
// import jwt from "jsonwebtoken";

export default function Register() {
    const navigate = useNavigate();
    const [Institutedata, setInstitutedata] = useState([{
        institution_name: "",
        address: "",
    }]);

    // Credentials
    const [InstituteName, setInstituteName] = useState("");
    const [Address, setAddress] = useState("");
    const [Password, setPassword] = useState("");
    const [RePassword, setRePassword] = useState("");
    const [Visibility, setVisibility] = useState(false);
    const [ReVisibility, setReVisibility] = useState(false);
    

    const submit = (e) => {
        e.preventDefault();
        if (Password !== RePassword) {
            alert('Passwords do not match!');
            return;
          }
        const sendData = {
            institution_name: InstituteName,
            address: Address,
            password: Password,
        }
        

        // Send POST request to the backend
        axios.post('http://localhost:3000/institutions', sendData)
            .then((response) => {
                console.log('Institute added:', response.data);
                setInstitutedata([...Institutedata, response.data]);
                setInstituteName('');
                setAddress('');
                setPassword('');
                setRePassword('');
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
            className='bg-darkbg border border-white absolute rounded-xl flex flex-col justify-center items-center text-white py-8 px-16 top-[150px] left-[470px] z-20 h-96'>
                <h1 className="cursor-default text-3xl my-3 px-6 font-bold">Register</h1>
                <div className="m-2 w-full border-b-2 border-gray-500">
                    <label htmlFor="name">Institute Name : </label>
                    <input onChange={(e) => setInstituteName(e.target.value)} type="text"
                        value={InstituteName} placeholder="Institute" autoComplete="on" className="bg-darkbg outline-none text mx-2" />
                </div>

                <div className="w-full m-2 border-b-2 border-gray-500">
                    <label htmlFor="address">Address : </label>
                    <input onChange={(e) => setAddress(e.target.value)} placeholder="address"
                        value={Address} type='text' autoComplete="on" className="bg-darkbg outline-none text mx-2" />
                </div>

                <div className="w-full flex flex-row justify-between m-2 border-b-2 border-gray-500">
                    <div>
                        <i class="ri-key-fill text-xl m-1"></i>
                        <input onChange={(e) => setPassword(e.target.value)}
                        value={Password}
                        placeholder="Password" type={Visibility ? 'text':'password'} autoComplete="off" className="bg-darkbg outline-none text mx-2" />
                    </div>
                    <div>
                        <i onClick={() => setVisibility(!Visibility)} class={ (Visibility ? "ri-eye-fill" : "ri-eye-off-fill") + " m-1 text-xl"}></i>
                    </div>
                </div>

                <div className="w-full flex flex-row justify-between m-2 border-b-2 border-gray-500">
                    <div>
                        <i class="ri-key-fill text-xl m-1"></i>
                        <input onChange={(e) => setRePassword(e.target.value)}
                        value={RePassword}
                        placeholder="Password" type={ReVisibility ? 'text':'password'} autoComplete="off" className="bg-darkbg outline-none text mx-2" />
                    </div>
                    <div>
                        <i onClick={() => setReVisibility(!ReVisibility)} class={ (ReVisibility ? "ri-eye-fill" : "ri-eye-off-fill") + " m-1 text-xl"}></i>
                    </div>
                </div>

                <button type="submit" className="text-white rounded-lg mx-6 py-3 px-5 cursor-pointer border border-darkbg hover:border hover:border-white hover:bg-lightbg transition-all duration-250 ease-in-out w-max">
                    Register
                </button>
            </form>

            <Link to="/" className="cursor-default fixed top-0 left-0 h-screen w-screen bg-[rgba(0,0,0,0.66)] z-10">
            </Link>
        </div>
    )
}
