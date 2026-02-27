'use client';
import Navbar from "@/components/Navbar";

export default function NavbarWrapper() {
  const logout = () => console.log("logout");

  return <Navbar logout={logout} />;
}
