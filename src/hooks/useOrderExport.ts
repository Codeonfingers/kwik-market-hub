import { useCallback } from "react";
import { toast } from "sonner";

interface OrderItem {
  product_name: string;
  quantity: number;
  unit_price: number;
  total_price: number;
}

interface Order {
  id: string;
  order_number: string;
  status: string;
  created_at: string;
  subtotal: number | null;
  shopper_fee: number | null;
  total: number | null;
  items?: OrderItem[];
}

export const useOrderExport = () => {
  const exportToCSV = useCallback((orders: Order[], filename = "orders") => {
    if (orders.length === 0) {
      toast.error("No orders to export");
      return;
    }

    const headers = [
      "Order Number",
      "Date",
      "Status",
      "Items",
      "Subtotal (₵)",
      "Shopper Fee (₵)",
      "Total (₵)",
    ];

    const rows = orders.map((order) => [
      order.order_number,
      new Date(order.created_at).toLocaleDateString(),
      order.status,
      order.items?.map((i) => `${i.quantity}x ${i.product_name}`).join("; ") || "",
      Number(order.subtotal || 0).toFixed(2),
      Number(order.shopper_fee || 0).toFixed(2),
      Number(order.total || 0).toFixed(2),
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) =>
        row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${filename}_${new Date().toISOString().split("T")[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast.success("Orders exported to CSV");
  }, []);

  const exportToPDF = useCallback((orders: Order[], filename = "orders") => {
    if (orders.length === 0) {
      toast.error("No orders to export");
      return;
    }

    // Create a printable HTML document
    const totalAmount = orders.reduce((sum, o) => sum + Number(o.total || 0), 0);

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Order History - KwikMarket</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; color: #333; }
          h1 { color: #2C5F2D; border-bottom: 2px solid #2C5F2D; padding-bottom: 10px; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
          th { background-color: #2C5F2D; color: white; }
          tr:nth-child(even) { background-color: #f9f9f9; }
          .status { padding: 4px 8px; border-radius: 4px; font-size: 12px; }
          .status-completed { background-color: #d4edda; color: #155724; }
          .status-pending { background-color: #fff3cd; color: #856404; }
          .status-cancelled { background-color: #f8d7da; color: #721c24; }
          .summary { margin-top: 20px; padding: 15px; background-color: #f5f5f5; border-radius: 8px; }
          .summary h3 { margin: 0 0 10px 0; }
          @media print { body { print-color-adjust: exact; -webkit-print-color-adjust: exact; } }
        </style>
      </head>
      <body>
        <h1>🛒 KwikMarket Order History</h1>
        <p>Generated on: ${new Date().toLocaleString()}</p>
        
        <table>
          <thead>
            <tr>
              <th>Order #</th>
              <th>Date</th>
              <th>Status</th>
              <th>Items</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            ${orders
              .map(
                (order) => `
              <tr>
                <td>${order.order_number}</td>
                <td>${new Date(order.created_at).toLocaleDateString()}</td>
                <td><span class="status status-${order.status}">${order.status}</span></td>
                <td>${order.items?.map((i) => `${i.quantity}x ${i.product_name}`).join(", ") || "-"}</td>
                <td>₵${Number(order.total || 0).toFixed(2)}</td>
              </tr>
            `
              )
              .join("")}
          </tbody>
        </table>
        
        <div class="summary">
          <h3>Summary</h3>
          <p><strong>Total Orders:</strong> ${orders.length}</p>
          <p><strong>Total Amount:</strong> ₵${totalAmount.toFixed(2)}</p>
        </div>
      </body>
      </html>
    `;

    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(htmlContent);
      printWindow.document.close();
      printWindow.onload = () => {
        printWindow.print();
      };
      toast.success("PDF export ready - use Print to PDF");
    } else {
      toast.error("Please allow popups to export PDF");
    }
  }, []);

  return { exportToCSV, exportToPDF };
};
