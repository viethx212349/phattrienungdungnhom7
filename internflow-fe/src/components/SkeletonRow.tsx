const SkeletonRow = () => {
  return (
    <tr className="border-b">
      {Array.from({ length: 5 }).map((_, index) => (
        <td key={index} className="px-6 py-6">
          <div className="h-6 w-full animate-pulse rounded bg-gray-200" />
        </td> // dữ liệu
      ))}
    </tr> // một hàng
  );
};

export default SkeletonRow;