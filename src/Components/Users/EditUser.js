import Sidebar from "../Sidebar";
import { message } from 'antd';
import React, { useEffect, useState } from 'react';
import axios from "axios";
import { useParams } from "react-router-dom";

const EditUser = () => {
    const { _id } = useParams();
    const initialstate = {
        firstName: "",
        firstNameError: "",
        lastName: "",
        lastNameError: "",
        username: "",
        usernameError: "",
        email: '',
        emailError: '',
        phone: '',
        phoneError: '',
        date: "",
        dateError: "",
        state: '',
        stateError: '',
        image: '',
        packageStatus: '',
        packageId: '',
        country: '',
        countryError: '',
        password: '',
        passwordError: '',
        role: '',
        roleError: ''
    }

    const [selectedFile, setSelectedFile] = useState()
    const [preview, setPreview] = useState()
    const [DetailData, setDetailData] = useState(initialstate);
    // eslint-disable-next-line
    const { firstName, firstNameError, lastName, lastNameError, username, usernameError, email, emailError,
        image, date, dateError, phoneError, state, stateError, country, countryError, password, passwordError, role, roleError, packageId, packageStatus, phone } = DetailData;

    const onHandleChange = (event) => {
        const { name, value } = event.target;
        setDetailData({
            ...DetailData,
            [name]: value
        })
    }
    const SubmitUser = () => {
        if (validate()) {
            var axios = require('axios');
            var FormData = require('form-data');
            var data = new FormData();
            data.append('firstName', firstName);
            data.append('lastName', lastName);
            data.append('email', email);
            data.append('password', password);
            data.append('username', role);
            data.append('phone', "phone");
            data.append('packageID', packageId);
            data.append('packageStatus', packageStatus);
            data.append('country', country);
            data.append('state', state);
            data.append('dob', date);
            data.append('image', selectedFile === undefined ? image : selectedFile);

            var config = {
                method: 'put',
                url: `users/${_id}`,
                data: data
            };

            axios(config)
                .then(function (response) {
                    if (response) {
                        message.success('User Updated Successfully')
                        window.location = "/user/edit/" + _id
                    }
                })
                .catch(function (error) {
                    console.log(error);
                });
        }

    }

    // create a preview as a side effect, whenever selected file is changed
    useEffect(() => {
        if (!selectedFile) {
            setPreview(undefined)
            return
        }

        const objectUrl = URL.createObjectURL(selectedFile)
        setPreview(objectUrl)

        // free memory when ever this component is unmounted
        return () => URL.revokeObjectURL(objectUrl)
    }, [selectedFile])

    const onSelectFile = e => {
        if (!e.target.files || e.target.files.length === 0) {
            setSelectedFile(undefined)
            return
        }

        // I've kept this example simple by using the first image instead of multiple
        setSelectedFile(e.target.files[0])
    }
    useEffect(() => {
        fetchData();
        // eslint-disable-next-line
    }, []);

    const fetchData = async (value, keyword) => {
        try {
            const res = await Promise.all([
                axios.get(`users/profile/${_id}`),
            ]);
            setDetailData({
                ...DetailData,
                firstName: res[0].data.user.firstName,
                lastName: res[0].data.user.lastName,
                username: res[0].data.user.username,
                email: res[0].data.user.email,
                state: res[0].data.user.state,
                country: res[0].data.user.country,
                role: res[0].data.user.role,
                image: res[0].data.user.image,
                packageId: res[0].data.user.packageID,
                packageStatus: res[0].data.user.packageStatus,
                phone: res[0].data.user.phone,
                load: true
            })
        } catch {
            setDetailData({
                ...DetailData,
                errorMessage: "Something went wrong"
            })
        }
    };

    function validate() {
        let firstNameError = "";
        let lastNameError = "";
        let usernameError = "";
        let emailError = "";
        let dateError = "";
        let countryError = "";
        let stateError = "";
        let passwordError = "";
        let phoneError = "";
        let roleError = "";
        if (!firstName) {
            firstNameError = "First Name is required";
        }
        if (!lastName) {
            lastNameError = "Last Name is required";
        }
        if (!username) {
            usernameError = "Username is required";
        }
        // if (!date) {
        //     dateError = "DOB is required";
        // }
        if (!country) {
            countryError = "Country is required";
        }
        if (!state) {
            stateError = "State is required";
        }
        if (!phone) {
            phoneError = "Phone No is required";
        }
        if (!role) {
            roleError = "Role is required";
        }
        // eslint-disable-next-line
        const reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if (!email || reg.test(email) === false) {
            emailError = "Invalid Email";
        }
        // if (!password) {
        //     passwordError = "Password is required";
        // }
        if (emailError || firstNameError || lastNameError || usernameError || emailError || countryError || stateError || phoneError || roleError) {
            setDetailData({
                ...DetailData,
                firstNameError, lastNameError, usernameError, emailError, dateError, countryError, stateError, passwordError,
                phoneError, roleError
            })
            return false;
        }
        else {
            setDetailData({
                ...DetailData,
                firstName: "",
                lastName: "",
                username: "",
                email: "",
                date: "",
                country: "",
                state: "",
                password: "",
                phone: "",
                role: ""
            })
        }
        return true;
    }
    return (
        <>
            <Sidebar />
            <div className='content pt-5'>
                <h6>Edit User</h6>
                <div className='displayFlex mt-4'>
                    <div className='displayFlex ml-2'>
                        {/* <UploadFile /> */}
                        <div>
                            {selectedFile === undefined ?
                                <img src={image} alt='imagee' className='avatar mx-3' /> :
                                <img src={preview} alt='' className='avatar mx-3' />}
                            <label htmlFor="files" className="btn" style={{ backgroundColor: '#F2F8FF', border: '1px solid #0F74AF', color: 'black' }}>Upload Photo</label>
                            <input type='file' id="files" onChange={onSelectFile} style={{ color: 'white', visibility: 'hidden' }} />
                        </div>

                    </div>
                </div>
                <div className=' mt-4'>
                    <div className='row col-12 ml-2'>
                        <div>
                            <div className='row col-lg-8 col-12'>
                                <input placeholder="First Name" name="firstName" value={firstName} onChange={onHandleChange} className="col-md-5 col-12 mx-auto fillColor px-md-5 my-1 px-1 py-2" />

                                <input placeholder="Last Name" name="lastName" value={lastName} onChange={onHandleChange} className="col-md-5 col-12 mx-auto fillColor px-md-5 px-1 my-1 py-2" />

                                {/* </div> */}
                                {/* <div className='row '> */}
                                <span className="text-danger col-md-5 col-12 mt-2 mx-auto px-md-5 px-1 py-1">{firstNameError}</span>
                                <span className="text-danger col-md-5 col-12 mt-2 mx-auto px-md-5 px-1 py-1">{lastNameError}</span>
                                {/* </div> */}
                                {/* <div className='row'> */}
                                <input placeholder="Username" name="username" value={username} onChange={onHandleChange} className="col-md-5 col-12 mt-2 mx-auto fillColor px-md-5 px-1 py-2 my-1" />
                                <input placeholder="Email" name="email" value={email} onChange={onHandleChange} className="col-md-5 col-12 mt-2 mx-auto fillColor px-md-5 px-1 py-2 my-1" />
                                {/* </div> */}

                                {/* <div className='row '> */}
                                <span className="text-danger col-md-5 col-12 mt-2 mx-auto px-md-5 px-1 py-2 my-1">{usernameError}</span>
                                <span className="text-danger col-md-5 col-12 mt-2 mx-auto px-md-5 px-1 py-2 my-1">{emailError}</span>
                                {/* </div> */}
                                {/* <div className='row'> */}
                                <input type="date" onChange={onHandleChange} name="date" value={date} className="col-md-5 col-12 mt-2 mx-auto fillColor px-md-5 px-1 py-2 my-1" />
                                <input placeholder="State" name="state" value={state} onChange={onHandleChange} className="col-md-5 col-12 mt-2 mx-auto fillColor px-md-5 px-1 py-2 my-1" />
                                {/* </div> */}
                                {/* <div className='row '> */}
                                <span className="text-danger col-md-5 col-12 mt-2 mx-auto px-md-5 px-1 py-2 my-1">{dateError}</span>
                                <span className="text-danger col-md-5 col-12 mt-2 mx-auto px-md-5 px-1 py-2 my-1">{stateError}</span>
                                {/* </div> */}
                                {/* <div className='row'> */}
                                <input placeholder="Country" name="country" value={country} onChange={onHandleChange} className="col-md-5 col-12 mt-2 mx-auto fillColor px-md-5 px-1 py-2 my-1" />
                                <input type='password' name="password" value={password} onChange={onHandleChange} placeholder="Password" className="col-md-5 col-12 mt-2 mx-auto fillColor px-md-5 px-1 py-2 my-1" />
                                {/* </div> */}

                                {/* <div className='row '> */}
                                <span className="text-danger col-md-5 col-12 mt-2 mx-auto px-md-5 px-1 py-2 my-1">{countryError}</span>
                                <span className="text-danger col-md-5 col-12 mt-2 mx-auto px-md-5 px-1 py-2 my-1">{passwordError}</span>
                                {/* </div> */}
                                {/* <div className="row"> */}
                                <input placeholder="Phone" name="phone" type="number" value={phone} onChange={onHandleChange} className="col-md-5 col-12 mt-2 mx-auto fillColor px-md-5 px-1 py-2 my-1" />
                                <select onChange={onHandleChange} name="role" className="col-md-5 col-12 mt-2 fillColor px-md-5 mx-auto px-1 py-2 my-1">
                                    <option value={role ? role : ""} className='blue'>{role ? role : "Role"}</option>
                                    <option value="user" className='blue'>User</option>
                                    <option value="editor" className='blue'>Editor</option>
                                    <option value="admin" className='blue'>Admin</option>
                                </select>
                                {/* </div> */}

                                {/* <div className='row '> */}
                                <span className="text-danger col-md-5 col-12 mt-2 mx-auto px-md-5 px-1 py-2 my-1">{phoneError}</span>
                                <span className="text-danger col-md-5 col-12 mt-2 mx-auto px-md-5 px-1 py-2 my-1">{roleError}</span>

                                <button onClick={SubmitUser} className="btn float-right Radius8 White py-2 my-1 px-3 mt-2">
                                    Submit
                                </button >
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
export default EditUser;