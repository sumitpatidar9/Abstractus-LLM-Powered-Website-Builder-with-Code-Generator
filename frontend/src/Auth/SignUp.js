// src/components/SignUp.jsx
import React, { useState } from 'react';
import styles from './SignUp.module.css';
import { signUpUser } from './HandleAPI';
import { useNavigate } from 'react-router-dom';

const SignUp = () => {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: ''
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await signUpUser(form.firstName, form.lastName, form.email, form.password);
    if (res?.user) {
      navigate('/chat'); // ✅ redirect on success
    }
  };

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <h2>Sign Up</h2>
        <input name="firstName" type="text" placeholder="First Name" value={form.firstName} onChange={handleChange} required />
        <input name="lastName" type="text" placeholder="Last Name" value={form.lastName} onChange={handleChange} required />
        <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} required />
        <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} required />
        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
};

export {SignUp};
