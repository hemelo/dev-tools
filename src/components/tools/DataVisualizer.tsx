import React, { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart3, PieChart, LineChart, ScatterChart, Upload, Download, Copy, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string;
    borderColor?: string;
  }[];
}

const DataVisualizer = () => {
  const [inputData, setInputData] = useState("");
  const [chartType, setChartType] = useState<"bar" | "line" | "pie" | "scatter">("bar");
  const [xAxis, setXAxis] = useState("");
  const [yAxis, setYAxis] = useState("");
  const [error, setError] = useState("");
  const [parsedData, setParsedData] = useState<any[]>([]);
  const [availableFields, setAvailableFields] = useState<string[]>([]);
  const { toast } = useToast();

  const sampleData = {
    csv: `name,age,salary,department
John,25,50000,Engineering
Jane,30,60000,Marketing
Bob,35,70000,Engineering
Alice,28,55000,Design
Charlie,32,65000,Marketing`,
    json: `[
  {"name": "John", "age": 25, "salary": 50000, "department": "Engineering"},
  {"name": "Jane", "age": 30, "salary": 60000, "department": "Marketing"},
  {"name": "Bob", "age": 35, "salary": 70000, "department": "Engineering"},
  {"name": "Alice", "age": 28, "salary": 55000, "department": "Design"},
  {"name": "Charlie", "age": 32, "salary": 65000, "department": "Marketing"}
]`
  };

  const parseData = (data: string) => {
    setError("");
    try {
      let parsed: any[] = [];
      
      // Try to parse as JSON first
      try {
        parsed = JSON.parse(data);
        if (!Array.isArray(parsed)) {
          throw new Error("JSON data must be an array of objects");
        }
      } catch {
        // Try to parse as CSV
        const lines = data.trim().split('\n');
        if (lines.length < 2) {
          throw new Error("CSV data must have at least a header and one data row");
        }
        
        const headers = lines[0].split(',').map(h => h.trim());
        parsed = lines.slice(1).map(line => {
          const values = line.split(',').map(v => v.trim());
          const obj: any = {};
          headers.forEach((header, index) => {
            const value = values[index] || '';
            // Try to parse as number
            const numValue = parseFloat(value);
            obj[header] = isNaN(numValue) ? value : numValue;
          });
          return obj;
        });
      }
      
      setParsedData(parsed);
      setAvailableFields(Object.keys(parsed[0] || {}));
      
      if (parsed.length > 0) {
        setXAxis(Object.keys(parsed[0])[0]);
        setYAxis(Object.keys(parsed[0])[1] || Object.keys(parsed[0])[0]);
      }
      
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to parse data");
      setParsedData([]);
      setAvailableFields([]);
    }
  };

  const chartData = useMemo((): ChartData | null => {
    if (parsedData.length === 0 || !xAxis || !yAxis) return null;

    const labels = parsedData.map(item => String(item[xAxis]));
    const data = parsedData.map(item => {
      const value = item[yAxis];
      return typeof value === 'number' ? value : 0;
    });

    const colors = [
      '#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6',
      '#EC4899', '#06B6D4', '#84CC16', '#F97316', '#6366F1'
    ];

    return {
      labels,
      datasets: [{
        label: yAxis,
        data,
        backgroundColor: chartType === 'pie' ? colors.slice(0, labels.length) : colors[0] + '80',
        borderColor: colors[0],
      }]
    };
  }, [parsedData, xAxis, yAxis, chartType]);

  const generateChart = () => {
    if (!chartData) return;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = 800;
    canvas.height = 400;

    // Simple chart rendering
    const padding = 60;
    const chartWidth = canvas.width - 2 * padding;
    const chartHeight = canvas.height - 2 * padding;

    // Clear canvas
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw axes
    ctx.strokeStyle = '#374151';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, canvas.height - padding);
    ctx.lineTo(canvas.width - padding, canvas.height - padding);
    ctx.stroke();

    if (chartType === 'bar') {
      const barWidth = chartWidth / chartData.labels.length * 0.8;
      const maxValue = Math.max(...chartData.datasets[0].data);
      
      chartData.labels.forEach((label, index) => {
        const value = chartData.datasets[0].data[index];
        const barHeight = (value / maxValue) * chartHeight;
        const x = padding + (index * chartWidth / chartData.labels.length) + (chartWidth / chartData.labels.length - barWidth) / 2;
        const y = canvas.height - padding - barHeight;
        
        ctx.fillStyle = chartData.datasets[0].backgroundColor || '#3B82F6';
        ctx.fillRect(x, y, barWidth, barHeight);
        
        // Label
        ctx.fillStyle = '#374151';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(label, x + barWidth / 2, canvas.height - padding + 20);
      });
    } else if (chartType === 'line') {
      const maxValue = Math.max(...chartData.datasets[0].data);
      const stepX = chartWidth / (chartData.labels.length - 1);
      
      ctx.strokeStyle = chartData.datasets[0].borderColor || '#3B82F6';
      ctx.lineWidth = 3;
      ctx.beginPath();
      
      chartData.labels.forEach((label, index) => {
        const value = chartData.datasets[0].data[index];
        const x = padding + index * stepX;
        const y = canvas.height - padding - (value / maxValue) * chartHeight;
        
        if (index === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
        
        // Data point
        ctx.fillStyle = chartData.datasets[0].borderColor || '#3B82F6';
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, 2 * Math.PI);
        ctx.fill();
      });
      
      ctx.stroke();
    } else if (chartType === 'pie') {
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const radius = Math.min(chartWidth, chartHeight) / 2 - 20;
      const total = chartData.datasets[0].data.reduce((sum, value) => sum + value, 0);
      
      let currentAngle = 0;
      chartData.labels.forEach((label, index) => {
        const value = chartData.datasets[0].data[index];
        const sliceAngle = (value / total) * 2 * Math.PI;
        
        ctx.fillStyle = chartData.datasets[0].backgroundColor?.[index] || '#3B82F6';
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + sliceAngle);
        ctx.closePath();
        ctx.fill();
        
        // Label
        const labelAngle = currentAngle + sliceAngle / 2;
        const labelX = centerX + Math.cos(labelAngle) * (radius + 30);
        const labelY = centerY + Math.sin(labelAngle) * (radius + 30);
        
        ctx.fillStyle = '#374151';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(`${label}: ${value}`, labelX, labelY);
        
        currentAngle += sliceAngle;
      });
    }

    // Download chart
    const link = document.createElement('a');
    link.download = `chart-${chartType}-${Date.now()}.png`;
    link.href = canvas.toDataURL();
    link.click();
    
    toast({
      title: "Success!",
      description: "Chart downloaded successfully!",
    });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "Text copied to clipboard!",
    });
  };

  const loadSampleData = (type: 'csv' | 'json') => {
    setInputData(sampleData[type]);
    parseData(sampleData[type]);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold mb-2">Data Visualizer</h2>
        <p className="text-muted-foreground">
          Upload CSV or JSON data and create interactive charts
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Data Input
            </CardTitle>
            <CardDescription>
              Paste your CSV or JSON data below
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            
            <div>
              <Label htmlFor="data-input">Data</Label>
              <Textarea
                id="data-input"
                placeholder="Paste your CSV or JSON data here..."
                value={inputData}
                onChange={(e) => setInputData(e.target.value)}
                className="min-h-[200px] font-mono text-sm"
              />
            </div>

            <Button
              onClick={() => parseData(inputData)}
              disabled={!inputData.trim()}
              className="w-full"
            >
              Parse Data
            </Button>

            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
                <span className="text-red-600 dark:text-red-400 text-sm">{error}</span>
              </div>
            )}

            {parsedData.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">
                    {parsedData.length} rows
                  </Badge>
                  <Badge variant="secondary">
                    {availableFields.length} fields
                  </Badge>
                </div>
                
                <div className="text-sm text-muted-foreground">
                  <strong>Available fields:</strong> {availableFields.join(', ')}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Chart Configuration
            </CardTitle>
            <CardDescription>
              Configure your chart settings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="chart-type">Chart Type</Label>
              <Select value={chartType} onValueChange={(value: any) => setChartType(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bar">
                    <div className="flex items-center gap-2">
                      <BarChart3 className="h-4 w-4" />
                      Bar Chart
                    </div>
                  </SelectItem>
                  <SelectItem value="line">
                    <div className="flex items-center gap-2">
                      <LineChart className="h-4 w-4" />
                      Line Chart
                    </div>
                  </SelectItem>
                  <SelectItem value="pie">
                    <div className="flex items-center gap-2">
                      <PieChart className="h-4 w-4" />
                      Pie Chart
                    </div>
                  </SelectItem>
                  <SelectItem value="scatter">
                    <div className="flex items-center gap-2">
                      <ScatterChart className="h-4 w-4" />
                      Scatter Plot
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {availableFields.length > 0 && (
              <>
                <div>
                  <Label htmlFor="x-axis">X-Axis / Labels</Label>
                  <Select value={xAxis} onValueChange={setXAxis}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {availableFields.map(field => (
                        <SelectItem key={field} value={field}>{field}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="y-axis">Y-Axis / Values</Label>
                  <Select value={yAxis} onValueChange={setYAxis}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {availableFields.map(field => (
                        <SelectItem key={field} value={field}>{field}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}

            <Button
              onClick={generateChart}
              disabled={!chartData}
              className="w-full"
            >
              <Download className="h-4 w-4 mr-2" />
              Generate & Download Chart
            </Button>
          </CardContent>
        </Card>
      </div>

      {parsedData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Data Preview</CardTitle>
            <CardDescription>
              First 5 rows of your parsed data
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300 dark:border-gray-600">
                <thead>
                  <tr className="bg-gray-50 dark:bg-gray-800">
                    {availableFields.map(field => (
                      <th key={field} className="border border-gray-300 dark:border-gray-600 px-3 py-2 text-left font-medium">
                        {field}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {parsedData.slice(0, 5).map((row, index) => (
                    <tr key={index}>
                      {availableFields.map(field => (
                        <td key={field} className="border border-gray-300 dark:border-gray-600 px-3 py-2">
                          {row[field]}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {parsedData.length > 5 && (
              <div className="mt-2 text-sm text-muted-foreground">
                Showing 5 of {parsedData.length} rows
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Quick Examples */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Examples</CardTitle>
          <CardDescription>Click on any example to load it</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium">CSV Data</Label>
              <div className="space-y-1">
                {[
                  { 
                    name: "Sales Data", 
                    data: `name,age,salary,department
John,25,50000,Engineering
Jane,30,60000,Marketing
Bob,35,70000,Engineering
Alice,28,55000,Design` 
                  },
                  { 
                    name: "Product Inventory", 
                    data: `product,price,stock,category
Laptop,999.99,50,Electronics
Mouse,29.99,200,Accessories
Keyboard,79.99,150,Accessories
Monitor,299.99,75,Electronics` 
                  }
                ].map((example, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => loadSampleData('csv')}
                    className="w-full justify-start text-xs"
                  >
                    {example.name}
                  </Button>
                ))}
              </div>
            </div>
            
            <div className="space-y-2">
              <Label className="text-sm font-medium">JSON Data</Label>
              <div className="space-y-1">
                {[
                  { 
                    name: "User Analytics", 
                    data: `[
  {"month": "Jan", "users": 1200, "revenue": 15000},
  {"month": "Feb", "users": 1350, "revenue": 18000},
  {"month": "Mar", "users": 1100, "revenue": 12000},
  {"month": "Apr", "users": 1600, "revenue": 22000}
]` 
                  },
                  { 
                    name: "Survey Results", 
                    data: `[
  {"question": "Satisfaction", "rating": 4.5, "responses": 150},
  {"question": "Ease of Use", "rating": 4.2, "responses": 148},
  {"question": "Performance", "rating": 4.8, "responses": 152},
  {"question": "Support", "rating": 4.1, "responses": 145}
]` 
                  }
                ].map((example, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => loadSampleData('json')}
                    className="w-full justify-start text-xs"
                  >
                    {example.name}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DataVisualizer;
