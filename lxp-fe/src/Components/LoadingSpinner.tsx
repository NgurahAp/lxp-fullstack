interface LoadingSpinnerProps {
  text?: string;
  size?: "sm" | "md" | "lg";
  containerClassName?: string;
}

const LoadingSpinner = ({
  text = "Memuat data...",
  size = "md",
  containerClassName = "min-h-[85vh] w-screen",
}: LoadingSpinnerProps) => {
  const spinnerSizes = {
    sm: "h-6 w-6",
    md: "h-8 w-8",
    lg: "h-10 w-10",
  };

  return (
    <div className={`${containerClassName} flex items-center justify-center`}>
      <div className="flex items-center gap-3">
        <div
          className={`animate-spin rounded-full ${spinnerSizes[size]} border-b-2 border-blue-500`}
        ></div>
        {text && <p className="font-semibold">{text}</p>}
      </div>
    </div>
  );
};

export default LoadingSpinner;
