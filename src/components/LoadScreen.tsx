import { useLoadScreen } from "#/state/loadscreenState.ts";

import "@/styles/loadscreen.css";

const BG_COLOR = "#00000072";
const LINES = [1, 2, 3, 4, 5, 6];

function Line({ i }: { i: number }) {
  const name = `line-${i}`;
  return (
    <div
      className={name + " w-0 h-16 border-4 border-surface rounded-sm"}
      style={{ transition: "height 50ms ease" }}
    />
  );
}

export default function LoadScreen() {
  const { text, visible, opacity } = useLoadScreen();

  if (visible) {
    return (
      <div
        className="fixed column top-0 left-0 w-[100vw] h-[100vh] justify-center items-center z-[15]"
        style={{
          backdropFilter: "blur(8px)",
          background: BG_COLOR,
          opacity,
          zIndex: 99,
          transition: "opacity 300ms ease",
        }}>
        <div className="row justify-center items-end h-16 w-max gap-3">
          {LINES.map(i => (
            <Line key={`line-${i}`} i={i} />
          ))}
        </div>

        <p className="subtitle text-surface text-center">{text}</p>
      </div>
    );
  } else {
    return null;
  }
}
