import "../styles/globals.css";
import LayoutWrapper from "../component/LayoutWrapper";

export const metadata = {
  title: "Your App Title",
  description: "App description goes here",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <LayoutWrapper>{children}</LayoutWrapper>
      </body>
    </html>
  );
}
