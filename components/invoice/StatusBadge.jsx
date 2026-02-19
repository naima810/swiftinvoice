export default function StatusBadge({ status }) {
  let color =
    status === "Paid" ? "bg-green-500" :
    status === "Pending" ? "bg-yellow-500" :
    "bg-red-500";

  return (
    <span className={`${color} text-white px-3 py-1 rounded-full`}>
      {status}
    </span>
  );
}
