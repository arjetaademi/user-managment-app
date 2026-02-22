import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";

export default function UserDetailsPage() {
  const { id } = useParams();
  const user = useSelector((s) => s.users.items.find((u) => String(u.id) === String(id)));

  if (!user) {
    return <div className="emptyState">Select a user to view details</div>;
  }

  const address = user.address
    ? `${user.address.street || ""} ${user.address.suite || ""}, ${user.address.city || ""} ${user.address.zipcode || ""}`.trim()
    : "—";

  return (
    <div>
      <div className="detailsTitle">{user.name}</div>

      <div className="detailsCard">
        <div className="detailsRow">
          <span className="detailsLabel">Phone:</span>
          <span>{user.phone || "—"}</span>
        </div>
        <div className="detailsRow">
          <span className="detailsLabel">Website:</span>
          <span>{user.website || "—"}</span>
        </div>
        <div className="detailsRow">
          <span className="detailsLabel">Address:</span>
          <span>{address || "—"}</span>
        </div>
      </div>
    </div>
  );
}