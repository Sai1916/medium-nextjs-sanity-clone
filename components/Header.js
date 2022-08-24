/* eslint-disable @next/next/no-img-element */
import Link from "next/link"

function Header() {
  return (
    <header className="flex items-center justify-between px-24 py-2 max-w-7xl mx-auto border-b-2">
        <div>
            <Link href='/'>
                <img className="h-10 w-40 cursor-pointer" src="https://miro.medium.com/max/8978/1*s986xIGqhfsN8U--09_AdA.png" alt="logo" />
            </Link>
        </div>
        <div className="bg-green-400 px-3 py-1 cursor-pointer rounded-2xl hover:bg-black hover:text-white ease-in-out duration-300">
            <button className="text-lg font-bold font-sans">SignIn</button>
        </div>
    </header>
  )
}

export default Header