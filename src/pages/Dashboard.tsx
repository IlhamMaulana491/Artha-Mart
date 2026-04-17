import { useEffect, useState } from 'react';
import { 
  Users, 
  TrendingUp, 
  Target, 
  ArrowUpRight,
  DollarSign
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts';
import { API } from '../lib/api';

const StatCard = ({ title, value, icon: Icon, trend, prefix = "" }: any) => (
  <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
    <div className="flex items-center justify-between mb-3">
      <div className="p-1.5 bg-slate-50 border border-slate-100 rounded-lg">
        <Icon className="w-5 h-5 text-slate-900" />
      </div>
      {trend && (
        <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-full uppercase tracking-tight">
          <ArrowUpRight className="w-2.5 h-2.5" />
          {trend}%
        </span>
      )}
    </div>
    <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-1 leading-none">{title}</p>
    <p className="text-xl font-bold tracking-tight text-slate-900">
      {prefix}{value.toLocaleString('id-ID')}
    </p>
  </div>
);

export default function Dashboard() {
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    API.getStats().then(setStats);
  }, []);

  if (!stats || stats.error) {
    return (
      <div className="py-20 text-center animate-pulse">
        <p className="text-slate-400 font-medium italic">
          {stats?.error ? `Error: ${stats.error}` : 'Memuat data dasbor...'}
        </p>
      </div>
    );
  }

  const chartData = (Array.isArray(stats.pipeline) ? stats.pipeline : []).map((item: any) => ({
    name: (item.stage || 'unknown').charAt(0).toUpperCase() + (item.stage || 'unknown').slice(1),
    value: item.value || 0
  }));

  const COLORS = ['#0f172a', '#334155', '#64748b', '#94a3b8', '#cbd5e1'];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900 mb-1">Ikhtisar Performa</h2>
        <p className="text-xs text-slate-400 font-medium italic">Pantau pertumbuhan bisnis dan pipeline anda secara real-time.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Total Pendapatan" 
          value={stats.totalRevenue} 
          icon={DollarSign} 
          prefix="Rp "
        />
        <StatCard 
          title="Total Pelanggan" 
          value={stats.customerCount} 
          icon={Users} 
          trend={12}
        />
        <StatCard 
          title="Proyek Aktif" 
          value={stats.activeDeals} 
          icon={Target} 
        />
        <StatCard 
          title="Pertumbuhan" 
          value={8.4} 
          icon={TrendingUp} 
          trend={2.1}
          prefix="+"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="text-sm font-bold text-slate-900 mb-4 italic font-serif">Distribusi Pipeline</h3>
          <div className="h-[240px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 600 }}
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 600 }}
                  tickFormatter={(val) => `Rp ${val/1000000}jt`}
                />
                <Tooltip 
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ 
                    borderRadius: '8px', 
                    border: '1px solid #f1f5f9', 
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                    padding: '8px',
                    fontSize: '10px'
                  }}
                  formatter={(value: any) => [`Rp ${value.toLocaleString('id-ID')}`, 'Value']}
                />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]} barSize={40}>
                    {chartData.map((_entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 shadow-xl flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-white mb-1.5">Target Bulanan</h3>
            <p className="text-slate-500 text-[11px] mb-5 leading-relaxed">Pencapaian anda bulan ini hampir mencapai target 85%.</p>
            
            <div className="relative pt-1">
              <div className="flex mb-1.5 items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold inline-block py-0.5 px-1.5 uppercase rounded bg-slate-800 text-slate-400">
                    Progress
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-bold inline-block text-white">
                    78%
                  </span>
                </div>
              </div>
              <div className="overflow-hidden h-1.5 mb-4 text-xs flex rounded bg-slate-800">
                <div style={{ width: "78%" }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-white"></div>
              </div>
            </div>
          </div>
          
          <button className="w-full bg-white text-slate-900 text-xs font-bold py-2.5 rounded-lg hover:bg-slate-100 transition-colors">
            Lihat Laporan Detail
          </button>
        </div>
      </div>
    </div>
  );
}
