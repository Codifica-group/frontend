import React from "react";

export default function NoData() {
    return (
        <div className="flex flex-col items-center justify-center" style={{ marginTop: "5%" }}>
            <svg
                width="120"
                height="120"
                viewBox="0 0 24 24"
                fill="none"
                className="mb-4"
            >
                <g>
                    <ellipse cx="12" cy="19" rx="7" ry="2" fill="#e0e0e0">
                        <animate attributeName="rx" values="7;9;7" dur="1.2s" repeatCount="indefinite" />
                    </ellipse>
                    <path d="M12 3a7 7 0 0 1 7 7c0 3.87-3.13 7-7 7s-7-3.13-7-7a7 7 0 0 1 7-7z" fill="#f5f5f5" />
                    <circle cx="9" cy="10" r="1" fill="#bdbdbd" />
                    <circle cx="15" cy="10" r="1" fill="#bdbdbd" />
                    <path d="M9 14c1.333 1 4.667 1 6 0" stroke="#bdbdbd" strokeWidth="1" strokeLinecap="round" fill="none" />
                </g>
            </svg>
            <div className="text-lg text-gray-500 mt-2 font-medium tracking-wide text-center">
                Nenhum dado encontrado.
            </div>
        </div>
    );
}