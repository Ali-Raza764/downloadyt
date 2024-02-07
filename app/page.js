import Image from "next/image";
import Search from "./components/Search";
import { FaGithub, FaBook, FaYoutube } from "react-icons/fa";

export default function Home() {
  return (
    <main className="min-h-screen w-full">
      <header className="p-4 flex justify-between items-center text-white ">
        <div className="flex items-center">
          <FaYoutube className="mr-2" size={30} />
          <h1 className="text-2xl font-bold font-sans hidden sm:block">
            YouTube Downloader
          </h1>
        </div>

        <div className="flex items-center">
          <a
            href="https://github.com/example"
            className="mr-4 flex items-center"
          >
            <FaGithub className="mr-1" size={30} />
            GitHub
          </a>
          <a
            href="https://github.com/example"
            className="mr-4 flex items-center"
          >
            <FaBook className="mr-1" size={30} />
            Documentation
          </a>
        </div>
      </header>
      <section className="h-full w-full p-3 md:p-7 flex items-center justify-center flex-col">
        {/* <div className="hero w-full flex items-center justify-center">
          <Image src={"/logo.png"} height={300} width={500} alt="Logo" />
        </div> */}
        <Search />
      </section>
    </main>
  );
}
