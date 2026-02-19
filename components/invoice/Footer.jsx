export default function Footer({ notes }) {
  return (
    <div className="mt-8 text-center text-sm text-gray-500">
      {notes || "Thank you for your business!"}
    </div>
  );
}
