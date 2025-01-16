import Image from "next/image";

export default function Home() {
  return (
    <div className="flex items-center justify-center min-h-screen p-8 sm:p-20">
      <table className="table-auto border-collapse border border-gray-300 w-full text-sm sm:text-base">
        <thead>
          <tr>
            <th className="border border-gray-300 p-4">Section</th>
            <th className="border border-gray-300 p-4">Content</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border border-gray-300 p-4 font-bold">Logo</td>
            <td className="border border-gray-300 p-4">
              <Image
                className="dark:invert"
                src="/next.svg"
                alt="Next.js logo"
                width={180}
                height={38}
                priority
              />
            </td>
          </tr>
          <tr>
            <td className="border border-gray-300 p-4 font-bold">Instructions</td>
            <td className="border border-gray-300 p-4">
              <ol className="list-inside list-decimal">
                <li className="mb-2">
                  Get started by editing <code className="bg-black/[.05] dark:bg-white/[.06] px-1 py-0.5 rounded font-semibold">app/page.tsx</code>.
                </li>
                <li>Save and see your changes instantly.</li>
              </ol>
            </td>
          </tr>
          <tr>
            <td className="border border-gray-300 p-4 font-bold">Actions</td>
            <td className="border border-gray-300 p-4">
              <div className="flex flex-col gap-4 sm:flex-row">
                <a
                  className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
                  href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Image
                    className="dark:invert"
                    src="/vercel.svg"
                    alt="Vercel logomark"
                    width={20}
                    height={20}
                  />
                  Deploy now
                </a>
                <a
                  className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:min-w-44"
                  href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Read our docs
                </a>
              </div>
            </td>
          </tr>
          <tr>
            <td className="border border-gray-300 p-4 font-bold">Footer Links</td>
            <td className="border border-gray-300 p-4">
              <div className="flex gap-6 flex-wrap items-center justify-center">
                <a
                  className="flex items-center gap-2 hover:underline hover:underline-offset-4"
                  href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Image
                    aria-hidden
                    src="/file.svg"
                    alt="File icon"
                    width={16}
                    height={16}
                  />
                  Learn
                </a>
                <a
                  className="flex items-center gap-2 hover:underline hover:underline-offset-4"
                  href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Image
                    aria-hidden
                    src="/window.svg"
                    alt="Window icon"
                    width={16}
                    height={16}
                  />
                  Examples
                </a>
                <a
                  className="flex items-center gap-2 hover:underline hover:underline-offset-4"
                  href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Image
                    aria-hidden
                    src="/globe.svg"
                    alt="Globe icon"
                    width={16}
                    height={16}
                  />
                  Test &#8594;
                </a>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
