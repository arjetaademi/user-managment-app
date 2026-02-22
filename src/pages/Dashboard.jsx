import { Outlet } from "react-router-dom";
import UsersPanel from "../components/UsersPanel";
import AddUserPanel from "../components/AddUserPanel";

export default function Dashboard() {
  return (
    <div className="layout">
      <aside className="panel">
        <UsersPanel />
      </aside>

      <main className="panel">
        <Outlet />
      </main>

      <aside className="panel">
        <AddUserPanel />
      </aside>
    </div>
  );
}