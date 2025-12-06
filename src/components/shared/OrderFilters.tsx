import { useState } from "react";
import { format } from "date-fns";
import { 
  Search, 
  Filter, 
  Calendar, 
  X,
  ChevronDown
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DateRange } from "react-day-picker";

const ORDER_STATUSES = [
  { value: "all", label: "All Status" },
  { value: "pending", label: "Pending" },
  { value: "accepted", label: "Accepted" },
  { value: "preparing", label: "Preparing" },
  { value: "ready", label: "Ready" },
  { value: "picked_up", label: "Picked Up" },
  { value: "inspecting", label: "Inspecting" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
];

interface OrderFiltersProps {
  onSearchChange: (query: string) => void;
  onStatusChange: (status: string) => void;
  onDateRangeChange: (range: { from: Date | undefined; to: Date | undefined }) => void;
  searchQuery?: string;
  selectedStatus?: string;
  dateRange?: { from: Date | undefined; to: Date | undefined };
}

const OrderFilters = ({
  onSearchChange,
  onStatusChange,
  onDateRangeChange,
  searchQuery = "",
  selectedStatus = "all",
  dateRange = { from: undefined, to: undefined },
}: OrderFiltersProps) => {
  const [showFilters, setShowFilters] = useState(false);
  const [date, setDate] = useState<DateRange | undefined>({
    from: dateRange.from,
    to: dateRange.to,
  });

  const handleDateSelect = (range: DateRange | undefined) => {
    setDate(range);
    onDateRangeChange({
      from: range?.from,
      to: range?.to,
    });
  };

  const clearFilters = () => {
    onSearchChange("");
    onStatusChange("all");
    onDateRangeChange({ from: undefined, to: undefined });
    setDate(undefined);
  };

  const hasActiveFilters = searchQuery || selectedStatus !== "all" || date?.from || date?.to;

  return (
    <div className="space-y-3">
      {/* Main Search Bar */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search by order number..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button
          variant={showFilters ? "default" : "outline"}
          size="icon"
          onClick={() => setShowFilters(!showFilters)}
          className="relative"
        >
          <Filter className="w-4 h-4" />
          {hasActiveFilters && (
            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-primary" />
          )}
        </Button>
      </div>

      {/* Expanded Filters */}
      {showFilters && (
        <div className="flex flex-wrap gap-2 p-3 rounded-xl bg-muted/50 border">
          {/* Status Filter */}
          <Select value={selectedStatus} onValueChange={onStatusChange}>
            <SelectTrigger className="w-[160px] h-9">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              {ORDER_STATUSES.map((status) => (
                <SelectItem key={status.value} value={status.value}>
                  {status.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Date Range Picker */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="h-9 gap-2">
                <Calendar className="w-4 h-4" />
                {date?.from ? (
                  date.to ? (
                    <>
                      {format(date.from, "MMM d")} - {format(date.to, "MMM d")}
                    </>
                  ) : (
                    format(date.from, "MMM d, yyyy")
                  )
                ) : (
                  "Date Range"
                )}
                <ChevronDown className="w-3 h-3" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <CalendarComponent
                initialFocus
                mode="range"
                defaultMonth={date?.from}
                selected={date}
                onSelect={handleDateSelect}
                numberOfMonths={1}
              />
            </PopoverContent>
          </Popover>

          {/* Clear Button */}
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              className="h-9"
              onClick={clearFilters}
            >
              <X className="w-4 h-4 mr-1" />
              Clear
            </Button>
          )}
        </div>
      )}

      {/* Active Filters Display */}
      {hasActiveFilters && !showFilters && (
        <div className="flex flex-wrap gap-2">
          {searchQuery && (
            <Badge variant="secondary" className="gap-1">
              Search: {searchQuery}
              <button onClick={() => onSearchChange("")}>
                <X className="w-3 h-3" />
              </button>
            </Badge>
          )}
          {selectedStatus !== "all" && (
            <Badge variant="secondary" className="gap-1">
              Status: {ORDER_STATUSES.find((s) => s.value === selectedStatus)?.label}
              <button onClick={() => onStatusChange("all")}>
                <X className="w-3 h-3" />
              </button>
            </Badge>
          )}
          {date?.from && (
            <Badge variant="secondary" className="gap-1">
              {date.to
                ? `${format(date.from, "MMM d")} - ${format(date.to, "MMM d")}`
                : format(date.from, "MMM d, yyyy")}
              <button onClick={() => handleDateSelect(undefined)}>
                <X className="w-3 h-3" />
              </button>
            </Badge>
          )}
        </div>
      )}
    </div>
  );
};

export default OrderFilters;
