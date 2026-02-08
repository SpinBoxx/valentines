import { QueryClientProvider } from "@tanstack/react-query";
import { createRouter, RouterProvider } from "@tanstack/react-router";
import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import "./styles.css";
import { Toaster } from "sonner";


import type { FileRouteTypes } from "./routeTree.gen";
// Import the generated route tree
import { routeTree } from "./routeTree.gen";
import { createQueryClient } from "./lib/query-client";

// Create a new router instance
const router = createRouter({
	routeTree,
	context: {
		user: null,
		auth: {
			getUser: () => null,
			loadSession: async () => null,
		},
	},
	defaultPreloadStaleTime: 0,
});

// Register the router instance for type safety
declare module "@tanstack/react-router" {
	interface Register {
		router: typeof router;
	}
}
export type AppRoutes = FileRouteTypes["to"];
// Render the app
const rootElement = document.getElementById("root");
if (!rootElement) {
	throw new Error('Missing root element with id="root"');
}

if (!rootElement.innerHTML) {
	const root = ReactDOM.createRoot(rootElement);
	const queryClient = createQueryClient();
	root.render(
		<StrictMode>
			<QueryClientProvider client={queryClient}>
					<RouterProvider router={router} />
				<Toaster />
			</QueryClientProvider>
		</StrictMode>,
	);
}
