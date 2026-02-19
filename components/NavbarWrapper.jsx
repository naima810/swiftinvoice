'use client';
import Navbar from "@/components/Navbar";

export default function NavbarWrapper() {
  const user = { email: "test@example.com", plan: "free" };
  const logout = () => console.log("logout");

  return <Navbar user={user} logout={logout} />;
}
