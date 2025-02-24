export const EmptyState = ({
  message,
  width,
}: {
  message: string;
  width?: string;
}) => (
  <div className="flex flex-col items-center justify-center p-12 text-center">
    <img src="/dashboard/empty-state.png" className={width} alt="" />
    <p className="text-xl text-gray-500 font-semibold pt-5">{message}</p>
  </div>
);
