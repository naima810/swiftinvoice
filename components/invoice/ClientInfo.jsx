export default function ClientInfo({ client }) {
  return (
    <div>
      <h2 className="font-semibold text-lg">Bill To:</h2>
      <p>{client.name}</p>
      <p>{client.address}</p>
      <p>{client.email}</p>
    </div>
  );
}
