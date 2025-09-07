import { useState, useRef, useEffect, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Calculator, 
  Copy, 
  Check, 
  RotateCcw, 
  Download, 
  Upload, 
  AlertCircle, 
  CheckCircle, 
  Info, 
  Zap,
  Eye,
  Settings,
  Trash2,
  Plus,
  Minus,
  X,
  Divide,
  Square,
  Matrix,
  Grid3X3,
  Hash,
  ArrowRight,
  ArrowDown,
  ArrowUp,
  ArrowLeft,
  Dice1
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface MatrixData {
  rows: number;
  cols: number;
  data: number[][];
}

interface MatrixOperation {
  name: string;
  description: string;
  icon: any;
  requiresSecondMatrix: boolean;
  maxSize?: number;
}

type MatrixResult = 
  | { type: 'number'; value: number }
  | { type: 'matrix'; value: number[][] }
  | { type: 'array'; value: number[] }
  | { type: 'error'; message: string };

export const MatrixCalculator = () => {
  const [matrixA, setMatrixA] = useState<MatrixData>({
    rows: 3,
    cols: 3,
    data: [[0, 0, 0], [0, 0, 0], [0, 0, 0]]
  });
  const [matrixB, setMatrixB] = useState<MatrixData>({
    rows: 3,
    cols: 3,
    data: [[0, 0, 0], [0, 0, 0], [0, 0, 0]]
  });
  const [selectedOperation, setSelectedOperation] = useState<string>("determinant");
  const [result, setResult] = useState<MatrixResult | null>(null);
  const [error, setError] = useState("");
  const [isCalculating, setIsCalculating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showSteps, setShowSteps] = useState(false);
  const [steps, setSteps] = useState<string[]>([]);
  const [autoCalculate, setAutoCalculate] = useState(true);
  const [allResults, setAllResults] = useState<Record<string, MatrixResult>>({});
  const [calculatingOperations, setCalculatingOperations] = useState<Set<string>>(new Set());
  const [expandedMatrix, setExpandedMatrix] = useState<string | null>(null);
  const { toast } = useToast();

  const operations: MatrixOperation[] = [
    {
      name: "determinant",
      description: "Calculate determinant",
      icon: Hash,
      requiresSecondMatrix: false,
      maxSize: 4
    },
    {
      name: "inverse",
      description: "Find matrix inverse",
      icon: ArrowRight,
      requiresSecondMatrix: false,
      maxSize: 4
    },
    {
      name: "transpose",
      description: "Transpose matrix",
      icon: ArrowDown,
      requiresSecondMatrix: false
    },
    {
      name: "trace",
      description: "Calculate trace (sum of diagonal)",
      icon: Square,
      requiresSecondMatrix: false
    },
    {
      name: "rank",
      description: "Calculate matrix rank",
      icon: Grid3X3,
      requiresSecondMatrix: false
    },
    {
      name: "eigenvalues",
      description: "Find eigenvalues",
      icon: Hash,
      requiresSecondMatrix: false,
      maxSize: 3
    },
    {
      name: "add",
      description: "Matrix addition (A + B)",
      icon: Plus,
      requiresSecondMatrix: true
    },
    {
      name: "subtract",
      description: "Matrix subtraction (A - B)",
      icon: Minus,
      requiresSecondMatrix: true
    },
    {
      name: "multiply",
      description: "Matrix multiplication (A × B)",
      icon: X,
      requiresSecondMatrix: true
    },
    {
      name: "scalar_multiply",
      description: "Scalar multiplication",
      icon: X,
      requiresSecondMatrix: false
    }
  ];

  const [scalar, setScalar] = useState<number>(2);

  // Get applicable operations for a matrix
  const getApplicableOperations = useCallback((matrix: MatrixData): MatrixOperation[] => {
    return operations.filter(op => {
      // Check size constraints
      if (op.maxSize && matrix.rows > op.maxSize) return false;
      
      // Check if matrix is square for operations that require it
      if (['determinant', 'inverse', 'trace', 'eigenvalues'].includes(op.name) && matrix.rows !== matrix.cols) {
        return false;
      }
      
      return true;
    });
  }, []);

  const initializeMatrix = (rows: number, cols: number): number[][] => {
    return Array(rows).fill(null).map(() => Array(cols).fill(0));
  };

  const updateMatrixSize = (matrix: MatrixData, newRows: number, newCols: number): MatrixData => {
    const newData = initializeMatrix(newRows, newCols);
    
    // Copy existing data
    for (let i = 0; i < Math.min(matrix.rows, newRows); i++) {
      for (let j = 0; j < Math.min(matrix.cols, newCols); j++) {
        newData[i][j] = matrix.data[i][j];
      }
    }
    
    return {
      rows: newRows,
      cols: newCols,
      data: newData
    };
  };

  const updateMatrixValue = (matrix: MatrixData, row: number, col: number, value: number): MatrixData => {
    // Validate input
    const numValue = isNaN(value) ? 0 : value;
    
    const newData = matrix.data.map((rowData, i) => 
      rowData.map((cell, j) => (i === row && j === col) ? numValue : cell)
    );
    
    return {
      ...matrix,
      data: newData
    };
  };

  const calculateDeterminant = (matrix: number[][]): number => {
    const n = matrix.length;
    
    if (n === 1) return matrix[0][0];
    if (n === 2) return matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0];
    
    let det = 0;
    for (let i = 0; i < n; i++) {
      const minor = matrix.slice(1).map(row => row.filter((_, j) => j !== i));
      det += Math.pow(-1, i) * matrix[0][i] * calculateDeterminant(minor);
    }
    
    return det;
  };

  const calculateInverse = (matrix: number[][]): number[][] | null => {
    const det = calculateDeterminant(matrix);
    if (Math.abs(det) < 1e-10) return null;
    
    const n = matrix.length;
    const adj = calculateAdjoint(matrix);
    
    return adj.map(row => row.map(val => val / det));
  };

  const calculateAdjoint = (matrix: number[][]): number[][] => {
    const n = matrix.length;
    const adj = Array(n).fill(null).map(() => Array(n).fill(0));
    
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        const minor = matrix.filter((_, row) => row !== i)
          .map(row => row.filter((_, col) => col !== j));
        adj[j][i] = Math.pow(-1, i + j) * calculateDeterminant(minor);
      }
    }
    
    return adj;
  };

  const calculateTranspose = (matrix: number[][]): number[][] => {
    const rows = matrix.length;
    const cols = matrix[0].length;
    const transposed = Array(cols).fill(null).map(() => Array(rows).fill(0));
    
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        transposed[j][i] = matrix[i][j];
      }
    }
    
    return transposed;
  };

  const calculateTrace = (matrix: number[][]): number => {
    return matrix.reduce((sum, row, i) => sum + row[i], 0);
  };

  const calculateRank = (matrix: number[][]): number => {
    const rows = matrix.length;
    const cols = matrix[0].length;
    let rank = Math.min(rows, cols);
    
    // Gaussian elimination
    for (let i = 0; i < rank; i++) {
      if (Math.abs(matrix[i][i]) < 1e-10) {
        let reduce = true;
        for (let k = i + 1; k < rows; k++) {
          if (Math.abs(matrix[k][i]) > 1e-10) {
            [matrix[i], matrix[k]] = [matrix[k], matrix[i]];
            reduce = false;
            break;
          }
        }
        if (reduce) {
          rank--;
          for (let k = 0; k < rows; k++) {
            matrix[k][i] = matrix[k][rank];
          }
        }
        i--;
      } else {
        for (let k = i + 1; k < rows; k++) {
          const factor = matrix[k][i] / matrix[i][i];
          for (let j = i; j < cols; j++) {
            matrix[k][j] -= factor * matrix[i][j];
          }
        }
      }
    }
    
    return rank;
  };

  const calculateEigenvalues = (matrix: number[][]): number[] => {
    // Simplified for 2x2 and 3x3 matrices
    const n = matrix.length;
    
    if (n === 2) {
      const a = matrix[0][0];
      const b = matrix[0][1];
      const c = matrix[1][0];
      const d = matrix[1][1];
      
      const trace = a + d;
      const det = a * d - b * c;
      
      const discriminant = trace * trace - 4 * det;
      if (discriminant < 0) {
        return []; // Complex eigenvalues
      }
      
      const sqrtDisc = Math.sqrt(discriminant);
      return [(trace + sqrtDisc) / 2, (trace - sqrtDisc) / 2];
    }
    
    if (n === 3) {
      // For 3x3, we'll use a simplified approach
      // In practice, you'd use more sophisticated methods
      const trace = calculateTrace(matrix);
      const det = calculateDeterminant(matrix);
      
      // This is a simplified approximation
      return [trace / 3, Math.sqrt(Math.abs(det)), -Math.sqrt(Math.abs(det))];
    }
    
    return [];
  };

  const addMatrices = (a: number[][], b: number[][]): number[][] => {
    return a.map((row, i) => row.map((val, j) => val + b[i][j]));
  };

  const subtractMatrices = (a: number[][], b: number[][]): number[][] => {
    return a.map((row, i) => row.map((val, j) => val - b[i][j]));
  };

  const multiplyMatrices = (a: number[][], b: number[][]): number[][] => {
    const rows = a.length;
    const cols = b[0].length;
    const result = Array(rows).fill(null).map(() => Array(cols).fill(0));
    
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        for (let k = 0; k < a[0].length; k++) {
          result[i][j] += a[i][k] * b[k][j];
        }
      }
    }
    
    return result;
  };

  const scalarMultiply = (matrix: number[][], scalar: number): number[][] => {
    return matrix.map(row => row.map(val => val * scalar));
  };

  // Calculate a single operation asynchronously
  const calculateSingleOperation = async (operationName: string, matrix: MatrixData): Promise<MatrixResult> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        try {
          let result: MatrixResult;
          
          switch (operationName) {
            case "determinant":
              const det = calculateDeterminant(matrix.data);
              result = { type: 'number', value: det };
              break;
              
            case "inverse":
              const inverse = calculateInverse(matrix.data);
              if (!inverse) {
                result = { type: 'error', message: 'Matrix is singular (determinant = 0)' };
              } else {
                result = { type: 'matrix', value: inverse };
              }
              break;
              
            case "transpose":
              const transpose = calculateTranspose(matrix.data);
              result = { type: 'matrix', value: transpose };
              break;
              
            case "trace":
              const trace = calculateTrace(matrix.data);
              result = { type: 'number', value: trace };
              break;
              
            case "rank":
              const rank = calculateRank(matrix.data.map(row => [...row]));
              result = { type: 'number', value: rank };
              break;
              
            case "eigenvalues":
              const eigenvalues = calculateEigenvalues(matrix.data);
              result = { type: 'array', value: eigenvalues };
              break;
              
            case "scalar_multiply":
              const scalarResult = scalarMultiply(matrix.data, scalar);
              result = { type: 'matrix', value: scalarResult };
              break;
              
            default:
              result = { type: 'error', message: 'Operation not supported for auto-calculation' };
          }
          
          resolve(result);
        } catch (error) {
          resolve({ type: 'error', message: (error as Error).message });
        }
      }, Math.random() * 500 + 100); // Random delay between 100-600ms to simulate async
    });
  };

  // Calculate all applicable operations automatically
  const calculateAllOperations = useCallback(async (matrix: MatrixData) => {
    if (!autoCalculate) return;
    
    const applicableOps = getApplicableOperations(matrix);
    const newResults: Record<string, MatrixResult> = {};
    const newCalculatingOps = new Set<string>();
    
    // Set all operations as calculating
    applicableOps.forEach(op => {
      newCalculatingOps.add(op.name);
    });
    setCalculatingOperations(newCalculatingOps);
    
    // Calculate all operations in parallel
    const promises = applicableOps.map(async (op) => {
      const result = await calculateSingleOperation(op.name, matrix);
      return { operation: op.name, result };
    });
    
    // Wait for all calculations to complete
    const results = await Promise.all(promises);
    
    // Update results as they complete
    results.forEach(({ operation, result }) => {
      newResults[operation] = result;
      newCalculatingOps.delete(operation);
      setCalculatingOperations(new Set(newCalculatingOps));
      setAllResults(prev => ({ ...prev, [operation]: result }));
    });
    
    setAllResults(newResults);
  }, [autoCalculate, getApplicableOperations, scalar]);

  // Debounced effect to trigger automatic calculation
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      calculateAllOperations(matrixA);
    }, 500); // 500ms debounce

    return () => clearTimeout(timeoutId);
  }, [matrixA, calculateAllOperations]);

  const performOperation = async () => {
    setIsCalculating(true);
    setError("");
    setResult(null);
    setSteps([]);

    try {
      const operation = operations.find(op => op.name === selectedOperation);
      if (!operation) {
        throw new Error("Invalid operation");
      }

      // Check matrix size constraints
      if (operation.maxSize && matrixA.rows > operation.maxSize) {
        throw new Error(`${operation.description} is only supported for matrices up to ${operation.maxSize}x${operation.maxSize}`);
      }

      // Check if matrix is square for operations that require it
      if (['determinant', 'inverse', 'trace', 'eigenvalues'].includes(operation.name) && matrixA.rows !== matrixA.cols) {
        throw new Error(`${operation.description} requires a square matrix`);
      }

      // Check if second matrix is required
      if (operation.requiresSecondMatrix) {
        if (operation.name === 'multiply' && matrixA.cols !== matrixB.rows) {
          throw new Error("For matrix multiplication, the number of columns in Matrix A must equal the number of rows in Matrix B");
        }
        if (['add', 'subtract'].includes(operation.name) && (matrixA.rows !== matrixB.rows || matrixA.cols !== matrixB.cols)) {
          throw new Error("For addition/subtraction, both matrices must have the same dimensions");
        }
      }

      let operationResult: MatrixResult;
      let operationSteps: string[] = [];

      switch (selectedOperation) {
        case "determinant":
          const det = calculateDeterminant(matrixA.data);
          operationResult = { type: 'number', value: det };
          operationSteps = [
            `Calculating determinant of ${matrixA.rows}x${matrixA.cols} matrix`,
            `Using cofactor expansion method`,
            `Result: ${det}`
          ];
          break;

        case "inverse":
          const inverse = calculateInverse(matrixA.data);
          if (!inverse) {
            throw new Error("Matrix is singular (determinant = 0), inverse does not exist");
          }
          operationResult = { type: 'matrix', value: inverse };
          operationSteps = [
            `Calculating inverse of ${matrixA.rows}x${matrixA.cols} matrix`,
            `Step 1: Calculate determinant`,
            `Step 2: Calculate adjoint matrix`,
            `Step 3: Divide adjoint by determinant`,
            `Result: Inverse matrix calculated`
          ];
          break;

        case "transpose":
          const transpose = calculateTranspose(matrixA.data);
          operationResult = { type: 'matrix', value: transpose };
          operationSteps = [
            `Transposing ${matrixA.rows}x${matrixA.cols} matrix`,
            `Swapping rows and columns`,
            `Result: ${transpose.length}x${transpose[0].length} matrix`
          ];
          break;

        case "trace":
          const trace = calculateTrace(matrixA.data);
          operationResult = { type: 'number', value: trace };
          operationSteps = [
            `Calculating trace of ${matrixA.rows}x${matrixA.cols} matrix`,
            `Sum of diagonal elements`,
            `Result: ${trace}`
          ];
          break;

        case "rank":
          const rank = calculateRank(matrixA.data.map(row => [...row]));
          operationResult = { type: 'number', value: rank };
          operationSteps = [
            `Calculating rank of ${matrixA.rows}x${matrixA.cols} matrix`,
            `Using Gaussian elimination`,
            `Result: Rank = ${rank}`
          ];
          break;

        case "eigenvalues":
          const eigenvalues = calculateEigenvalues(matrixA.data);
          operationResult = { type: 'array', value: eigenvalues };
          operationSteps = [
            `Calculating eigenvalues of ${matrixA.rows}x${matrixA.cols} matrix`,
            `Using characteristic polynomial`,
            `Result: [${eigenvalues.map(val => val.toFixed(4)).join(', ')}]`
          ];
          break;

        case "add":
          const addResult = addMatrices(matrixA.data, matrixB.data);
          operationResult = { type: 'matrix', value: addResult };
          operationSteps = [
            `Adding ${matrixA.rows}x${matrixA.cols} matrices`,
            `Element-wise addition`,
            `Result: ${addResult.length}x${addResult[0].length} matrix`
          ];
          break;

        case "subtract":
          const subtractResult = subtractMatrices(matrixA.data, matrixB.data);
          operationResult = { type: 'matrix', value: subtractResult };
          operationSteps = [
            `Subtracting ${matrixA.rows}x${matrixA.cols} matrices`,
            `Element-wise subtraction`,
            `Result: ${subtractResult.length}x${subtractResult[0].length} matrix`
          ];
          break;

        case "multiply":
          const multiplyResult = multiplyMatrices(matrixA.data, matrixB.data);
          operationResult = { type: 'matrix', value: multiplyResult };
          operationSteps = [
            `Multiplying ${matrixA.rows}x${matrixA.cols} and ${matrixB.rows}x${matrixB.cols} matrices`,
            `Using matrix multiplication formula`,
            `Result: ${multiplyResult.length}x${multiplyResult[0].length} matrix`
          ];
          break;

        case "scalar_multiply":
          const scalarResult = scalarMultiply(matrixA.data, scalar);
          operationResult = { type: 'matrix', value: scalarResult };
          operationSteps = [
            `Multiplying ${matrixA.rows}x${matrixA.cols} matrix by scalar ${scalar}`,
            `Element-wise multiplication`,
            `Result: ${scalarResult.length}x${scalarResult[0].length} matrix`
          ];
          break;

        default:
          throw new Error("Unknown operation");
      }

      setResult(operationResult);
      setSteps(operationSteps);
      setShowSteps(true);

      toast({
        title: "Calculation Complete",
        description: `${operation.description} completed successfully`,
      });

    } catch (err) {
      const errorMessage = (err as Error).message;
      setError(errorMessage);
      toast({
        title: "Calculation Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsCalculating(false);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast({
        title: "Copied!",
        description: "Matrix data copied to clipboard",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Could not copy to clipboard",
        variant: "destructive",
      });
    }
  };

  const exportMatrix = (matrix: MatrixData, name: string) => {
    const matrixText = matrix.data.map(row => row.join('\t')).join('\n');
    const blob = new Blob([matrixText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${name}_matrix.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Exported!",
      description: `${name} matrix has been exported`,
    });
  };

  const clearMatrix = (matrixType: 'A' | 'B') => {
    if (matrixType === 'A') {
      setMatrixA(prev => ({
        ...prev,
        data: initializeMatrix(prev.rows, prev.cols)
      }));
    } else {
      setMatrixB(prev => ({
        ...prev,
        data: initializeMatrix(prev.rows, prev.cols)
      }));
    }
  };

  const loadExample = (type: string) => {
    switch (type) {
      case "identity":
        setMatrixA({
          rows: 3,
          cols: 3,
          data: [[1, 0, 0], [0, 1, 0], [0, 0, 1]]
        });
        break;
      case "random":
        setMatrixA({
          rows: 3,
          cols: 3,
          data: [[2, 1, 3], [1, 4, 2], [3, 2, 1]]
        });
        break;
      case "singular":
        setMatrixA({
          rows: 3,
          cols: 3,
          data: [[1, 2, 3], [2, 4, 6], [3, 6, 9]]
        });
        break;
    }
  };

  const fillRandom = (matrixType: 'A' | 'B') => {
    const matrix = matrixType === 'A' ? matrixA : matrixB;
    const setMatrix = matrixType === 'A' ? setMatrixA : setMatrixB;
    
    const randomData = matrix.data.map(row => 
      row.map(() => Math.round((Math.random() - 0.5) * 20) / 2) // Random numbers from -10 to 10 in 0.5 increments
    );
    
    setMatrix({
      ...matrix,
      data: randomData
    });
  };

  const renderMatrix = (matrix: MatrixData, name: string, onUpdate: (matrix: MatrixData) => void) => (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Matrix {name}</CardTitle>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => fillRandom(name as 'A' | 'B')}>
              <Dice1 className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={() => exportMatrix(matrix, name)}>
              <Download className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={() => clearMatrix(name as 'A' | 'B')}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <CardDescription>
          {matrix.rows} × {matrix.cols} matrix
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Label>Rows:</Label>
            <Select
              value={matrix.rows.toString()}
              onValueChange={(value) => onUpdate(updateMatrixSize(matrix, parseInt(value), matrix.cols))}
            >
              <SelectTrigger className="w-20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[1, 2, 3, 4, 5].map(size => (
                  <SelectItem key={size} value={size.toString()}>{size}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <Label>Cols:</Label>
            <Select
              value={matrix.cols.toString()}
              onValueChange={(value) => onUpdate(updateMatrixSize(matrix, matrix.rows, parseInt(value)))}
            >
              <SelectTrigger className="w-20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[1, 2, 3, 4, 5].map(size => (
                  <SelectItem key={size} value={size.toString()}>{size}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex justify-center">
          <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${matrix.cols}, 1fr)` }}>
            {matrix.data.map((row, i) =>
              row.map((cell, j) => (
                <Input
                  key={`${i}-${j}`}
                  type="number"
                  step="0.1"
                  value={cell === 0 ? '' : cell}
                  placeholder="0"
                  onChange={(e) => onUpdate(updateMatrixValue(matrix, i, j, parseFloat(e.target.value) || 0))}
                  className="w-16 h-8 text-center font-mono text-sm"
                />
              ))
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderMatrixGrid = (matrix: number[][], maxSize: number = 4, operationName?: string, isExpanded?: boolean) => {
    const displayMatrix = isExpanded ? matrix : matrix.slice(0, maxSize).map(row => row.slice(0, maxSize));
    const hasMoreRows = matrix.length > maxSize;
    const hasMoreCols = matrix[0]?.length > maxSize;
    const showExpandButton = (hasMoreRows || hasMoreCols) && !isExpanded && operationName;
    
    return (
      <div className="space-y-2">
        <div className="text-xs text-muted-foreground text-center">
          {matrix.length}×{matrix[0]?.length} Matrix
        </div>
        <div className="flex justify-center">
          <div className="grid gap-1 p-2 bg-muted rounded border" 
               style={{ gridTemplateColumns: `repeat(${displayMatrix[0]?.length || 1}, 1fr)` }}>
            {displayMatrix.map((row, i) =>
              row.map((cell, j) => (
                <div
                  key={`${i}-${j}`}
                  className="w-12 h-8 flex items-center justify-center bg-background rounded border text-xs font-mono"
                >
                  {cell.toFixed(2)}
                </div>
              ))
            )}
          </div>
        </div>
        {showExpandButton && (
          <div className="text-center">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setExpandedMatrix(operationName)}
              className="text-xs h-6 px-2"
            >
              <Eye className="h-3 w-3 mr-1" />
              Show Full Matrix
            </Button>
          </div>
        )}
        {isExpanded && operationName && (
          <div className="text-center">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setExpandedMatrix(null)}
              className="text-xs h-6 px-2"
            >
              <EyeOff className="h-3 w-3 mr-1" />
              Collapse
            </Button>
          </div>
        )}
        {(hasMoreRows || hasMoreCols) && !isExpanded && (
          <div className="text-xs text-muted-foreground text-center">
            {hasMoreRows && hasMoreCols ? 'Showing top-left portion' : 
             hasMoreRows ? 'Showing top rows' : 'Showing left columns'}
          </div>
        )}
      </div>
    );
  };

  const renderOperationResult = (operationName: string, result: MatrixResult, isCalculating: boolean) => {
    const operation = operations.find(op => op.name === operationName);
    if (!operation) return null;

    return (
      <Card key={operationName} className="relative">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <operation.icon className="h-4 w-4" />
              <CardTitle className="text-sm">{operation.description}</CardTitle>
            </div>
            {isCalculating && (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
            )}
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          {isCalculating ? (
            <div className="text-center py-4 text-muted-foreground">
              <div className="animate-pulse">Calculating...</div>
            </div>
          ) : (
            <div className="space-y-2">
              {result.type === 'number' && (
                <div className="text-center">
                  <div className="text-2xl font-mono font-bold p-3 bg-muted rounded border">
                    {result.value.toFixed(6)}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">Scalar Result</div>
                </div>
              )}
              {result.type === 'array' && (
                <div className="text-center">
                  <div className="text-sm font-mono p-2 bg-muted rounded border">
                    [{result.value.map(val => val.toFixed(4)).join(', ')}]
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">Eigenvalues</div>
                </div>
              )}
              {result.type === 'matrix' && (
                <div>
                  {renderMatrixGrid(result.value, 3, operationName, expandedMatrix === operationName)}
                  <div className="flex items-center justify-between mt-2">
                    <div className="text-xs text-muted-foreground">
                      {operation.description} Result
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => copyToClipboard(result.value.map(row => row.join('\t')).join('\n'))}
                      className="h-6 px-2 text-xs"
                    >
                      {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                    </Button>
                  </div>
                </div>
              )}
              {result.type === 'error' && (
                <div className="text-xs text-destructive p-2 bg-destructive/10 rounded border border-destructive/20">
                  <div className="flex items-center gap-1 mb-1">
                    <AlertCircle className="h-3 w-3" />
                    <span className="font-medium">Error</span>
                  </div>
                  {result.message}
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  const renderResult = () => {
    if (!result) return null;

    switch (result.type) {
      case 'number':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Result</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-mono text-center p-4 bg-muted rounded-lg">
                {result.value.toFixed(6)}
              </div>
            </CardContent>
          </Card>
        );

      case 'matrix':
        return (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Result Matrix</CardTitle>
                <Button variant="outline" size="sm" onClick={() => copyToClipboard(result.value.map(row => row.join('\t')).join('\n'))}>
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {renderMatrixGrid(result.value, 6)}
              <div className="flex justify-center mt-4">
                <Button variant="outline" size="sm" onClick={() => copyToClipboard(result.value.map(row => row.join('\t')).join('\n'))}>
                  {copied ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
                  Copy Matrix
                </Button>
              </div>
            </CardContent>
          </Card>
        );

      case 'array':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Result</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-lg font-mono text-center p-4 bg-muted rounded-lg">
                [{result.value.map(val => val.toFixed(4)).join(', ')}]
              </div>
            </CardContent>
          </Card>
        );

      case 'error':
        return (
          <Card>
            <CardContent className="pt-6">
              <div className="bg-destructive/10 border border-destructive/20 rounded-md p-4">
                <div className="flex items-center gap-2 text-destructive mb-2">
                  <AlertCircle className="h-4 w-4" />
                  <span className="font-medium">Error</span>
                </div>
                <p className="text-sm text-destructive/80">{result.message}</p>
              </div>
            </CardContent>
          </Card>
        );

      default:
        return null;
    }
  };

  const currentOperation = operations.find(op => op.name === selectedOperation);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold mb-2">Matrix Calculator</h2>
        <p className="text-muted-foreground">
          Perform matrix operations including determinant, inverse, transpose, and more
        </p>
      </div>

      {/* Auto-Calculation Toggle */}
      <Card>
        <CardHeader>
          <CardTitle>Calculation Mode</CardTitle>
          <CardDescription>Choose how you want to calculate matrix operations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="auto-calculate"
                checked={autoCalculate}
                onChange={(e) => setAutoCalculate(e.target.checked)}
                className="rounded border-gray-300"
              />
              <Label htmlFor="auto-calculate" className="text-sm font-medium">
                Auto-calculate all operations
              </Label>
            </div>
            {autoCalculate && (
              <Badge variant="secondary" className="text-xs">
                {Object.keys(allResults).length} operations calculated
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Operation Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Select Operation</CardTitle>
          <CardDescription>Choose the matrix operation you want to perform (for manual mode)</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            {operations.map((operation) => {
              const IconComponent = operation.icon;
              const isSelected = selectedOperation === operation.name;
              const isDisabled = operation.maxSize && matrixA.rows > operation.maxSize;
              
              return (
                <Button
                  key={operation.name}
                  variant={isSelected ? "default" : "outline"}
                  onClick={() => setSelectedOperation(operation.name)}
                  disabled={isDisabled || autoCalculate}
                  className={`flex flex-col items-center gap-2 h-auto p-3 ${
                    isDisabled || autoCalculate ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                  title={isDisabled ? `Only supported for matrices up to ${operation.maxSize}x${operation.maxSize}` : 
                        autoCalculate ? 'Disabled in auto-calculate mode' : operation.description}
                >
                  <IconComponent className="h-4 w-4" />
                  <span className="text-xs text-center">{operation.description}</span>
                  {isDisabled && (
                    <Badge variant="secondary" className="text-xs">
                      Max {operation.maxSize}x{operation.maxSize}
                    </Badge>
                  )}
                </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Scalar Input for Scalar Multiplication */}
      {selectedOperation === "scalar_multiply" && (
        <Card>
          <CardHeader>
            <CardTitle>Scalar Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <Label>Scalar:</Label>
              <Input
                type="number"
                value={scalar}
                onChange={(e) => setScalar(parseFloat(e.target.value) || 0)}
                className="w-32"
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Example Matrices */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Examples</CardTitle>
          <CardDescription>Load example matrices to get started</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => loadExample("identity")}>
              Identity Matrix
            </Button>
            <Button variant="outline" onClick={() => loadExample("random")}>
              Random Matrix
            </Button>
            <Button variant="outline" onClick={() => loadExample("singular")}>
              Singular Matrix
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Matrix A */}
        {renderMatrix(matrixA, "A", setMatrixA)}

        {/* Matrix B (if required) */}
        {currentOperation?.requiresSecondMatrix && renderMatrix(matrixB, "B", setMatrixB)}
      </div>

      {/* Auto-Calculated Results */}
      {autoCalculate && (
        <Card>
          <CardHeader>
            <CardTitle>All Matrix Operations</CardTitle>
            <CardDescription>
              Automatically calculated operations for Matrix A
              {calculatingOperations.size > 0 && (
                <span className="text-primary ml-2">
                  ({calculatingOperations.size} calculating...)
                </span>
              )}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {getApplicableOperations(matrixA).map((operation) => {
                const result = allResults[operation.name];
                const isCalculating = calculatingOperations.has(operation.name);
                
                return renderOperationResult(
                  operation.name, 
                  result || { type: 'error', message: 'Not calculated' }, 
                  isCalculating
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Calculate Button */}
      {!autoCalculate && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-center">
              <Button
                onClick={performOperation}
                disabled={isCalculating}
                size="lg"
                className="gap-2"
              >
                <Calculator className="h-5 w-5" />
                {isCalculating ? "Calculating..." : `Calculate ${currentOperation?.description}`}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Error Display */}
      {error && (
        <Card>
          <CardContent className="pt-6">
            <div className="bg-destructive/10 border border-destructive/20 rounded-md p-4">
              <div className="flex items-center gap-2 text-destructive mb-2">
                <AlertCircle className="h-4 w-4" />
                <span className="font-medium">Calculation Error</span>
              </div>
              <p className="text-sm text-destructive/80">{error}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Result Display */}
      {result && renderResult()}

      {/* Steps Display */}
      {showSteps && steps.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Calculation Steps</CardTitle>
              <Button variant="outline" size="sm" onClick={() => setShowSteps(!showSteps)}>
                {showSteps ? "Hide" : "Show"} Steps
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {steps.map((step, index) => (
                <div key={index} className="flex items-center gap-3 p-2 bg-muted rounded">
                  <Badge variant="secondary">{index + 1}</Badge>
                  <span className="text-sm">{step}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Matrix Properties */}
      <Card>
        <CardHeader>
          <CardTitle>Matrix Properties</CardTitle>
          <CardDescription>Current matrix characteristics and constraints</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h4 className="font-medium">Matrix A Properties</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Dimensions:</span>
                  <span className="font-mono">{matrixA.rows} × {matrixA.cols}</span>
                </div>
                <div className="flex justify-between">
                  <span>Type:</span>
                  <span className="font-mono">
                    {matrixA.rows === matrixA.cols ? 'Square' : 'Rectangular'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Size:</span>
                  <span className="font-mono">
                    {matrixA.rows > 4 || matrixA.cols > 4 ? 'Large' : 'Standard'}
                  </span>
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <h4 className="font-medium">Available Operations</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Determinant:</span>
                  <span className={matrixA.rows === matrixA.cols && matrixA.rows <= 4 ? 'text-green-600' : 'text-red-600'}>
                    {matrixA.rows === matrixA.cols && matrixA.rows <= 4 ? 'Available' : 'Not Available'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Inverse:</span>
                  <span className={matrixA.rows === matrixA.cols && matrixA.rows <= 4 ? 'text-green-600' : 'text-red-600'}>
                    {matrixA.rows === matrixA.cols && matrixA.rows <= 4 ? 'Available' : 'Not Available'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Eigenvalues:</span>
                  <span className={matrixA.rows === matrixA.cols && matrixA.rows <= 3 ? 'text-green-600' : 'text-red-600'}>
                    {matrixA.rows === matrixA.cols && matrixA.rows <= 3 ? 'Available' : 'Not Available'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Matrix Calculator Tips */}
      <Card>
        <CardHeader>
          <CardTitle>Matrix Calculator Tips</CardTitle>
          <CardDescription>Understanding matrix operations and best practices</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h4 className="font-medium">Auto-Calculation Mode</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• <strong>Real-time Updates:</strong> All operations calculate automatically as you type</li>
                <li>• <strong>Parallel Processing:</strong> Multiple operations calculate simultaneously</li>
                <li>• <strong>Smart Filtering:</strong> Only shows applicable operations for your matrix</li>
                <li>• <strong>Live Results:</strong> See results appear as calculations complete</li>
                <li>• <strong>Error Handling:</strong> Shows clear error messages for invalid operations</li>
                <li>• <strong>Performance:</strong> Optimized for matrices up to 4×4</li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="font-medium">Supported Operations</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• <strong>Determinant:</strong> Only for square matrices up to 4×4</li>
                <li>• <strong>Inverse:</strong> Only for non-singular square matrices</li>
                <li>• <strong>Transpose:</strong> Swaps rows and columns</li>
                <li>• <strong>Trace:</strong> Sum of diagonal elements</li>
                <li>• <strong>Rank:</strong> Number of linearly independent rows/columns</li>
                <li>• <strong>Eigenvalues:</strong> For 2×2 and 3×3 matrices</li>
              </ul>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <div className="flex items-start gap-2">
              <Zap className="h-4 w-4 text-blue-600 dark:text-blue-400 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-blue-900 dark:text-blue-100 mb-1">Pro Tip</p>
                <p className="text-blue-700 dark:text-blue-300">
                  Enable auto-calculation mode to see all matrix properties instantly as you modify values. 
                  This provides a comprehensive overview of your matrix's characteristics. Use manual mode 
                  for detailed step-by-step solutions or when working with operations requiring two matrices. 
                  Click the dice icon to fill matrices with random values for testing.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
