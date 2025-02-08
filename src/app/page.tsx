import HomePage from "@/components/HomePage";
import { Metadata } from "next";
import { AuthProviderNormal } from "./contexts/AuthContextNormal";


export const metadata: Metadata = {
  title: 'LoopTalk - Find Your Community',
  description: 'Main page',
}

export default function Home() {
  return (
    <div>
      <AuthProviderNormal>
        <HomePage />
      </AuthProviderNormal>
    </div>
  );
}
