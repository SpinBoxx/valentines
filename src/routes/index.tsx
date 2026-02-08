import Stepper from "@/components/Stepper";
import ValentineQuestion from "@/components/ValentineQuestion";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
	component: Index,
});

function Index() {
	const steps = [
		{
			title: "14 février 2026",
			content: "Joyeuse Saint-Valentin ❤️",
		},
		{
			title: "Pour toi",
			content: "Chaque seconde passée avec toi est un cadeau...",
		},
		{
			title: "Mon cœur",
			content: "Tu illumines mes journées et réchauffes mes nuits ✨",
		},
		{
			content: <ValentineQuestion />,
		},
	];

	return (
		<div className="floating-hearts relative flex items-center justify-center min-h-screen p-6">
			{/* Subtle glow behind content */}
			<div className="absolute inset-0 flex items-center justify-center pointer-events-none">
				<div className="w-125 h-125 rounded-full bg-rose-500/5 blur-3xl" />
			</div>

			<div className="relative z-10 w-full max-w-xl">
				<Stepper steps={steps} />
			</div>
		</div>
	);
}
