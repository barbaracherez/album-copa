interface BadgeProps {
  children: React.ReactNode;
  variant?: "normal" | "rare" | "gold" | "green" | "blue" | "red";
}

const variants = {
  normal: "bg-gray-100 text-gray-700",
  rare: "bg-purple-100 text-purple-700",
  gold: "bg-yellow-100 text-yellow-800",
  green: "bg-green-100 text-green-800",
  blue: "bg-blue-100 text-blue-700",
  red: "bg-red-100 text-red-700",
};

export default function Badge({ children, variant = "normal" }: BadgeProps) {
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${variants[variant]}`}>
      {children}
    </span>
  );
}
