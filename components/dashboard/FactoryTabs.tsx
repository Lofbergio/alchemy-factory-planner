import { GitGraph, LayoutList, PlusCircle, X } from "lucide-react";
import { useState } from "react";
import { cn } from "../../lib/utils";
import { useFactoryStore } from "../../store/useFactoryStore";

export function FactoryTabs() {
    const {
        factories,
        activeFactoryId,
        setActiveFactory,
        addFactory,
        removeFactory,
        renameFactory,
        setViewMode,
    } = useFactoryStore();

    const [isRenaming, setIsRenaming] = useState<string | null>(null);
    const [renameValue, setRenameValue] = useState("");

    const activeFactory = factories.find((f) => f.id === activeFactoryId);


    const startRename = (id: string, currentName: string) => {
        setIsRenaming(id);
        setRenameValue(currentName);
    };

    const finishRename = () => {
        if (isRenaming) {
            renameFactory(isRenaming, renameValue);
            setIsRenaming(null);
        }
    };

    return (
        <div className="flex overflow-x-auto custom-scrollbar items-center gap-1">
            {factories.map((factory) => (
                <div
                    key={factory.id}
                    onClick={() => setActiveFactory(factory.id)}
                    onDoubleClick={() => startRename(factory.id, factory.name)}
                    className={cn(
                        "group flex items-center gap-2 px-4 py-2.5 rounded-t-lg border-b-2 transition-all cursor-pointer min-w-[140px] select-none",
                        activeFactoryId === factory.id
                            ? "bg-stone-900 border-amber-500 text-amber-100 font-medium"
                            : "bg-stone-950/30 border-transparent text-stone-500 hover:bg-stone-900/50 hover:text-stone-300",
                    )}
                >
                    {isRenaming === factory.id ? (
                        <input
                            autoFocus
                            className="bg-stone-950 text-xs px-1 py-0.5 rounded border border-amber-500/50 outline-none w-24"
                            value={renameValue}
                            onChange={(e) => setRenameValue(e.target.value)}
                            onBlur={finishRename}
                            onKeyDown={(e) => e.key === "Enter" && finishRename()}
                            onClick={(e) => e.stopPropagation()}
                        />
                    ) : (
                        <span className="text-sm whitespace-nowrap">
                            {factory.name}
                        </span>
                    )}

                    <div
                        className={cn(
                            "flex gap-1 opacity-0 transition-opacity ml-auto",
                            activeFactoryId === factory.id && "opacity-100",
                            "group-hover:opacity-100",
                        )}
                    >
                        {factories.length > 1 && (
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    removeFactory(factory.id);
                                }}
                                className="text-stone-600 hover:text-red-400 p-0.5 hover:bg-stone-800 rounded"
                            >
                                <X size={12} />
                            </button>
                        )}
                    </div>
                </div>
            ))}
            <button
                onClick={addFactory}
                className="px-3 py-2 text-stone-600 hover:text-amber-400 hover:bg-stone-900/50 rounded-t-lg transition-colors border-b-2 border-transparent"
            >
                <PlusCircle size={18} />
            </button>
            <div className="flex-1 border-b-2 border-stone-900/50"></div>

            {/* View Toggle Bar */}
            {activeFactory && (
                <div className="flex justify-end ml-2">
                    <div className="flex bg-stone-900 p-1 rounded-md border border-stone-800">
                        <button
                            onClick={() => setViewMode(activeFactory.id, "graph")}
                            className={cn(
                                "p-1.5 rounded flex items-center gap-2 text-xs font-bold uppercase tracking-wider transition-colors",
                                activeFactory.viewMode === "graph"
                                    ? "bg-amber-600/20 text-amber-500"
                                    : "text-stone-500 hover:text-stone-300",
                            )}
                        >
                            <GitGraph size={14} /> Graph
                        </button>
                        <button
                            onClick={() => setViewMode(activeFactory.id, "list")}
                            className={cn(
                                "p-1.5 rounded flex items-center gap-2 text-xs font-bold uppercase tracking-wider transition-colors",
                                activeFactory.viewMode === "list"
                                    ? "bg-amber-600/20 text-amber-500"
                                    : "text-stone-500 hover:text-stone-300",
                            )}
                        >
                            <LayoutList size={14} /> List
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
