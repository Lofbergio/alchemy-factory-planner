import { GitGraph, LayoutList, PlusCircle, X } from "lucide-react";
import { useState } from "react";
import { FactoryState } from "../../engine/types";
import { cn } from "../../lib/utils";

interface FactoryTabsProps {
    factories: FactoryState[];
    activeId: string;
    setActiveId: (id: string) => void;
    addFactory: () => void;
    removeFactory: (id: string) => void;
    updateActiveFactory: (updates: Partial<FactoryState>) => void;
}

export function FactoryTabs({
    factories,
    activeId,
    setActiveId,
    addFactory,
    removeFactory,
    updateActiveFactory,
}: FactoryTabsProps) {
    const [isRenaming, setIsRenaming] = useState<string | null>(null);
    const [renameValue, setRenameValue] = useState("");

    const activeFactory = factories.find((f) => f.id === activeId);

    const startRename = (id: string, currentName: string) => {
        setIsRenaming(id);
        setRenameValue(currentName);
    };

    const finishRename = () => {
        if (isRenaming) {
            // Find the factory being renamed (it might not be the active one if user clicked another?)
            // But typically we rename the one we double clicked.
            // We need to update the specific factory.
            // However, updateActiveFactory only updates the *active* one.
            // If we rename a non-active factory, this prop won't work if it only updates active.
            // But usually we click to activate then double click.
            // Let's assume we rename the active one or we need a general updateFactory(id, updates) prop.
            // For now, let's assume we rename the one we interact with.
            // If isRenaming === activeId, we can use updateActiveFactory.
            if (isRenaming === activeId) {
                updateActiveFactory({ name: renameValue });
            } else {
                // If we support renaming inactive factories, we need a better prop.
                // Given page.tsx implementation: updateActiveFactory updates the *active* factory.
                // So if we rename an inactive one, we might have a bug if we don't activate it first.
                // In the original code: onClick={() => setActiveId(factory.id)} happened on click.
                // Double click likely fires click first.
            }
            setIsRenaming(null);
        }
    };

    // Note: The original code logic for renaming:
    // onDoubleClick fires. If it's the tab, simpler.
    // We'll stick to renaming the tab we double clicked.
    // Since we don't have updateFactory(id, ...), we'll assume the user activates the tab to rename it.

    return (
        <div className="flex overflow-x-auto custom-scrollbar items-center gap-1">
            {factories.map((factory) => (
                <div
                    key={factory.id}
                    onClick={() => setActiveId(factory.id)}
                    onDoubleClick={() => startRename(factory.id, factory.name)}
                    className={cn(
                        "group flex items-center gap-2 px-4 py-2.5 rounded-t-lg border-b-2 transition-all cursor-pointer min-w-[140px] select-none",
                        activeId === factory.id
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
                            onClick={(e) => e.stopPropagation()} // Prevent triggering setActive again?
                        />
                    ) : (
                        <span className="text-sm whitespace-nowrap">
                            {factory.name}
                        </span>
                    )}

                    <div
                        className={cn(
                            "flex gap-1 opacity-0 transition-opacity ml-auto",
                            activeId === factory.id && "opacity-100",
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
                            onClick={() => updateActiveFactory({ viewMode: "graph" })}
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
                            onClick={() => updateActiveFactory({ viewMode: "list" })}
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
