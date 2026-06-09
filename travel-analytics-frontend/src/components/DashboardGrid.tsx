import type React from "react";
import { BarChart3, Globe, DollarSign, Wallet} from 'lucide-react'

interface MetricCardProps {
    title: string;
    value: string | number;
    icon: React.ReactNode;
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, icon }) => (
    <div className="bg-white dark: bg-slate-900 p-6 rounded border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between transition-transform hover:scale-[1.02]">
        <div>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{title}</p>
            <h3 className="text-2xl font-bold mt-2 text-slate-800 dark:text-slate-100">{value}</h3>
        </div>
        <div className="p-3 bg-indigo-50 dark:bg-indigo-900/50 rounded-lg text-indigo-600 dark:text-indigo-400">
            {icon}
        </div>
    </div>
);

export const DashboardGrid: React.FC = () => {
    return (
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px8 py-8">
             // dynamic dashboard grid showing responsive adjustments
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                <MetricCard title="Total Destinations" value="14 Countries" icon={<Globe className="w-6 h-6" />} />
                <MetricCard title="Total Investment" value="$4,850.00" icon={<DollarSign className="w-6 h-6" />} />
                <MetricCard title="Active Itenararies" value="3 Pending" icon={<BarChart3 className="w-6 h-6" />} />
                <MetricCard title="Avg. Expense / Trip" value="$346.00" icon={<Wallet className="w-6 h-6" />} />
            </div>

            // Main content body
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
                <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 h-96 flex items-center justify-center">
                    <span className="text-slate-400">Geospatoal WebGL Map Canvas Container</span>
                </div>
                <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 h-96 flex items-center justify-center">
                    <span className="text-slate-400">Real-time Backend Stream Logs</span>
                </div>
            </div>
        </div>
        
    );
};

