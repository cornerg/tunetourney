type Props = {
  min: number;
  max: number;
  limit: number;
  value: number;
}
export default function TotalScoreBar({ min, max, limit, value }: Props) {
  return (
    <div className="relative row w-full h-6 rounded-full bg-dark">
      <div
        className="row h-full justify-between items-center border-3 border-dark bg-secondary"
        style={{
          width: `${Math.round(((max - min) / limit) * 100)}%`,
          marginLeft: `${Math.round((min / limit) * 100)}%`,
        }}>
        <p className="w-8 font-bold text-center text-surface ml-[-32px]">
          {min}
        </p>
        <p className="w-8 font-bold text-center text-surface mr-[-32px]">
          {max}
        </p>
      </div>

      <div
        className="absolute h-full select-none mx-[3px]"
        style={{ width: "calc(100% - 6px)" }}>
        <div className="relative w-full h-full select-none">
          <div
            className="absolute column w-8 bottom-3"
            style={{
              left: `calc(${Math.round((value / limit) * 100)}% - 16px)`,
              transition: "left 150ms ease-out",
            }}>
            <div className="w-8 h-4 bg-primary rounded-t-lg">
              <p className="font-bold text-sm text-surface w-full text-center">
                {value}
              </p>
            </div>
            <div
              className="w-0 h-0 border-primary"
              style={{
                borderTopWidth: "16px",
                borderLeft: "16px solid transparent",
                borderRight: "16px solid transparent",
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
