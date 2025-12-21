import { Flame, Settings } from "lucide-react";
import { ProductionNode } from "../../engine/types";

export function NodeView({
    node,
    depth = 0,
}: {
    node: ProductionNode;
    depth?: number;
}) {
    if (depth > 12)
        return (
            <div className="ml-4 text-red-500 text-xs py-2">Max depth exceeded</div>
        );

    const isMachine = node.deviceCount > 0;
    // TODO: Belt saturation calc might need store access if dynamic, but usually determined at calc time
    const isSaturated = node.isBeltSaturated;

    return (
        <div className="relative group">
            <div
                className={`flex items-center gap-4 p-3 pr-6 rounded-r-lg border-l-2 mb-3 transition-all ${isMachine
                    ? "bg-stone-800/40 border-l-amber-500 hover:bg-stone-800"
                    : node.isRaw
                        ? "bg-green-900/10 border-l-green-600 hover:bg-green-900/20"
                        : "bg-blue-900/10 border-l-blue-500 hover:bg-blue-900/20"
                    } ${isSaturated ? "border-l-red-500 bg-red-900/10" : ""}`}
            >
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                        <span
                            className={`font-semibold ${node.isTarget ? "text-amber-400" : "text-stone-300"
                                }`}
                        >
                            {node.itemName}
                        </span>
                        {isSaturated && (
                            <span className="text-red-500 text-[10px] uppercase font-bold tracking-wider border border-red-500/50 px-1 rounded">
                                Belt Limit
                            </span>
                        )}
                        {node.isTarget && (
                            <span className="text-amber-500 text-[10px] uppercase font-bold tracking-wider border border-amber-500/50 px-1 rounded">
                                Target
                            </span>
                        )}
                    </div>
                    <div className="text-xs text-stone-500 font-mono">
                        {node.rate.toFixed(1)}/m
                        {node.suppliedRate && node.suppliedRate > 0.01 ? (
                            <span className="text-green-500 ml-1 font-bold">
                                ({node.suppliedRate.toFixed(1)} Supplied)
                            </span>
                        ) : (
                            node.isRaw && " (Raw Input)"
                        )}
                    </div>

                    {isMachine && (
                        <div className="mt-2 flex items-center gap-3 text-xs text-stone-400 bg-stone-900/50 p-1.5 rounded inline-flex">
                            <span className="flex items-center gap-1">
                                <Settings className="w-3 h-3" />
                                <span className="text-amber-200 font-bold">
                                    {node.deviceCount.toLocaleString(undefined, {
                                        maximumFractionDigits: 1,
                                    })}
                                </span>
                                <span className="opacity-75">x Device</span>
                            </span>
                            {node.heatConsumption > 0 && (
                                <span className="flex items-center gap-1 border-l border-stone-700 pl-3">
                                    <Flame className="w-3 h-3 text-orange-500" />
                                    <span className="text-orange-200 font-bold">
                                        {Math.ceil(node.heatConsumption)}
                                    </span>
                                    <span className="opacity-75">Heat</span>
                                </span>
                            )}
                        </div>
                    )}

                    {/* Byproducts */}
                    {node.byproducts.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-2">
                            {node.byproducts.map((bp, i) => (
                                <div
                                    key={i}
                                    className="flex items-center gap-1 text-[10px] bg-indigo-900/20 text-indigo-300 px-1.5 py-0.5 rounded border border-indigo-500/30"
                                >
                                    <span>+{bp.itemName}</span>
                                    <span className="opacity-75">{bp.rate.toFixed(1)}/m</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Children */}
            <div className="pl-6 border-l border-stone-800 ml-6 space-y-1">
                {node.inputs.map((input, idx) => (
                    <NodeView key={idx} node={input} depth={depth + 1} />
                ))}
            </div>
        </div>
    );
}
