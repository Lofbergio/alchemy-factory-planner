import { LayoutList } from "lucide-react";

interface IOSummaryPanelProps {
    stats: {
        totalMachines: number;
        totalPower: number;
    };
    ioSummary: {
        inputs: { name: string; rate: number }[];
        outputs: { name: string; rate: number }[];
    };
}

export function IOSummaryPanel({ stats, ioSummary }: IOSummaryPanelProps) {
    return (
        <div className="bg-stone-900 p-4 rounded-lg border border-stone-800 flex flex-col gap-4">
            <h3 className="font-semibold text-stone-300 flex items-center gap-2 text-sm justify-between">
                <span className="flex items-center gap-2">
                    <LayoutList size={14} /> Input / Output Summary
                </span>
                <div className="flex gap-4 items-center bg-stone-950/50 px-3 py-2 rounded border border-stone-800/50 justify-center">
                    <div className="flex flex-col items-center">
                        <span className="text-[9px] text-stone-500 uppercase tracking-wider font-bold">
                            Machines
                        </span>
                        <span className="text-sm font-mono text-amber-400">
                            {stats.totalMachines.toLocaleString(undefined, {
                                maximumFractionDigits: 2,
                            })}
                        </span>
                    </div>
                    <div className="w-[1px] h-6 bg-stone-800"></div>
                    <div className="flex flex-col items-center">
                        <span className="text-[9px] text-stone-500 uppercase tracking-wider font-bold">
                            Total Heat
                        </span>
                        <span className="text-sm font-mono text-orange-400">
                            {stats.totalPower.toLocaleString()}
                        </span>
                    </div>
                </div>
            </h3>

            <div className="flex-1 overflow-y-auto custom-scrollbar max-h-[160px] grid grid-cols-2 gap-4">
                {/* Inputs */}
                <div>
                    <span className="text-[10px] font-bold text-stone-500 uppercase block border-b border-stone-800/50 mb-2">
                        Inputs
                    </span>
                    <div className="space-y-1">
                        {ioSummary.inputs.length > 0 ? (
                            ioSummary.inputs.map((item, i) => (
                                <div key={i} className="flex justify-between text-xs">
                                    <span className="text-stone-400">{item.name}</span>
                                    <span className="text-amber-500 font-mono">
                                        {item.rate.toFixed(1)}/m
                                    </span>
                                </div>
                            ))
                        ) : (
                            <span className="text-xs text-stone-600 italic">None</span>
                        )}
                    </div>
                </div>
                {/* Outputs */}
                <div>
                    <span className="text-[10px] font-bold text-stone-500 uppercase block border-b border-stone-800/50 mb-2">
                        Outputs
                    </span>
                    <div className="space-y-1">
                        {ioSummary.outputs.map((item, i) => (
                            <div key={i} className="flex justify-between text-xs">
                                <span className="text-stone-300 font-medium">
                                    {item.name}
                                </span>
                                <span className="text-green-400 font-mono">
                                    {item.rate.toFixed(1)}/m
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
