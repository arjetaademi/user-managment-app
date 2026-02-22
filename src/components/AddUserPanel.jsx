import { useState } from "react";
import { useDispatch } from "react-redux";
import { addUser } from "../store/usersSlice";

export default function AddUserPanel() {
  const dispatch = useDispatch();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const [errName, setErrName] = useState("");
  const [errEmail, setErrEmail] = useState("");

  function isValidEmail(v) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
  }

  function handleSubmit(e) {
    e.preventDefault();

    setErrName("");
    setErrEmail("");

    let ok = true;

    if (!name.trim()) {
      setErrName("Name is required");
      ok = false;
    }
    if (!email.trim()) {
      setErrEmail("Email is required");
      ok = false;
    } else if (!isValidEmail(email)) {
      setErrEmail("Email is invalid");
      ok = false;
    }

    if (!ok) return;

    const newUser = {
      id: Date.now(), 
      name: name.trim(),
      email: email.trim(),
      company: { name: "Local User" },
      address: { street: "-", suite: "-", city: "-", zipcode: "-" },
      phone: "-",
      website: "-",
    };

    dispatch(addUser(newUser));

    setName("");
    setEmail("");
  }

  return (
    <div>
      <div className="panelTitle">Add New User</div>

      <form onSubmit={handleSubmit} className="stack">
        <div>
          <div className="label">Name</div>
          <input className="input" value={name} onChange={(e) => setName(e.target.value)} placeholder="Name..." />
          {errName && <div className="error">{errName}</div>}
        </div>

        <div>
          <div className="label">Email</div>
          <input className="input" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email..." />
          {errEmail && <div className="error">{errEmail}</div>}
        </div>

        <button className="btnPrimaryWide" type="submit">Add User</button>
      </form>
    </div>
  );
}