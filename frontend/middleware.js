import { NextResponse } from "next/server";

const publicRoutes = ["/login", "/register"];

const roleAccess = {
  ADMIN: ["*", "/home"], // akses semua route
  USER_LAPANGAN: [
    "/home",
    "/confirmation-order",
    "/material",
    "/permintaan-lapangan",
  ],
  USER_PURCHASE: [
    "/home",
    "/confirmation-order",
    "/material",
    "/permintaan-lapangan",
    "/kategori",
    "/vendor",
    "purchase-order",
  ],
};

/** @param {import('next/server').NextRequest} request */
export function middleware(request) {
  const url = request.nextUrl;
  const pathname = url.pathname;

  const token = request.cookies.get("refreshToken")?.value;
  const role = request.cookies.get("role")?.value;

  // Allow public routes
  if (
    publicRoutes.some(
      (route) => pathname === route || pathname.startsWith(route + "/")
    )
  ) {
    return NextResponse.next();
  }

  const isPublic = publicRoutes.includes(pathname);

  // Jika bukan halaman publik dan tidak ada token, redirect ke /login
  if (!isPublic && !token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Role tidak valid → redirect ke /home
  if ((!role || !roleAccess[role]) && token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const allowedRoutes = roleAccess[role];

  // Jika role boleh akses semua route
  if (allowedRoutes.includes("*")) {
    return NextResponse.next();
  }

  // Jika role tidak diizinkan akses ke route saat ini
  const isAllowed = allowedRoutes.some(
    (route) => pathname === route || pathname.startsWith(route + "/")
  );

  if (!isAllowed) {
    return NextResponse.redirect(new URL("/home", request.url)); // ganti "/" → "/home"
  }

  return NextResponse.next();
}

// Terapkan middleware ke semua route kecuali static/api
export const config = {
  matcher: ["/((?!_next|static|favicon.ico|api).*)"],
};
