import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BarChart,LineChart,Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusIcon, TrendingUpIcon, LogInIcon, UserPlusIcon,EditIcon } from 'lucide-react';
import api from '@/utils/api';
import { toast } from 'sonner';

interface DataPoint {
  date: Date;
  value: number;
}

interface stock {
  date: Date;
  value: number;
}
const BarChartBuilder: React.FC = () => {

  const [data, setData] = useState<DataPoint[]>([]);
 
  useEffect(() => {
    const fetchStockData = async () => {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        window.location.href = '/login';
        return;
      }
      try {
        const stockData = await api.get(`/api/v1/get-stock?userId=${userId}`);
        if (stockData.status === 200) {
          const stock = stockData.data.stock || [];
          const formattedData = stock.map((value: stock, index: number) => ({
            date: value.date ? new Date(value.date).toLocaleDateString() : `Day ${index + 1}`,
            value: value.value,
          }));
          setData(formattedData);
        }
      } catch (error) {
        console.error("Error fetching stock data:", error);
      }
    };

    fetchStockData();
  }, []);
  const [inputValue, setInputValue] = useState<string>('');

  const handleAddValue = async() => {
    const numericValue = parseInt(inputValue);
    if (!isNaN(numericValue) && inputValue.trim() !== '') {
      const userId = localStorage.getItem('userId');
      const stockData = await api.post(`/api/v1/add-stock`, {
        userId,
        currentDateStock: numericValue
      });
        if (stockData.status === 200) {
          const stock = stockData.data.stock!
          const formattedData = stock.map((value: stock, index: number) => ({
            date: value.date ? new Date(value.date).toLocaleDateString() : `Day ${index + 1}`,
            value: value.value,
          }));
          console.log("Updated stock data:", formattedData);
          setData([...data,formattedData]);
        }
      setInputValue('');
      
      window.location.href = '/dashboard';
    }else{
      console.error("Invalid input value. Please enter a valid number.");
    }
  };

//   const handleDelete = async (entryId: string) => {
//   const userId = localStorage.getItem('userId');
//   if (!userId) return;

//   try {
//     // either use DELETE with a request body, or POST – whatever your API supports
//     const res = await api.delete('/api/v1/delete-stock', {
//       userId,
//       stockId: entryId,
//     })

