interface PpButtonProps {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  className?: string;
}

const PpButton = ({
  label,
  onClick,
  disabled = false,
  className,
}: PpButtonProps) => {
  return (
    <button
      className={`bg-blue-600 py-2 px-4 rounded-xl hover:bg-blue-400 cursor-pointer ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {label}
    </button>
  );
};

export default PpButton;
