"use client";
import { useSession, signIn, signOut } from "next-auth/react";

export default function Component() {
  const { data: session } = useSession();
  if (session) {
    return (
      <>
        Signed in as {session.user.email} <br />
        <button onClick={() => signOut()}>Sign out</button>
      </>
    );
  }
  return (
    <div className="flex w-screen h-screen flex-col items-center justify-center">
      Not signed in <br />
      <button className="text-red-500 p-4 bg-red-800" onClick={() => signIn()}>
        Sign in
      </button>
    </div>
  );
}
