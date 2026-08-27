import { cn } from "@/lib/utils";

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  size?: "default" | "sm" | "lg" | "full";
}

const sizeMap = {
  sm: "max-w-3xl",
  default: "max-w-6xl",
  lg: "max-w-7xl",
  full: "max-w-none",
} as const;

export function Container({
  children,
  className,
  size = "default",
}: ContainerProps) {
  return (
    <div className={cn("mx-auto w-full px-4 sm:px-6", sizeMap[size], className)}>
      {children}
    </div>
  );
}
