export const metadata = {
  title: "Your App Title",
  description: "App description goes here",
};

import "../styles/globals.css";
import Sidebar from "../component/sidebar";
import Header from "../component/Header";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <div className="flex min-h-screen flex-col">
          <div className="flex flex-1">
            <Sidebar />
            <main className="flex-1 overflow-auto">
  <Header />
  <div className="p-6">
    {children}
  </div>
</main>

          </div>
        </div>
      </body>
    </html>
  );
}
