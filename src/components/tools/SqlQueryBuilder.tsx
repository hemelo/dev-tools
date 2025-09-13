import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  Copy, 
  Check, 
  AlertCircle, 
  CheckCircle, 
  RotateCcw, 
  FileText, 
  Download, 
  Upload, 
  Info, 
  Zap, 
  Database,
  Plus,
  Trash2,
  Eye,
  Play,
  Save,
  Loader2,
  Edit,
  Table,
  Settings,
  X
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Column {
  name: string;
  type: string;
  nullable: boolean;
  primaryKey: boolean;
  defaultValue?: string;
  autoIncrement?: boolean;
  unique?: boolean;
}

interface Table {
  name: string;
  columns: Column[];
  indexes?: string[];
}

interface Join {
  type: 'INNER' | 'LEFT' | 'RIGHT' | 'FULL';
  table: string;
  on: string;
}

interface QueryBuilder {
  select: string[];
  from: string;
  joins: Join[];
  where: string;
  groupBy: string[];
  having: string;
  orderBy: string[];
  limit: number | null;
  distinct: boolean;
}

const SqlQueryBuilder = () => {
  const [query, setQuery] = useState("");
  const [copied, setCopied] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState("tables");
  const [showCreateTable, setShowCreateTable] = useState(false);
  const [editingTable, setEditingTable] = useState<Table | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const { toast } = useToast();

  // Sample database schema
  const [tables, setTables] = useState<Table[]>([
    {
      name: "users",
      columns: [
        { name: "id", type: "INT", nullable: false, primaryKey: true, autoIncrement: true },
        { name: "username", type: "VARCHAR(50)", nullable: false, primaryKey: false, unique: true },
        { name: "email", type: "VARCHAR(100)", nullable: false, primaryKey: false, unique: true },
        { name: "created_at", type: "TIMESTAMP", nullable: false, primaryKey: false, defaultValue: "CURRENT_TIMESTAMP" },
        { name: "is_active", type: "BOOLEAN", nullable: false, primaryKey: false, defaultValue: "true" }
      ]
    },
    {
      name: "orders",
      columns: [
        { name: "id", type: "INT", nullable: false, primaryKey: true, autoIncrement: true },
        { name: "user_id", type: "INT", nullable: false, primaryKey: false },
        { name: "product_id", type: "INT", nullable: false, primaryKey: false },
        { name: "quantity", type: "INT", nullable: false, primaryKey: false },
        { name: "total_price", type: "DECIMAL(10,2)", nullable: false, primaryKey: false },
        { name: "order_date", type: "TIMESTAMP", nullable: false, primaryKey: false, defaultValue: "CURRENT_TIMESTAMP" },
        { name: "status", type: "VARCHAR(20)", nullable: false, primaryKey: false, defaultValue: "'pending'" }
      ]
    }
  ]);

  const [queryBuilder, setQueryBuilder] = useState<QueryBuilder>({
    select: [],
    from: "",
    joins: [],
    where: "",
    groupBy: [],
    having: "",
    orderBy: [],
    limit: null,
    distinct: false
  });

  const [newTable, setNewTable] = useState<Table>({
    name: "",
    columns: [{ name: "", type: "VARCHAR(50)", nullable: false, primaryKey: false }]
  });

  const [newColumn, setNewColumn] = useState<Column>({
    name: "",
    type: "VARCHAR(50)",
    nullable: false,
    primaryKey: false,
    defaultValue: "",
    autoIncrement: false,
    unique: false
  });

  const dataTypes = [
    "INT", "BIGINT", "SMALLINT", "TINYINT",
    "VARCHAR(255)", "VARCHAR(100)", "VARCHAR(50)", "TEXT", "LONGTEXT",
    "DECIMAL(10,2)", "FLOAT", "DOUBLE",
    "DATE", "TIME", "DATETIME", "TIMESTAMP",
    "BOOLEAN", "JSON", "BLOB"
  ];

  const generateCreateTableSQL = (table: Table): string => {
    let sql = `CREATE TABLE ${table.name} (\n`;
    
    const columnDefinitions = table.columns.map(col => {
      let definition = `  ${col.name} ${col.type}`;
      
      if (col.autoIncrement) {
        definition += " AUTO_INCREMENT";
      }
      
      if (!col.nullable) {
        definition += " NOT NULL";
      }
      
      if (col.unique && !col.primaryKey) {
        definition += " UNIQUE";
      }
      
      if (col.defaultValue) {
        definition += ` DEFAULT ${col.defaultValue}`;
      }
      
      return definition;
    });
    
    sql += columnDefinitions.join(",\n");
    
    // Add primary key constraint
    const primaryKeys = table.columns.filter(col => col.primaryKey);
    if (primaryKeys.length > 0) {
      sql += `,\n  PRIMARY KEY (${primaryKeys.map(col => col.name).join(", ")})`;
    }
    
    sql += "\n);";
    return sql;
  };

  const generateQuery = () => {
    setIsGenerating(true);
    
    setTimeout(() => {
      let sql = "";
      
      // SELECT clause
      if (queryBuilder.select.length === 0) {
        sql += "SELECT *";
      } else {
        sql += `SELECT ${queryBuilder.distinct ? "DISTINCT " : ""}${queryBuilder.select.join(", ")}`;
      }
      
      // FROM clause
      if (queryBuilder.from) {
        sql += `\nFROM ${queryBuilder.from}`;
      }
      
      // JOIN clauses
      queryBuilder.joins.forEach(join => {
        sql += `\n${join.type} JOIN ${join.table} ON ${join.on}`;
      });
      
      // WHERE clause
      if (queryBuilder.where) {
        sql += `\nWHERE ${queryBuilder.where}`;
      }
      
      // GROUP BY clause
      if (queryBuilder.groupBy.length > 0) {
        sql += `\nGROUP BY ${queryBuilder.groupBy.join(", ")}`;
      }
      
      // HAVING clause
      if (queryBuilder.having) {
        sql += `\nHAVING ${queryBuilder.having}`;
      }
      
      // ORDER BY clause
      if (queryBuilder.orderBy.length > 0) {
        sql += `\nORDER BY ${queryBuilder.orderBy.join(", ")}`;
      }
      
      // LIMIT clause
      if (queryBuilder.limit) {
        sql += `\nLIMIT ${queryBuilder.limit}`;
      }
      
      setQuery(sql);
      setIsGenerating(false);
    }, 500);
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(query);
      setCopied(true);
      toast({
        title: "Copied!",
        description: "SQL query copied to clipboard",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to copy to clipboard",
        variant: "destructive",
      });
    }
  };

  const resetQuery = () => {
    setQueryBuilder({
      select: [],
      from: "",
      joins: [],
      where: "",
      groupBy: [],
      having: "",
      orderBy: [],
      limit: null,
      distinct: false
    });
    setQuery("");
  };

  const addTable = () => {
    if (!newTable.name.trim()) {
      toast({
        title: "Error",
        description: "Table name is required",
        variant: "destructive",
      });
      return;
    }

    if (tables.some(t => t.name === newTable.name)) {
      toast({
        title: "Error",
        description: "Table name already exists",
        variant: "destructive",
      });
      return;
    }

    const validColumns = newTable.columns.filter(col => col.name.trim());
    if (validColumns.length === 0) {
      toast({
        title: "Error",
        description: "At least one column is required",
        variant: "destructive",
      });
      return;
    }

    setTables(prev => [...prev, { ...newTable, columns: validColumns }]);
    setNewTable({
      name: "",
      columns: [{ name: "", type: "VARCHAR(50)", nullable: false, primaryKey: false }]
    });
    setShowCreateTable(false);
    
    toast({
      title: "Success",
      description: `Table "${newTable.name}" created successfully`,
    });
  };

  const deleteTable = (tableName: string) => {
    setTables(prev => prev.filter(t => t.name !== tableName));
    toast({
      title: "Success",
      description: `Table "${tableName}" deleted`,
    });
  };

  const editTable = (table: Table) => {
    setEditingTable({ ...table });
    setIsEditing(true);
    setShowCreateTable(true);
  };

  const updateTable = () => {
    if (!editingTable) return;

    if (!editingTable.name.trim()) {
      toast({
        title: "Error",
        description: "Table name is required",
        variant: "destructive",
      });
      return;
    }

    const validColumns = editingTable.columns.filter(col => col.name.trim());
    if (validColumns.length === 0) {
      toast({
        title: "Error",
        description: "At least one column is required",
        variant: "destructive",
      });
      return;
    }

    setTables(prev => prev.map(t => 
      t.name === editingTable.name 
        ? { ...editingTable, columns: validColumns }
        : t
    ));

    setEditingTable(null);
    setIsEditing(false);
    setShowCreateTable(false);
    
    toast({
      title: "Success",
      description: `Table "${editingTable.name}" updated successfully`,
    });
  };

  const cancelEdit = () => {
    setEditingTable(null);
    setIsEditing(false);
    setShowCreateTable(false);
  };

  const addColumn = () => {
    // Add a new empty column to the table
    const newEmptyColumn: Column = {
      name: "",
      type: "VARCHAR(50)",
      nullable: false,
      primaryKey: false,
      defaultValue: "",
      autoIncrement: false,
      unique: false
    };

    if (isEditing && editingTable) {
      setEditingTable(prev => prev ? ({
        ...prev,
        columns: [...prev.columns, newEmptyColumn]
      }) : null);
    } else {
      setNewTable(prev => ({
        ...prev,
        columns: [...prev.columns, newEmptyColumn]
      }));
    }
  };

  const removeColumn = (index: number) => {
    if (isEditing && editingTable) {
      setEditingTable(prev => prev ? ({
        ...prev,
        columns: prev.columns.filter((_, i) => i !== index)
      }) : null);
    } else {
      setNewTable(prev => ({
        ...prev,
        columns: prev.columns.filter((_, i) => i !== index)
      }));
    }
  };

  const addJoin = () => {
    setQueryBuilder(prev => ({
      ...prev,
      joins: [...prev.joins, { type: 'INNER', table: '', on: '' }]
    }));
  };

  const removeJoin = (index: number) => {
    setQueryBuilder(prev => ({
      ...prev,
      joins: prev.joins.filter((_, i) => i !== index)
    }));
  };

  const updateJoin = (index: number, field: keyof Join, value: string) => {
    setQueryBuilder(prev => ({
      ...prev,
      joins: prev.joins.map((join, i) => 
        i === index ? { ...join, [field]: value } : join
      )
    }));
  };

  const addSelectColumn = (column: string) => {
    setQueryBuilder(prev => ({
      ...prev,
      select: [...prev.select, column]
    }));
  };

  const removeSelectColumn = (index: number) => {
    setQueryBuilder(prev => ({
      ...prev,
      select: prev.select.filter((_, i) => i !== index)
    }));
  };

  const addOrderBy = (column: string) => {
    setQueryBuilder(prev => ({
      ...prev,
      orderBy: [...prev.orderBy, column]
    }));
  };

  const removeOrderBy = (index: number) => {
    setQueryBuilder(prev => ({
      ...prev,
      orderBy: prev.orderBy.filter((_, i) => i !== index)
    }));
  };

  const addGroupBy = (column: string) => {
    setQueryBuilder(prev => ({
      ...prev,
      groupBy: [...prev.groupBy, column]
    }));
  };

  const removeGroupBy = (index: number) => {
    setQueryBuilder(prev => ({
      ...prev,
      groupBy: prev.groupBy.filter((_, i) => i !== index)
    }));
  };

  const getTableColumns = (tableName: string) => {
    const table = tables.find(t => t.name === tableName);
    return table ? table.columns : [];
  };

  const getAvailableColumns = () => {
    const columns: string[] = [];
    if (queryBuilder.from) {
      columns.push(...getTableColumns(queryBuilder.from).map(col => `${queryBuilder.from}.${col.name}`));
    }
    queryBuilder.joins.forEach(join => {
      if (join.table) {
        columns.push(...getTableColumns(join.table).map(col => `${join.table}.${col.name}`));
      }
    });
    return columns;
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-lg bg-primary/10">
            <Database className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">SQL Query Builder</h1>
            <p className="text-muted-foreground">
              Create tables and build SQL queries visually with drag-and-drop interface
            </p>
          </div>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="tables">Tables</TabsTrigger>
          <TabsTrigger value="builder">Query Builder</TabsTrigger>
          <TabsTrigger value="result">Generated SQL</TabsTrigger>
        </TabsList>

        <TabsContent value="tables" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold">Database Tables</h2>
            <Dialog open={showCreateTable} onOpenChange={setShowCreateTable}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Table
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>
                    {isEditing ? `Edit Table: ${editingTable?.name}` : "Create New Table"}
                  </DialogTitle>
                  <DialogDescription>
                    {isEditing ? "Modify your table structure and columns" : "Define your table structure with columns and constraints"}
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="table-name">Table Name</Label>
                    <Input
                      id="table-name"
                      placeholder="Enter table name (e.g., products)"
                      value={isEditing ? editingTable?.name || "" : newTable.name}
                      onChange={(e) => {
                        if (isEditing && editingTable) {
                          setEditingTable(prev => prev ? ({ ...prev, name: e.target.value }) : null);
                        } else {
                          setNewTable(prev => ({ ...prev, name: e.target.value }));
                        }
                      }}
                    />
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label className="text-lg font-semibold">Columns</Label>
                      <Button variant="outline" size="sm" onClick={addColumn}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Column
                      </Button>
                    </div>

                    <div className="space-y-4 max-h-60 overflow-y-auto">
                      {(isEditing ? editingTable?.columns || [] : newTable.columns).map((column, index) => (
                        <Card key={index} className="p-4">
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="space-y-2">
                              <Label>Column Name</Label>
                              <Input
                                placeholder="column_name"
                                value={column.name}
                                onChange={(e) => {
                                  if (isEditing && editingTable) {
                                    const newColumns = [...editingTable.columns];
                                    newColumns[index].name = e.target.value;
                                    setEditingTable(prev => prev ? ({ ...prev, columns: newColumns }) : null);
                                  } else {
                                    const newColumns = [...newTable.columns];
                                    newColumns[index].name = e.target.value;
                                    setNewTable(prev => ({ ...prev, columns: newColumns }));
                                  }
                                }}
                              />
                            </div>
                            
                            <div className="space-y-2">
                              <Label>Data Type</Label>
                              <Select
                                value={column.type}
                                onValueChange={(value) => {
                                  if (isEditing && editingTable) {
                                    const newColumns = [...editingTable.columns];
                                    newColumns[index].type = value;
                                    setEditingTable(prev => prev ? ({ ...prev, columns: newColumns }) : null);
                                  } else {
                                    const newColumns = [...newTable.columns];
                                    newColumns[index].type = value;
                                    setNewTable(prev => ({ ...prev, columns: newColumns }));
                                  }
                                }}
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {dataTypes.map((type) => (
                                    <SelectItem key={type} value={type}>
                                      {type}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>

                            <div className="space-y-2">
                              <Label>Default Value</Label>
                              <Input
                                placeholder="default value"
                                value={column.defaultValue || ""}
                                onChange={(e) => {
                                  if (isEditing && editingTable) {
                                    const newColumns = [...editingTable.columns];
                                    newColumns[index].defaultValue = e.target.value;
                                    setEditingTable(prev => prev ? ({ ...prev, columns: newColumns }) : null);
                                  } else {
                                    const newColumns = [...newTable.columns];
                                    newColumns[index].defaultValue = e.target.value;
                                    setNewTable(prev => ({ ...prev, columns: newColumns }));
                                  }
                                }}
                              />
                            </div>

                            <div className="space-y-2">
                              <Label>Options</Label>
                              <div className="space-y-2">
                                <div className="flex items-center space-x-2">
                                  <Checkbox
                                    id={`nullable-${index}`}
                                    checked={column.nullable}
                                    onCheckedChange={(checked) => {
                                      if (isEditing && editingTable) {
                                        const newColumns = [...editingTable.columns];
                                        newColumns[index].nullable = !!checked;
                                        setEditingTable(prev => prev ? ({ ...prev, columns: newColumns }) : null);
                                      } else {
                                        const newColumns = [...newTable.columns];
                                        newColumns[index].nullable = !!checked;
                                        setNewTable(prev => ({ ...prev, columns: newColumns }));
                                      }
                                    }}
                                  />
                                  <Label htmlFor={`nullable-${index}`} className="text-sm">Nullable</Label>
                                </div>
                                
                                <div className="flex items-center space-x-2">
                                  <Checkbox
                                    id={`primary-${index}`}
                                    checked={column.primaryKey}
                                    onCheckedChange={(checked) => {
                                      if (isEditing && editingTable) {
                                        const newColumns = [...editingTable.columns];
                                        newColumns[index].primaryKey = !!checked;
                                        setEditingTable(prev => prev ? ({ ...prev, columns: newColumns }) : null);
                                      } else {
                                        const newColumns = [...newTable.columns];
                                        newColumns[index].primaryKey = !!checked;
                                        setNewTable(prev => ({ ...prev, columns: newColumns }));
                                      }
                                    }}
                                  />
                                  <Label htmlFor={`primary-${index}`} className="text-sm">Primary Key</Label>
                                </div>
                                
                                <div className="flex items-center space-x-2">
                                  <Checkbox
                                    id={`unique-${index}`}
                                    checked={column.unique}
                                    onCheckedChange={(checked) => {
                                      if (isEditing && editingTable) {
                                        const newColumns = [...editingTable.columns];
                                        newColumns[index].unique = !!checked;
                                        setEditingTable(prev => prev ? ({ ...prev, columns: newColumns }) : null);
                                      } else {
                                        const newColumns = [...newTable.columns];
                                        newColumns[index].unique = !!checked;
                                        setNewTable(prev => ({ ...prev, columns: newColumns }));
                                      }
                                    }}
                                  />
                                  <Label htmlFor={`unique-${index}`} className="text-sm">Unique</Label>
                                </div>
                                
                                <div className="flex items-center space-x-2">
                                  <Checkbox
                                    id={`auto-${index}`}
                                    checked={column.autoIncrement}
                                    onCheckedChange={(checked) => {
                                      if (isEditing && editingTable) {
                                        const newColumns = [...editingTable.columns];
                                        newColumns[index].autoIncrement = !!checked;
                                        setEditingTable(prev => prev ? ({ ...prev, columns: newColumns }) : null);
                                      } else {
                                        const newColumns = [...newTable.columns];
                                        newColumns[index].autoIncrement = !!checked;
                                        setNewTable(prev => ({ ...prev, columns: newColumns }));
                                      }
                                    }}
                                  />
                                  <Label htmlFor={`auto-${index}`} className="text-sm">Auto Increment</Label>
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex justify-end mt-4">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => removeColumn(index)}
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Remove
                            </Button>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>
                </div>

                <DialogFooter>
                  <Button variant="outline" onClick={isEditing ? cancelEdit : () => setShowCreateTable(false)}>
                    Cancel
                  </Button>
                  <Button onClick={isEditing ? updateTable : addTable}>
                    {isEditing ? "Update Table" : "Create Table"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tables.map((table) => (
              <Card key={table.name}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Table className="h-5 w-5" />
                      {table.name}
                    </CardTitle>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteTable(table.name)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <CardDescription>
                    {table.columns.length} columns
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {table.columns.map((column) => (
                      <div key={column.name} className="flex items-center gap-2 text-sm">
                        <span className="font-mono">{column.name}</span>
                        <Badge variant="outline" className="text-xs">
                          {column.type}
                        </Badge>
                        {column.primaryKey && (
                          <Badge variant="default" className="text-xs">PK</Badge>
                        )}
                        {column.unique && (
                          <Badge variant="secondary" className="text-xs">UNIQUE</Badge>
                        )}
                        {column.autoIncrement && (
                          <Badge variant="outline" className="text-xs">AUTO</Badge>
                        )}
                        {!column.nullable && (
                          <Badge variant="destructive" className="text-xs">NOT NULL</Badge>
                        )}
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-4 pt-4 border-t space-y-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={() => editTable(table)}
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Table
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={() => {
                        setQuery(generateCreateTableSQL(table));
                        setActiveTab("result");
                      }}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View CREATE SQL
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="builder" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Database Schema */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  Available Tables
                </CardTitle>
                <CardDescription>
                  Select tables and columns for your query
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {tables.map((table) => (
                  <div key={table.name} className="border rounded-lg p-3">
                    <div className="font-semibold text-sm mb-2 flex items-center gap-2">
                      <Database className="h-4 w-4" />
                      {table.name}
                    </div>
                    <div className="space-y-1">
                      {table.columns.map((column) => (
                        <div key={column.name} className="flex items-center gap-2 text-xs">
                          <span className="font-mono">{column.name}</span>
                          <Badge variant="outline" className="text-xs">
                            {column.type}
                          </Badge>
                          {column.primaryKey && (
                            <Badge variant="default" className="text-xs">PK</Badge>
                          )}
                          {column.unique && (
                            <Badge variant="secondary" className="text-xs">UNIQUE</Badge>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Query Builder */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Query Builder
                </CardTitle>
                <CardDescription>
                  Configure your SQL query step by step
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* SELECT */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Label className="font-semibold">SELECT</Label>
                    <Checkbox
                      checked={queryBuilder.distinct}
                      onCheckedChange={(checked) => 
                        setQueryBuilder(prev => ({ ...prev, distinct: !!checked }))
                      }
                    />
                    <Label className="text-sm">DISTINCT</Label>
                  </div>
                  
                  <div className="space-y-2">
                    {queryBuilder.select.map((column, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <Badge variant="outline" className="flex-1 justify-start">
                          {column}
                        </Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeSelectColumn(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    
                    <Select onValueChange={addSelectColumn}>
                      <SelectTrigger>
                        <SelectValue placeholder="Add column..." />
                      </SelectTrigger>
                      <SelectContent>
                        {getAvailableColumns().map((column) => (
                          <SelectItem key={column} value={column}>
                            {column}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* FROM */}
                <div className="space-y-2">
                  <Label className="font-semibold">FROM</Label>
                  <Select 
                    value={queryBuilder.from} 
                    onValueChange={(value) => 
                      setQueryBuilder(prev => ({ ...prev, from: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select table..." />
                    </SelectTrigger>
                    <SelectContent>
                      {tables.map((table) => (
                        <SelectItem key={table.name} value={table.name}>
                          {table.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* JOINs */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="font-semibold">JOINs</Label>
                    <Button variant="outline" size="sm" onClick={addJoin}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Join
                    </Button>
                  </div>
                  
                  {queryBuilder.joins.map((join, index) => (
                    <div key={index} className="border rounded-lg p-3 space-y-2">
                      <div className="flex items-center gap-2">
                        <Select
                          value={join.type}
                          onValueChange={(value: 'INNER' | 'LEFT' | 'RIGHT' | 'FULL') => 
                            updateJoin(index, 'type', value)
                          }
                        >
                          <SelectTrigger className="w-24">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="INNER">INNER</SelectItem>
                            <SelectItem value="LEFT">LEFT</SelectItem>
                            <SelectItem value="RIGHT">RIGHT</SelectItem>
                            <SelectItem value="FULL">FULL</SelectItem>
                          </SelectContent>
                        </Select>
                        <span className="text-sm">JOIN</span>
                        <Select
                          value={join.table}
                          onValueChange={(value) => updateJoin(index, 'table', value)}
                        >
                          <SelectTrigger className="flex-1">
                            <SelectValue placeholder="Select table..." />
                          </SelectTrigger>
                          <SelectContent>
                            {tables.map((table) => (
                              <SelectItem key={table.name} value={table.name}>
                                {table.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeJoin(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <Input
                        placeholder="ON condition (e.g., users.id = orders.user_id)"
                        value={join.on}
                        onChange={(e) => updateJoin(index, 'on', e.target.value)}
                      />
                    </div>
                  ))}
                </div>

                {/* WHERE */}
                <div className="space-y-2">
                  <Label className="font-semibold">WHERE</Label>
                  <Input
                    placeholder="WHERE condition (e.g., users.is_active = true)"
                    value={queryBuilder.where}
                    onChange={(e) => 
                      setQueryBuilder(prev => ({ ...prev, where: e.target.value }))
                    }
                  />
                </div>

                {/* GROUP BY */}
                <div className="space-y-3">
                  <Label className="font-semibold">GROUP BY</Label>
                  <div className="space-y-2">
                    {queryBuilder.groupBy.map((column, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <Badge variant="outline" className="flex-1 justify-start">
                          {column}
                        </Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeGroupBy(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    
                    <Select onValueChange={addGroupBy}>
                      <SelectTrigger>
                        <SelectValue placeholder="Add GROUP BY column..." />
                      </SelectTrigger>
                      <SelectContent>
                        {getAvailableColumns().map((column) => (
                          <SelectItem key={column} value={column}>
                            {column}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* HAVING */}
                <div className="space-y-2">
                  <Label className="font-semibold">HAVING</Label>
                  <Input
                    placeholder="HAVING condition (e.g., COUNT(*) > 5)"
                    value={queryBuilder.having}
                    onChange={(e) => 
                      setQueryBuilder(prev => ({ ...prev, having: e.target.value }))
                    }
                  />
                </div>

                {/* ORDER BY */}
                <div className="space-y-3">
                  <Label className="font-semibold">ORDER BY</Label>
                  <div className="space-y-2">
                    {queryBuilder.orderBy.map((column, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <Badge variant="outline" className="flex-1 justify-start">
                          {column}
                        </Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeOrderBy(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    
                    <Select onValueChange={addOrderBy}>
                      <SelectTrigger>
                        <SelectValue placeholder="Add ORDER BY column..." />
                      </SelectTrigger>
                      <SelectContent>
                        {getAvailableColumns().map((column) => (
                          <SelectItem key={column} value={column}>
                            {column}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* LIMIT */}
                <div className="space-y-2">
                  <Label className="font-semibold">LIMIT</Label>
                  <Input
                    type="number"
                    placeholder="Number of rows to return"
                    value={queryBuilder.limit || ""}
                    onChange={(e) => 
                      setQueryBuilder(prev => ({ 
                        ...prev, 
                        limit: e.target.value ? parseInt(e.target.value) : null 
                      }))
                    }
                  />
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-4">
                  <Button onClick={generateQuery} disabled={isGenerating} className="flex-1">
                    {isGenerating ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Play className="h-4 w-4 mr-2" />
                        Generate Query
                      </>
                    )}
                  </Button>
                  <Button variant="outline" onClick={resetQuery}>
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Reset
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="result" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                Generated SQL
              </CardTitle>
              <CardDescription>
                Your SQL query or CREATE TABLE statement
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="relative">
                  <Textarea
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Your generated SQL will appear here..."
                    className="min-h-[300px] font-mono text-sm"
                    readOnly={!query}
                  />
                  {query && (
                    <div className="absolute top-2 right-2 flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={copyToClipboard}
                        disabled={copied}
                      >
                        {copied ? (
                          <Check className="h-4 w-4" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  )}
                </div>

                {query && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Info className="h-4 w-4" />
                    <span>
                      SQL length: {query.length} characters, {query.split('\n').length} lines
                    </span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SqlQueryBuilder;