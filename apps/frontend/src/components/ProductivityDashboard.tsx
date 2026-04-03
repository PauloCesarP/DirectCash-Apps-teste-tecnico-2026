'use client';

import { useEffect, useState } from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { analyticsAPI } from '@/lib/api';

interface ProductivityData {
  date: string;
  completed: number;
  tasks: any[];
}

interface ProductivityStats {
  totalCompleted: number;
  averagePerDay: number;
  highPriorityCompleted: number;
  weekStart: string;
  weekEnd: string;
}

export function ProductivityDashboard() {
  const [data, setData] = useState<ProductivityData[]>([]);
  const [stats, setStats] = useState<ProductivityStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await analyticsAPI.getProductivity();
        setData(response.data?.data || []);
        setStats(response.data?.stats || null);
      } catch (err: any) {
        setError(err.message || 'Falha ao carregar dados de produtividade');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96 bg-white dark:bg-gray-800 rounded-lg shadow">
        <div className="text-gray-600 dark:text-gray-400">Carregando dados...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
        <p className="text-red-800 dark:text-red-200">Erro: {error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border-l-4 border-blue-500">
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">
            Total Concluído
          </p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">
            {stats?.totalCompleted || 0}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            na semana
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border-l-4 border-green-500">
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">
            Média/Dia
          </p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">
            {stats?.averagePerDay.toFixed(1) || '0'}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            tarefas por dia
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border-l-4 border-purple-500">
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">
            Alta Prioridade
          </p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">
            {stats?.highPriorityCompleted || 0}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            concluídas
          </p>
        </div>
      </div>

      {/* Line Chart */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Progresso Semanal
        </h3>
        {data.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
              <XAxis dataKey="date" stroke="#666" />
              <YAxis stroke="#666" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1f2937',
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#fff',
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="completed"
                stroke="#3b82f6"
                strokeWidth={2}
                name="Tarefas Concluídas"
                dot={{ fill: '#3b82f6', r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-gray-500 dark:text-gray-400 text-center py-8">
            Sem dados disponíveis
          </p>
        )}
      </div>

      {/* Bar Chart */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Conclusões por Dia
        </h3>
        {data.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
              <XAxis dataKey="date" stroke="#666" />
              <YAxis stroke="#666" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1f2937',
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#fff',
                }}
              />
              <Bar
                dataKey="completed"
                fill="#10b981"
                name="Tarefas Concluídas"
                radius={[8, 8, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-gray-500 dark:text-gray-400 text-center py-8">
            Sem dados disponíveis
          </p>
        )}
      </div>
    </div>
  );
}
