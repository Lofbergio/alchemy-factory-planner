"use client";

import { cn } from "@/lib/utils";
import {
  AlertTriangle,
  Calculator,
  Flame,
  Settings
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { GraphView } from "../components/GraphView";
import {
  FactorySettingsPanel,
  ProductionTargetsPanel,
} from "../components/dashboard/FactoryConfigPanel";
import { FactoryTabs } from "../components/dashboard/FactoryTabs";
import { GlobalResearchPanel } from "../components/dashboard/GlobalResearchPanel";
import { IOSummaryPanel } from "../components/dashboard/IOSummaryPanel";
import itemsData from "../data/items.json";
import { calculateProduction } from "../engine/planner";
import { FactoryState, Item, ProductionNode, ResearchState } from "../engine/types";

// Cast itemsData to Item[] to satisfy strict typing
const items = itemsData as unknown as Item[];

// Filter lists for selectors
const FERTILIZERS = items.filter(
  (i) =>
    i.category === "fertilizer" ||
    (Array.isArray(i.category) && i.category.includes("fertilizer")),
);
// Fuels are items with heat_value > 0
const FUELS = items.filter((i) => i.heat_value && i.heat_value > 0);

const RESEARCH_KEY = "alchemy_planner_research";

const DEFAULT_RESEARCH: ResearchState = {
  logisticsEfficiency: 0,
  throwingEfficiency: 0,
  factoryEfficiency: 0,
  alchemySkill: 0,
  fuelEfficiency: 0,
  fertilizerEfficiency: 0,
  salesAbility: 0,
  negotiationSkill: 0,
  customerMgmt: 0,
  relicKnowledge: 0,
};



const DEFAULT_FACTORY: FactoryState = {
  id: "default",
  name: "Main Factory",
  targets: [{ item: "Healing Potion", rate: 10 }],
  config: {
    factoryEfficiency: 0,
    alchemySkill: 0,
    fuelEfficiency: 0,
    logisticsEfficiency: 1,
    fertilizerEfficiency: 0,
    salesAbility: 0,
    throwingEfficiency: 0,
    negotiationSkill: 0,
    customerMgmt: 0,
    relicKnowledge: 0,
    selectedFertilizer: "",
    selectedFuel: "",
  },
  viewMode: "graph",
};

const STORAGE_KEY = "alchemy_planner_factories";

export default function PlannerPage() {
  const [factories, setFactories] = useState<FactoryState[]>([]);
  const [activeId, setActiveId] = useState<string>("default");
  const [isLoaded, setIsLoaded] = useState(false);
  const [research, setResearch] = useState<ResearchState>(DEFAULT_RESEARCH);


  // Initialization & Migration
  // Initialization
  useEffect(() => {
    // 1. Load Research
    console.log("[App] Init Effect Running");
    const savedResearch = localStorage.getItem(RESEARCH_KEY);
    if (savedResearch) {
      try {
        const parsed = JSON.parse(savedResearch);
        console.log("[App] Loading Saved Research:", parsed);
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setResearch({ ...DEFAULT_RESEARCH, ...parsed });
      } catch (e) {
        console.error("Failed to parse research", e);
      }
    } else {
      console.log("[App] No saved research found");
    }

    // 2. Load Factories
    const saved = localStorage.getItem(STORAGE_KEY);
    let loadedFactories = false;

    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setFactories(parsed);
          setActiveId(parsed[0].id);
          loadedFactories = true;
        }
      } catch (e) {
        console.error("Failed to parse factories", e);
      }
    }

    // 3. Fallback / Default
    if (!loadedFactories) {
      const initialFactory = { ...DEFAULT_FACTORY, id: crypto.randomUUID() };
      setFactories([initialFactory]);
      setActiveId(initialFactory.id);
    }

    // 4. Mark Loaded
    setIsLoaded(true);
  }, []);

  // Persistence
  useEffect(() => {
    if (!isLoaded) return;

    if (factories.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(factories));
    }
    localStorage.setItem(RESEARCH_KEY, JSON.stringify(research));
  }, [factories, research, isLoaded]);

  const activeFactory = useMemo(() => {
    return (
      factories.find((f) => f.id === activeId) ||
      factories[0] ||
      DEFAULT_FACTORY
    );
  }, [factories, activeId]);

  // Actions
  const updateActiveFactory = (
    updates:
      | Partial<FactoryState>
      | ((prev: FactoryState) => Partial<FactoryState>),
  ) => {
    setFactories((prev) =>
      prev.map((f) => {
        if (f.id === activeId) {
          const newValues =
            typeof updates === "function" ? updates(f) : updates;
          return { ...f, ...newValues };
        }
        return f;
      }),
    );
  };

  const updateConfig = (field: keyof FactoryState["config"], value: unknown) => {
    updateActiveFactory((prev) => ({
      config: { ...prev.config, [field]: value },
    }));
  };

  const updateResearch = (field: keyof ResearchState, value: number) => {
    setResearch((prev) => ({ ...prev, [field]: value }));
  };

  const addFactory = () => {
    const newFactory: FactoryState = {
      ...DEFAULT_FACTORY,
      id: crypto.randomUUID(),
      name: `Factory ${factories.length + 1}`,
    };
    setFactories([...factories, newFactory]);
    setActiveId(newFactory.id);
  };

  const removeFactory = (id: string) => {
    const newFactories = factories.filter((f) => f.id !== id);
    setFactories(newFactories);
    if (activeId === id && newFactories.length > 0) {
      setActiveId(newFactories[0].id);
    }
  };

  // --- Production Calc ---
  const sortedItems = useMemo(() => {
    return [...items].sort((a, b) => a.name.localeCompare(b.name));
  }, []);

  const addTarget = () => {
    updateActiveFactory((prev) => ({
      targets: [...prev.targets, { item: sortedItems[0].name, rate: 10 }],
    }));
  };

  const removeTarget = (index: number) => {
    updateActiveFactory((prev) => {
      const newTargets = [...prev.targets];
      newTargets.splice(index, 1);
      return { targets: newTargets };
    });
  };

  const updateTarget = (
    index: number,
    field: "item" | "rate",
    value: string | number,
  ) => {
    updateActiveFactory((prev) => {
      const newTargets = [...prev.targets];
      // @ts-expect-error this is fine
      newTargets[index][field] = value;
      return { targets: newTargets };
    });
  };

  const productionTrees = useMemo(() => {
    if (!activeFactory) return [];
    if (activeFactory.targets.length === 0) return [];

    // Merge factory config with global research
    // Research overrides factory specific settings if they are 0?
    // Or we just add them? Logic was: factory config holds overrides?
    // Actually, earlier logic was just merging.
    // PlannerConfig has full names. ResearchState has full names now.
    // We can just spread them.
    const config = {
      ...activeFactory.config,
      ...research,
      // Ensure explicit overrides if needed, but spread should work if keys match.
      // Note: activeFactory.config is PlannerConfig. research is ResearchState.
      // keys match now.
      selectedFertilizer: activeFactory.config.selectedFertilizer || undefined,
      selectedFuel: activeFactory.config.selectedFuel || undefined,
    };
    return calculateProduction({
      targets: activeFactory.targets,
      ...config,
    });
  }, [activeFactory, research]);

  const stats = useMemo(() => {
    let totalMachines = 0;
    let totalPower = 0;

    function traverse(node: ProductionNode) {
      totalMachines += node.deviceCount;
      totalPower += node.heatConsumption;
      node.inputs.forEach(traverse);
    }

    productionTrees.forEach((root) => traverse(root));

    return { totalMachines, totalPower };
  }, [productionTrees]);

  const ioSummary = useMemo(() => {
    const inputs = new Map<string, number>();
    const outputs = new Map<string, number>();

    function traverse(node: ProductionNode, isRoot = false) {
      // If root, it's a main output
      if (isRoot) {
        outputs.set(
          node.itemName,
          (outputs.get(node.itemName) || 0) + node.rate,
        );
      }

      // Byproducts are outputs
      node.byproducts.forEach((bp) => {
        outputs.set(bp.itemName, (outputs.get(bp.itemName) || 0) + bp.rate);
      });

      // Inputs
      if (node.inputs.length === 0 && node.deviceCount === 0) {
        // It's a raw input (leaf node with no machine, usually)
        // ACTUALLY: In our engine, raw resources might have deviceCount=0 (Water pump?).
        // Let's assume leaves are inputs.
        inputs.set(node.itemName, (inputs.get(node.itemName) || 0) + node.rate);
      }

      node.inputs.forEach((n) => traverse(n));
    }

    productionTrees.forEach((root) => traverse(root, true));

    return {
      inputs: Array.from(inputs.entries())
        .map(([name, rate]) => ({ name, rate }))
        .sort((a, b) => a.name.localeCompare(b.name)),
      outputs: Array.from(outputs.entries())
        .map(([name, rate]) => ({ name, rate }))
        .sort((a, b) => a.name.localeCompare(b.name)),
    };
  }, [productionTrees]);

  if (!activeFactory)
    return <div className="p-10 text-stone-500">Loading...</div>;

  return (
    <div className="min-h-screen bg-stone-950 text-stone-200 font-sans p-2 lg:p-8 flex flex-col gap-4">
      {/* Header & Tabs */}
      <header className="flex flex-col gap-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-amber-600 rounded-lg shadow-lg shadow-amber-900/20">
              <Calculator className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-amber-200 to-amber-500 bg-clip-text text-transparent">
                Alchemy Planner
              </h1>
            </div>
          </div>


        </div>

        {/* Global Research Panel */}
        <GlobalResearchPanel
          research={research}
          updateResearch={updateResearch}
          onReset={() => setResearch(DEFAULT_RESEARCH)}
        />

        {/* Tab Bar */}
        <FactoryTabs
          factories={factories}
          activeId={activeId}
          setActiveId={setActiveId}
          addFactory={addFactory}
          removeFactory={(id) => removeFactory(id)}
          updateActiveFactory={updateActiveFactory}
        />
      </header>

      {/* Dashboard Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Panel 1: Production Targets */}
        <ProductionTargetsPanel
          targets={activeFactory.targets}
          items={sortedItems}
          addTarget={addTarget}
          removeTarget={removeTarget}
          updateTarget={updateTarget}
        />

        {/* Panel 2: Configuration */}
        <FactorySettingsPanel
          config={{
            selectedFertilizer: activeFactory.config.selectedFertilizer || "",
            selectedFuel: activeFactory.config.selectedFuel || "",
          }}
          fertilizers={FERTILIZERS}
          fuels={FUELS}
          updateConfig={(field, value) => updateConfig(field, value)}
        />

        {/* Panel 3: IO Summary */}
        <IOSummaryPanel stats={stats} ioSummary={ioSummary} />
      </div>

      <main className="flex-1 flex flex-col gap-6 min-h-0">
        {/* View Area */}
        <section className="flex-1 bg-stone-900 rounded-xl border border-stone-800 shadow-xl overflow-hidden min-h-[600px] flex flex-col relative">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500/50 to-transparent z-10 w-full pointer-events-none"></div>

          <div className="flex-1 w-full h-full relative">
            {productionTrees && productionTrees.length > 0 ? (
              activeFactory.viewMode === "graph" ? (
                // Pass factoryId so GraphView uses unique persistence keys
                // Add key to force remount so onInit (viewport restore) fires and state is clean
                <GraphView
                  key={activeFactory.id}
                  rootNodes={productionTrees}
                  factoryId={activeFactory.id}
                />
              ) : (
                <div className="p-8 overflow-auto custom-scrollbar h-full">
                  <div className="min-w-max space-y-8">
                    {productionTrees.map((root, i) => (
                      <div key={i} className="border-l-4 border-stone-800 pl-4">
                        <h3 className="text-stone-500 font-bold mb-4 uppercase text-xs tracking-widest">
                          Target: {root.itemName}
                        </h3>
                        <NodeView node={root} depth={0} />
                      </div>
                    ))}
                  </div>
                </div>
              )
            ) : (
              <div className="flex items-center justify-center p-20 text-stone-600">
                Add a product to start planning
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}



function NodeView({
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
  const isSaturated = node.isBeltSaturated;

  return (
    <div className="relative group">
      <div
        className={cn(
          "flex items-center gap-4 p-3 pr-6 rounded-r-lg border-l-2 mb-3 transition-all",
          isMachine
            ? "bg-stone-800/40 border-l-amber-500 hover:bg-stone-800"
            : "bg-stone-900/20 border-l-stone-700 text-stone-500",
          isSaturated && "bg-red-900/10 border-l-red-500",
        )}
      >
        {/* Connection Line */}
        {depth > 0 && (
          <div className="absolute -left-6 top-1/2 w-6 h-[1px] bg-stone-700"></div>
        )}

        {/* Content */}
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <span
              className={cn(
                "font-medium text-lg",
                isMachine ? "text-stone-200" : "text-stone-500",
              )}
            >
              {node.itemName}
            </span>

            <div className="flex flex-col items-start leading-none">
              <span
                className={cn(
                  "text-sm font-mono",
                  isSaturated ? "text-red-400" : "text-amber-500",
                )}
              >
                {node.rate.toLocaleString(undefined, {
                  maximumFractionDigits: 1,
                })}
                /m
              </span>
              {isSaturated && (
                <span className="text-[10px] text-red-500 flex items-center gap-1 mt-0.5">
                  <AlertTriangle size={10} /> Belt Limit ({node.beltLimit})
                </span>
              )}
            </div>
          </div>

          {isMachine && (
            <div className="flex flex-wrap gap-x-6 gap-y-1 mt-2 text-xs text-stone-400">
              <span className="flex items-center gap-1.5">
                <Settings size={12} className="text-stone-500" />
                <span className="text-stone-300 font-bold">
                  {node.deviceCount.toLocaleString(undefined, {
                    maximumFractionDigits: 2,
                  })}
                  x
                </span>
                {node.deviceId || "Machine"}
              </span>
              {node.heatConsumption > 0 && (
                <>
                  <span className="flex items-center gap-1 text-orange-400/80">
                    <Flame size={12} /> {node.heatConsumption.toLocaleString()}{" "}
                    Heat
                  </span>
                  <span className="flex items-center gap-1 text-stone-500 border-l border-stone-700 pl-4 ml-2">
                    <span className="text-stone-400 font-bold">
                      {node.deviceCount.toLocaleString(undefined, {
                        maximumFractionDigits: 2,
                      })}
                      x
                    </span>
                    Stone Furnace
                  </span>
                </>
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
