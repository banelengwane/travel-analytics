import { useEffect, useState } from "react";
import { api } from "../api/axiosClient";
import { ArrowUpRight, DollarSign, TrendingUp } from "lucide-react";

interface ExpenseMetric {
    category: string;
    totalSpent: number;
    uniqueTrips: number;
}

export const AnalyticsDashboard: React.FC = () => {
    const [metrics, setMetrics] = useState<ExpenseMetric[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const response = await api.get('/analytics/overview');
                setMetrics(response.data);
            } catch (error) {
                console.error("Error retrieving dashboard visual metrics", error);
            } finally {
                setLoading(false);
            }
        }
        fetchAnalytics();
    }, [])

    if(loading) {
        return (
            <div className="w-full h-64 flex iterms-center justify-between">
                <div className="animate-spin rounded-full h-12 w-12 boarder-b-2 border-indigo-600"></div>
            </div>
        );
    }

    //calculating high-level total on the client for instat summary display
    const totalInvestment = metrics.reduce((acc, curr) => acc + curr.totalSpent, 0);

    return (
        <div className="space-y-8 p-4 md:p-8 max-w-7xl mx-auto">

            {/* header metric bar */}
            <div className="bg-slate-900 dark:bg-slate-950 text-white rounded-2xl p-6 shadow-xl flex flex-col md:flex-row items-start md: items-center justify-between gap-4">
                <div>
                    <p className="text-sm font-medium text-slate-400 uppercase tracking-wide">Total Portfolio Spend</p>
                    <h2 className="text-4xl font-extrabold mt-1 text-white flex items-center gap-2">
                        ${totalInvestment.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </h2>
                </div>
                <div className="flex items-center gap-2 bg-emerald-500/10 text-emerald-400 px-4 py2 rounded-xl text-sm font-semibold border border-emerald-500/20">
                    <TrendingUp className="w-4 h-4" />
                    Optimized Database Pipelines 
                </div>
            </div>

            {/* Main Interactive grid layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Visual custom chart card */}
                <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">Relative Breakdown</h3>
                            <p className="text-sm text-slate-500">Live allocation metrics parsed by category</p>
                        </div>
                    </div>

                    {/* Fully Responsive CSS Native chart system */}
                    <div className="space-y-4 mt-4">
                        {metrics.map((item) => {
                            const percentage = totalInvestment > 0 ? (item.totalSpent / totalInvestment) * 100 : 0;
                            return (
                                <div key={item.category} className="group">
                                    <div className="flex justify-between text-sm font-medium mb-1">
                                        <span className="text-slate-700 dark:text-slate-300 capitalize">{item.category}</span>
                                        <span className="text-slate-500">${item.totalSpent.toFixed(2)} ({percentage.toFixed(1)})%</span>
                                    </div>
                                    {/* Outer track container */}
                                    <div className="w-full bg-slate-100 dark:bg-slate-800 h-3 rounded-full overflow-hidden">
                                        {/* inner colored progress bar node */}
                                        <div 
                                            className="bg-indigo-600 dark:bg-indigo-500 h-full rounded-full transition-all duration-500 ease-out group-hover:bg-indigo-400"
                                            style={{ width: `${percentage}%`}}
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* dynamic detail card list */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm flex flex-col justify-between">
                    <div>
                        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-4">Pipeline Metrics</h3>
                        <div className="divide-y divide-slate-100 dark:divide-slate-800">
                            {metrics.slice(0, 3).map((item) => (
                                <div key={item.category} className="py-4 flex justify-between items-center">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg text-slate-600 dark:text-slate-400">
                                            <DollarSign className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 capitalize">{item.category}</p>
                                            <p className="text-sm text-slate-500">{item.uniqueTrips} linked itineraries</p>
                                        </div>
                                    </div>
                                    <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-500" />
                                </div>
                            ))}
                        </div>
                    </div>

                    <button className="w-full mt-6 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800/50 text-slate-700 dark:text-slate-300 font-medium py-2.5 px-4 rounded-xl text-sm transition-colors border border-slate-200 dark:border-slate-700">
                        Export Analytics Audit (CSV)
                    </button>
                </div>
            </div>
        </div>
    );
};