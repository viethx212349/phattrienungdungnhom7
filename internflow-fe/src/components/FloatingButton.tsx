import { Plus } from "lucide-react";

interface FloatingButtonProps {
  onClick: () => void;
}

const FloatingButton = ({
  onClick,
}: FloatingButtonProps) => {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-8 right-8 flex h-16 w-16 items-center justify-center rounded-2xl bg-black text-white shadow-xl transition hover:scale-105"
    >
      <Plus size={28} />
    </button>
  );
};

export default FloatingButton;