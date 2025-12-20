import { Coins, Flame, Leaf, Settings, Truck, Zap } from "lucide-react";
import { ResearchState } from "../../engine/types";
import { cn } from "../../lib/utils";

interface GlobalResearchPanelProps {
    research: ResearchState;
    updateResearch: (field: keyof ResearchState, value: number) => void;
    onReset: () => void;
}

export function GlobalResearchPanel({
    research,
    updateResearch,
    onReset,
}: GlobalResearchPanelProps) {
    return (
        <div className="bg-stone-900 px-6 py-4 rounded-xl border border-stone-800 shadow-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                    className="text-[10px] text-stone-600 hover:text-amber-400 font-bold uppercase tracking-wider bg-stone-950/80 px-2 py-1 rounded"
                    onClick={onReset}
                >
                    Reset Research
                </button>
            </div>
            <div className="flex items-center gap-2 mb-4">
                <div className="p-1.5 bg-indigo-500/10 rounded-md">
                    <Zap size={14} className="text-indigo-400" />
                </div>
                <h3 className="text-xs font-bold text-stone-400 uppercase tracking-widest">
                    Global Research
                </h3>
                <div className="h-[1px] flex-1 bg-stone-800/50"></div>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                <ResearchSlider
                    label="Logistics"
                    icon={<Truck size={12} />}
                    value={research.logisticsEfficiency}
                    onChange={(v: number) => updateResearch("logisticsEfficiency", v)}
                    color="text-blue-400"
                    description={`Belt Speed ${60 + research.logisticsEfficiency * 15}/min`}
                />
                <ResearchSlider
                    label="Throwing"
                    icon={<Zap size={12} />}
                    value={research.throwingEfficiency}
                    onChange={(v: number) => updateResearch("throwingEfficiency", v)}
                    color="text-cyan-400"
                    description={`Catapult Rate ${100 + research.throwingEfficiency * 25}%`}
                />
                <ResearchSlider
                    label="Factory Eff"
                    icon={<Settings size={12} />}
                    value={research.factoryEfficiency}
                    onChange={(v: number) => updateResearch("factoryEfficiency", v)}
                    color="text-amber-400"
                    description={`Prod Speed ${100 + research.factoryEfficiency * 25}%`}
                />
                <ResearchSlider
                    label="Alchemy"
                    icon={<Zap size={12} />}
                    value={research.alchemySkill}
                    onChange={(v: number) => updateResearch("alchemySkill", v)}
                    color="text-purple-400"
                    description={`Extractor Output +${100 + research.alchemySkill * 6}%`}
                />
                <ResearchSlider
                    label="Fuel Eff"
                    icon={<Flame size={12} />}
                    value={research.fuelEfficiency}
                    onChange={(v: number) => updateResearch("fuelEfficiency", v)}
                    color="text-orange-400"
                    description={`Fuel Heat +${research.fuelEfficiency * 10}%`}
                />
                <ResearchSlider
                    label="Fertilizer"
                    icon={<Leaf size={12} />}
                    value={research.fertilizerEfficiency}
                    onChange={(v: number) => updateResearch("fertilizerEfficiency", v)}
                    color="text-green-400"
                    description={`Nutrient Value +${research.fertilizerEfficiency * 10}%`}
                />
                <ResearchSlider
                    label="Sales"
                    icon={<Coins size={12} />}
                    value={research.salesAbility}
                    onChange={(v: number) => updateResearch("salesAbility", v)}
                    color="text-yellow-400"
                    description={`Shop Profit ${100 + research.salesAbility * 3}%`}
                />
                <ResearchSlider
                    label="Negotiation"
                    icon={<Coins size={12} />}
                    value={research.negotiationSkill}
                    onChange={(v: number) => updateResearch("negotiationSkill", v)}
                    color="text-emerald-400"
                    description={`Contract Amount ${100 + research.negotiationSkill * 25}%`}
                />
                <ResearchSlider
                    label="Customer"
                    icon={<Coins size={12} />}
                    value={research.customerMgmt}
                    onChange={(v: number) => updateResearch("customerMgmt", v)}
                    color="text-pink-400"
                    description={`Quest Rewards ${100 + research.customerMgmt * 6}%`}
                />
                <ResearchSlider
                    label="Relic"
                    icon={<Zap size={12} />}
                    value={research.relicKnowledge}
                    onChange={(v: number) => updateResearch("relicKnowledge", v)}
                    color="text-indigo-400"
                    description={`Withdrawal Bonus ${100 + research.relicKnowledge * 10}%`}
                />
            </div>
        </div>
    );
}

function ResearchSlider({
    label,
    value,
    onChange,
    icon,
    color,
    description,
}: {
    label: string;
    value: number;
    onChange: (value: number) => void;
    icon: React.ReactNode;
    color: string;
    description: string;
}) {
    return (
        <div className="bg-stone-950/30 p-2 rounded border border-stone-800/50">
            <div className="flex justify-between text-xs mb-1">
                <span className="flex items-center gap-1.5 text-stone-400 font-bold">
                    {icon} {label}
                </span>
                <span className={cn("font-mono font-bold", color)}>{value}</span>
            </div>
            <input
                type="range"
                min="0"
                max="10"
                value={value}
                onChange={(e) => onChange(parseInt(e.target.value))}
                className="w-full h-1.5 bg-stone-800 rounded-lg appearance-none cursor-pointer accent-stone-500 hover:accent-stone-400 mb-1"
            />
            <div className="text-[10px] text-stone-500 text-right font-mono truncate">
                {description}
            </div>
        </div>
    );
}
