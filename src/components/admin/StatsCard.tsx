import { LucideIcon } from "lucide-react";

interface StatsCardProps {
    title: string;
    value: string;
    change?: number;
    icon: LucideIcon;
    description?: string;
}

export function StatsCard({ title, value, change, icon: Icon, description }: StatsCardProps) {
    const isPositive = change && change > 0;

    return (
        <div className="bg-neutral-800 border border-white/5 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-neutral-400">{title}</h3>
                <div className="p-2 bg-emerald-500/10 rounded-lg">
                    <Icon className="w-4 h-4 text-emerald-500" />
                </div>
            </div>

            <div className="space-y-1">
                <p className="text-2xl font-bold text-white">{value}</p>
                {(change !== undefined) && (
                    <p className={`text-xs font-medium ${isPositive ? 'text-emerald-400' : 'text-red-400'}`}>
                        {isPositive ? '+' : ''}{change}% from last month
                    </p>
                )}
            </div>
        </div>
    );
}
