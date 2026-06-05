import clsx from "clsx";

interface BadgeProps {
  label: string;
  variant?: "default" | "success";
}

const Badge = ({ label, variant = "default" }: BadgeProps) => {
  return (
    <span
      className={clsx(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold tracking-wide",
        {
          "bg-gray-200 text-gray-800": variant === "default",
          "bg-black text-white": variant === "success",
        }
      )}
    >
      {label}
    </span>
  );
};

export default Badge;