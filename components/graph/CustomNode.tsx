import { Handle, Position } from "@xyflow/react";
import { AlertTriangle, Flame, Settings } from "lucide-react";
import { ProductionNode } from "../../engine/types";
import { cn } from "../../lib/utils";

export function CustomNode({ data }: { data: ProductionNode }) {
    // Cast to access properties safely if TS complains
    const nodeData = data as ProductionNode;

    const isMachine = nodeData.deviceCount > 0;
    const isSaturated = nodeData.isBeltSaturated;
    const isTarget = nodeData.isTarget;

    return (
        <div
            className={cn(
                "p-3 rounded-lg border-2 shadow-lg min-w-[220px] bg-stone-900 transition-colors",
                isTarget
                    ? "border-green-500 bg-green-950/20"
                    : isMachine
                        ? "border-amber-600/50"
                        : "border-stone-700",
                isSaturated && !isTarget && "border-red-500 shadow-red-500/20",
            )}
        >
            {/* Header */}
            <div className="flex justify-between items-start mb-2 border-b border-stone-800 pb-2">
                <span
                    className={cn(
                        "font-bold text-sm truncate",
                        isTarget
                            ? "text-green-400"
                            : isMachine
                                ? "text-amber-100"
                                : "text-stone-400",
                    )}
                >
                    {isTarget ? "Production Target" : nodeData.itemName}
                </span>
                <div className="text-right">
                    <div
                        className={cn(
                            "text-xs font-mono font-bold",
                            isTarget
                                ? "text-green-400"
                                : isSaturated
                                    ? "text-red-400"
                                    : "text-amber-400",
                        )}
                    >
                        {nodeData.rate.toLocaleString(undefined, {
                            maximumFractionDigits: 1,
                        })}
                        /m
                    </div>
                    {isSaturated && !isTarget && (
                        <div className="text-[8px] text-red-500 flex items-center justify-end gap-0.5">
                            <AlertTriangle size={8} /> Limit
                        </div>
                    )}
                </div>
            </div>

            {/* Body */}
            <div className="space-y-1">
                {isTarget && (
                    <div className="flex items-center gap-2 text-xs text-green-300">
                        <span className="font-bold">{nodeData.itemName}</span>
                    </div>
                )}

                {isMachine && (
                    <div className="flex items-center gap-2 text-xs text-stone-400">
                        <Settings size={12} className="text-stone-500" />
                        <span className="text-stone-200 font-bold">
                            {nodeData.deviceCount.toLocaleString(undefined, {
                                maximumFractionDigits: 2,
                            })}
                            x
                        </span>
                        <span className="truncate max-w-[100px]">{nodeData.deviceId}</span>
                    </div>
                )}

                {nodeData.heatConsumption > 0 && (
                    <div className="flex items-center gap-2 text-xs text-orange-400">
                        <Flame size={12} />
                        <span>{nodeData.heatConsumption.toLocaleString()} Heat</span>
                    </div>
                )}
            </div>

            {/* Handles for Edges */}
            <Handle
                type="target"
                position={Position.Left}
                className="w-3 h-3 bg-stone-500 border-2 border-stone-800"
            />
            {/* Targets usually don't have source, but we leave it flexible */}
            {!isTarget && (
                <Handle
                    type="source"
                    position={Position.Right}
                    className="w-3 h-3 bg-stone-500 border-2 border-stone-800"
                />
            )}
        </div>
    );
}
