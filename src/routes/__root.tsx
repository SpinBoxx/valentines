import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
import type { AuthUser } from "@/auth/providers/AuthProvider";

const RootLayout = () => (
	<>
		<Outlet />
		{/* <TanStackRouterDevtools /> */}
	</>
);

interface MyRouterContext {
	user: AuthUser | null;
	auth: {
		getUser: () => AuthUser | null;
		loadSession: () => Promise<AuthUser | null>;
	};
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
	component: RootLayout,
});
