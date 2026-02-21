import logout from '@/actions/logout';

export default function LogoutButton() {
  return (
    <form action={logout}>
        <button
            type="submit"
            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm transition"
        >
            Logout
        </button>
    </form>
  );
}