//     if (res.status === 200) {
//       setData(data.filter(dp => dp.id !== entryId));
//       toast.success('Entry deleted');
//     }
//   } catch (err) {
//     console.error('Delete failed', err);
//     toast.error('Could not delete entry');
//   }
//  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddValue();
    }
  };

  const userId= localStorage.getItem('userId');
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-elegant">
          <p className="text-card-foreground font-medium">{`${label}`}</p>
          <p className="text-primary font-semibold">
            {`Value: ${payload[0].value}`}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-gradient-bg p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Navigation */}
        {!userId &&
        <div className="flex justify-end gap-3 animate-fade-in">
           <Link to="/login">
            <Button variant="outline" className="h-10 px-4 border-primary/20 text-primary hover:bg-primary/10">
              <LogInIcon className="h-4 w-4 mr-2" />
              Sign In
            </Button>
          </Link>
          <Link to="/signup">
            <Button className="h-10 px-4 bg-primary hover:bg-primary/90 text-primary-foreground shadow-glow">
              <UserPlusIcon className="h-4 w-4 mr-2" />
              Sign Up
            </Button>
          </Link>
        </div>}
        {userId && (
          <div className="flex justify-end animate-fade-in">
            <Link to="/login" onClick={() => localStorage.removeItem('userId')}>
              <Button variant="outline" className="h-10 px-4 border-primary/20 text-primary hover:bg-primary/10">
                <LogInIcon className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </Link>
          </div>
        )}

        {/* Header */}
        <div className="text-center space-y-4 animate-fade-in">
          <div className="flex items-center justify-center gap-3 mb-2">
            <TrendingUpIcon className="h-8 w-8 text-primary" />
            <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Bar Chart Builder
            </h1>
          </div>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Add numeric values to create a beautiful, responsive bar chart that grows with your data
          </p>
        </div>

        {/* Input Section */}
        <Card className="bg-gradient-card shadow-elegant border-border/50 animate-fade-in">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-foreground">Add New Data Point</CardTitle>
            <CardDescription className="text-muted-foreground">
              Enter a number and click Add to create a new bar in your chart
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <Input
                type="number"
                placeholder="Enter a number..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1 h-12 text-center text-lg border-border/50 focus:border-primary focus:ring-primary/20 transition-all duration-300"
              />
              <Button
                onClick={handleAddValue}
                disabled={!inputValue.trim() || isNaN(parseFloat(inputValue))}
                className="h-12 px-6 bg-primary hover:bg-primary/90 text-primary-foreground font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-glow"
              >
                <PlusIcon className="h-5 w-5 mr-2" />
                Add
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Chart Section */}
        <Card className="bg-gradient-card shadow-elegant border-border/50 animate-fade-in">
          <div className="flex items-center justify-between p-4 border-b border-border/20">
            <div className="flex items-center justify-between w-full">

          <CardHeader>
            <CardTitle className="text-xl text-foreground flex items-center gap-2">
              <TrendingUpIcon className="h-5 w-5 text-primary" />
              Data Visualization
              {data.length > 0 && (
                <span className="text-sm bg-primary/10 text-primary px-2 py-1 rounded-full">
                  {data.length} point{data.length !== 1 ? 's' : ''}
                </span>
              )}
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              {data.length === 0 
                ? "Your chart will appear here once you add some data points"
                : "Interactive bar chart showing your data points over time"
              }
            </CardDescription>
          </CardHeader>
            <Button variant="outline" className="h-10 px-4 border-primary/20 text-primary hover:bg-primary/10">
              <EditIcon className="h-4 w-4 mr-2" />
                Edit
            </Button>
            </div>
          </div>
          <CardContent className="pt-4">
            {data.length === 0 ? (
              <div className="h-80 flex items-center justify-center border-2 border-dashed border-border rounded-lg bg-muted/20">
                <div className="text-center space-y-3">
                  <TrendingUpIcon className="h-12 w-12 text-muted-foreground mx-auto" />
                  <p className="text-muted-foreground text-lg font-medium">No data yet</p>
                  <p className="text-muted-foreground/70 text-sm">Add your first value to see the magic happen!</p>
                </div>
              </div>
            ) : (
              <div className="h-80 w-full animate-chart-grow">
                <ResponsiveContainer width="100%" height="100%">
                  {/* <BarChart
                    data={data}
                    margin={{
                      top: 20,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.5} />
                    <XAxis 
                      dataKey="day" 
                      tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                      axisLine={{ stroke: 'hsl(var(--border))' }}
                    />
                    <YAxis 
                      tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                      axisLine={{ stroke: 'hsl(var(--border))' }}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar 
                      dataKey="value" 
                      fill="hsl(var(--chart-primary))"
                      radius={[4, 4, 0, 0]}
                      className="hover:opacity-80 transition-opacity duration-200"
                    />
                  </BarChart> */}
                  <LineChart
                    data={data}
                    margin={{
                      top: 20,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.5} />
                    <XAxis 
                      dataKey="date" 
                      tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                      axisLine={{ stroke: 'hsl(var(--border))' }}
                    />
                    <YAxis 
                      tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                      axisLine={{ stroke: 'hsl(var(--border))' }}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Line 
                      dataKey="value" 
                      fill="hsl(var(--chart-primary))"
                      stroke="hsl(var(--chart-primary))"
                      strokeWidth={2}
                      dot={{ r: 4, fill: 'hsl(var(--chart-primary))', stroke: 'hsl(var(--border))', strokeWidth: 2 }}
                      activeDot={{ r: 6, stroke: 'hsl(var(--chart-primary))', strokeWidth: 2 }}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      isAnimationActive={false}
                      className="hover:opacity-80 transition-opacity duration-200"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Stats */}
        {data.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 animate-fade-in">
            <Card className="bg-gradient-card shadow-elegant border-border/50 text-center">
              <CardContent className="pt-6">
                <div className="text-2xl font-bold text-primary">{data.length}</div>
                <p className="text-muted-foreground text-sm">Total Points</p>
              </CardContent>
            </Card>
            <Card className="bg-gradient-card shadow-elegant border-border/50 text-center">
              <CardContent className="pt-6">
                <div className="text-2xl font-bold text-accent">
                  {Math.max(...data.map(d => d.value)).toFixed(1)}
                </div>
                <p className="text-muted-foreground text-sm">Highest Value</p>
              </CardContent>
            </Card>
            <Card className="bg-gradient-card shadow-elegant border-border/50 text-center">
              <CardContent className="pt-6">
                <div className="text-2xl font-bold text-chart-primary">
                  {(data.reduce((sum, d) => sum + d.value, 0) / data.length).toFixed(1)}
                </div>
                <p className="text-muted-foreground text-sm">Average</p>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default BarChartBuilder;