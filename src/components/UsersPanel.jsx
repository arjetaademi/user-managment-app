import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { deleteUser, fetchUsers, updateUser } from "../store/usersSlice";

export default function UsersPanel() {
  const dispatch = useDispatch();
  const { id: selectedId } = useParams();

  const users = useSelector((s) => s.users.items);
  const loading = useSelector((s) => s.users.loading);
  const error = useSelector((s) => s.users.error);
  const loadedOnce = useSelector((s) => s.users.loadedOnce);

  const [query, setQuery] = useState("");
  const [sortKey, setSortKey] = useState("name"); // name | email | company
  const [sortDir, setSortDir] = useState("asc"); // asc | desc

  // inline edit
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");

  useEffect(() => {
    if (!loadedOnce) dispatch(fetchUsers());
  }, [dispatch, loadedOnce]);

  const filteredAndSorted = useMemo(() => {
    const q = query.trim().toLowerCase();

    const filtered = users.filter((u) => {
      if (!q) return true;
      return (
        (u.name || "").toLowerCase().includes(q) ||
        (u.email || "").toLowerCase().includes(q)
      );
    });

    const getVal = (u) => {
      if (sortKey === "company") return (u.company?.name || "").toLowerCase();
      return (u[sortKey] || "").toLowerCase();
    };

    filtered.sort((a, b) => {
      const A = getVal(a);
      const B = getVal(b);
      if (A < B) return sortDir === "asc" ? -1 : 1;
      if (A > B) return sortDir === "asc" ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [users, query, sortKey, sortDir]);

  function startEdit(u) {
    setEditingId(u.id);
    setEditName(u.name || "");
    setEditEmail(u.email || "");
  }

  function cancelEdit() {
    setEditingId(null);
    setEditName("");
    setEditEmail("");
  }

  function isValidEmail(v) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
  }

  function saveEdit(id) {
    if (!editName.trim()) return alert("Name is required");
    if (!editEmail.trim()) return alert("Email is required");
    if (!isValidEmail(editEmail)) return alert("Email is invalid");

    dispatch(
      updateUser({
        id,
        changes: { name: editName.trim(), email: editEmail.trim() },
      })
    );
    cancelEdit();
  }

  function onDelete(id, name) {
    if (confirm(`Delete ${name}?`)) dispatch(deleteUser(id));
  }

  return (
    <div>
      <div className="topTitle">User Management</div>

      <input
        className="input"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search by name or email..."
      />

      <div className="row" style={{ marginTop: 10 }}>
        <select className="select" value={sortKey} onChange={(e) => setSortKey(e.target.value)}>
          <option value="name">Sort: Name</option>
          <option value="email">Sort: Email</option>
          <option value="company">Sort: Company</option>
        </select>

        <button className="btnPrimarySmall" onClick={() => setSortDir((d) => (d === "asc" ? "desc" : "asc"))}>
          {sortDir === "asc" ? "Asc ↑" : "Desc ↓"}
        </button>
      </div>

      {loading && <div className="stateText">Loading users...</div>}
      {error && <div className="error">{error}</div>}

      {!loading && !error && filteredAndSorted.length === 0 && (
        <div className="emptyCard">No users found.</div>
      )}

      <div className="stack" style={{ marginTop: 12 }}>
        {filteredAndSorted.map((u) => {
          const isEditing = editingId === u.id;
          const isSelected = String(u.id) === String(selectedId);

          return (
            <div key={u.id} className={`card ${isSelected ? "cardSelected" : ""}`}>
              {!isEditing ? (
                <>
                  <Link to={`/users/${u.id}`} className="cardLink">
                    <div className="name">{u.name}</div>
                    <div className="meta">{u.email}</div>
                    <div className="company">{u.company?.name || "—"}</div>
                  </Link>

                  <div className="row" style={{ marginTop: 10 }}>
                    <button className="btn" onClick={() => startEdit(u)}>Edit</button>
                    <button className="btnDanger" onClick={() => onDelete(u.id, u.name)}>Delete</button>
                  </div>
                </>
              ) : (
                <>
                  <div className="name" style={{ marginBottom: 8 }}>Edit User</div>
                  <input className="input" value={editName} onChange={(e) => setEditName(e.target.value)} />
                  <input className="input" value={editEmail} onChange={(e) => setEditEmail(e.target.value)} style={{ marginTop: 8 }} />

                  <div className="row" style={{ marginTop: 10 }}>
                    <button className="btnPrimary" type="button" onClick={() => saveEdit(u.id)}>Save</button>
                    <button className="btn" type="button" onClick={cancelEdit}>Cancel</button>
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}