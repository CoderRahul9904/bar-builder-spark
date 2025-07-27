import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusIcon, TrendingUpIcon } from 'lucide-react';

interface DataPoint {
  day: string;
  value: number;
}

const BarChartBuilder: React.FC = () => {
  const [data, setData] = useState<DataPoint[]>([]);
  const [inputValue, setInputValue] = useState<string>('');

  const handleAddValue = () => {
    const numericValue = parseFloat(inputValue);
    
    if (!isNaN(numericValue) && inputValue.trim() !== '') {
      const newDataPoint: DataPoint = {
        day: `Day ${data.length + 1}`,
        value: numericValue,
      };
      
      setData([...data, newDataPoint]);
      setInputValue('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddValue();
    }
  };

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
                  <BarChart
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
                  </BarChart>
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