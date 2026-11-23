import "./spin-loading.css";
interface SpinLoadingProps {
  color: string;
  width: number;
  height: number;
  position: string;
}
const SpinLoading = ({ color, width, height, position }: SpinLoadingProps) => {
  return (
    <>
      <div
        className={`flex w-[${width}px] h-[${height}px] justify-${position} items-center`}
      >
        <svg
          className="spinner-common"
          viewBox="0 0 50 50"
          stroke={color}
          width={width}
          height={height}
        >
          <circle
            className="path"
            cx="25"
            cy="25"
            r="20"
            fill="none"
            stroke-width="5"
          ></circle>
        </svg>
      </div>
    </>
  );
};

export default SpinLoading;
