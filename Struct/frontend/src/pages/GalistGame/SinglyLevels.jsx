/* eslint-disable react/prop-types */
import { useMemo, useState } from "react";

function LevelIllustration({ id }) {
  const common = "stroke-white/80";
  const fill = "fill-white/15";

  switch (id) {
    case 1: // Creating Node
      return (
        <svg viewBox="0 0 200 120" className="w-full h-28">
          <circle cx="100" cy="60" r="26" className={fill} />
          <circle
            cx="100"
            cy="60"
            r="26"
            className={`${common} fill-transparent`}
            strokeWidth="2"
          />
          <text
            x="100"
            y="66"
            textAnchor="middle"
            className="fill-white/80 text-[14px] font-semibold"
          >
            Node
          </text>
        </svg>
      );
    case 2: // Linking Nodes
      return (
        <svg viewBox="0 0 260 120" className="w-full h-28">
          <circle cx="80" cy="60" r="22" className={fill} />
          <circle cx="180" cy="60" r="22" className={fill} />
          <circle
            cx="80"
            cy="60"
            r="22"
            className={`${common} fill-transparent`}
            strokeWidth="2"
          />
          <circle
            cx="180"
            cy="60"
            r="22"
            className={`${common} fill-transparent`}
            strokeWidth="2"
          />
          <line
            x1="104"
            y1="60"
            x2="156"
            y2="60"
            className={common}
            strokeWidth="2"
            markerEnd="url(#arrow)"
          />
          <defs>
            <marker
              id="arrow"
              markerWidth="8"
              markerHeight="8"
              refX="8"
              refY="4"
              orient="auto"
            >
              <path d="M0,0 L0,8 L8,4 z" className="fill-white/80" />
            </marker>
          </defs>
        </svg>
      );
    case 3: // Insertion of Nodes
      return (
        <svg viewBox="0 0 300 120" className="w-full h-28">
          <circle cx="70" cy="60" r="20" className={fill} />
          <circle
            cx="70"
            cy="60"
            r="20"
            className={`${common} fill-transparent`}
            strokeWidth="2"
          />
          <circle cx="230" cy="60" r="20" className={fill} />
          <circle
            cx="230"
            cy="60"
            r="20"
            className={`${common} fill-transparent`}
            strokeWidth="2"
          />
          <line
            x1="90"
            y1="60"
            x2="140"
            y2="60"
            className={common}
            strokeWidth="2"
          />
          <line
            x1="160"
            y1="60"
            x2="210"
            y2="60"
            className={common}
            strokeWidth="2"
          />
          <g>
            <circle cx="150" cy="60" r="18" className="fill-emerald-500/30" />
            <circle
              cx="150"
              cy="60"
              r="18"
              className="stroke-emerald-300 fill-transparent"
              strokeWidth="2"
            />
            <line
              x1="150"
              y1="48"
              x2="150"
              y2="72"
              className="stroke-emerald-300"
              strokeWidth="2"
            />
            <line
              x1="138"
              y1="60"
              x2="162"
              y2="60"
              className="stroke-emerald-300"
              strokeWidth="2"
            />
          </g>
        </svg>
      );
    case 4: // Deletion of Node
      return (
        <svg viewBox="0 0 200 120" className="w-full h-28">
          <circle cx="100" cy="60" r="24" className={fill} />
          <circle
            cx="100"
            cy="60"
            r="24"
            className={`${common} fill-transparent`}
            strokeWidth="2"
          />
          <line
            x1="86"
            y1="46"
            x2="114"
            y2="74"
            className="stroke-rose-400"
            strokeWidth="3"
          />
          <line
            x1="114"
            y1="46"
            x2="86"
            y2="74"
            className="stroke-rose-400"
            strokeWidth="3"
          />
        </svg>
      );
    case 5: // Searching of Node
      return (
        <svg viewBox="0 0 240 120" className="w-full h-28">
          <circle cx="100" cy="58" r="20" className={fill} />
          <circle
            cx="100"
            cy="58"
            r="20"
            className={`${common} fill-transparent`}
            strokeWidth="2"
          />
          <g transform="translate(140,66)">
            <circle
              cx="0"
              cy="0"
              r="12"
              className="stroke-yellow-300 fill-transparent"
              strokeWidth="2"
            />
            <line
              x1="8"
              y1="8"
              x2="20"
              y2="20"
              className="stroke-yellow-300"
              strokeWidth="3"
            />
          </g>
        </svg>
      );
    default:
      return null;
  }
}

function SinglyLevels({ onSelect }) {
  const levels = useMemo(
    () => [
      { id: 1, title: "Level 1", subtitle: "Creating Node" },
      { id: 2, title: "Level 2", subtitle: "Linking Nodes" },
      { id: 3, title: "Level 3", subtitle: "Insertion of Nodes" },
      { id: 4, title: "Level 4", subtitle: "Deletion of Node" },
      { id: 5, title: "Level 5", subtitle: "Searching of Node" },
    ],
    []
  );

  const pageSize = 3;
  const [page, setPage] = useState(0);
  const totalPages = Math.ceil(levels.length / pageSize);
  const pageItems = levels.slice(page * pageSize, page * pageSize + pageSize);

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-black/60 text-white">
      <h2 className="text-3xl font-bold mb-6">Singly Linked List Levels</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full max-w-6xl px-6">
        {pageItems.map((lvl) => (
          <button
            key={lvl.id}
            onClick={() => onSelect?.(lvl.id)}
            className="group overflow-hidden rounded-2xl p-6 h-56 bg-gradient-to-br from-white/10 to-white/5 hover:from-white/20 hover:to-white/10 transition border border-white/10 shadow-xl text-left backdrop-blur-sm"
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="text-2xl font-semibold tracking-wide">
                  {lvl.title}
                </div>
                <div className="text-sm opacity-80 mt-1">{lvl.subtitle}</div>
              </div>
            </div>
            <div className="mt-4">
              <LevelIllustration id={lvl.id} />
            </div>
          </button>
        ))}
      </div>
      <div className="flex items-center gap-4 mt-8">
        <button
          onClick={() => setPage((p) => Math.max(0, p - 1))}
          disabled={page === 0}
          aria-label="Previous"
          className="p-3 rounded-full bg-white/10 hover:bg-white/20 disabled:opacity-40 disabled:hover:bg-white/10"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            className="text-white/80"
          >
            <path
              d="M12 5l-5 5 5 5"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        <span className="opacity-80 select-none">
          Page {page + 1} / {totalPages}
        </span>
        <button
          onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
          disabled={page >= totalPages - 1}
          aria-label="Next"
          className="p-3 rounded-full bg-white/10 hover:bg-white/20 disabled:opacity-40 disabled:hover:bg-white/10"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            className="text-white/80"
          >
            <path
              d="M8 5l5 5-5 5"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}

export default SinglyLevels;
