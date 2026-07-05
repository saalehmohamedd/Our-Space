// src/lib/generate-card-report-pdf.ts
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// --- Type Definitions ---
export interface Card {
  nickname: string;
  last4: string;
  brand: string;
}

export interface Transaction {
  date: string | Date;
  sourceType: string;
  note?: string;
  amount: number;
}

export interface SourceBreakdown {
  sourceType: string;
  amount: number;
}

export interface MonthlyBreakdown {
  income: number;
  spent: number;
  saved: number;
}

export interface Report {
  totalIncome: number;
  totalSpent: number;
  totalSaved: number;
  currentBalance: number;
  transactions?: Transaction[];
  sourceBreakdown?: SourceBreakdown[];
  monthlyBreakdown?: Record<string, MonthlyBreakdown>;
}

type RGB = [number, number, number];

// --- Constants ---
const SOURCE_LABELS: Record<string, string> = {
  WISHLIST: "Wishlist",
  SHOPPING: "Shopping",
  DATE_OUTING: "Date Outing",
  MANUAL: "Manual",
};

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export function generateCardReportPDF(
  card: Card,
  report: Report,
  range: "week" | "month" | "year"
) {
  const doc = new jsPDF();
  const dateObj = new Date();
  const today = dateObj.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Colors strongly typed as RGB tuples to allow spreading into jsPDF methods
  const primaryColor: RGB = [99, 102, 241]; // indigo-500
  const emeraldColor: RGB = [16, 185, 129]; // emerald-500
  const roseColor: RGB = [244, 63, 94]; // rose-500
  const darkColor: RGB = [30, 41, 59]; // slate-800
  const mutedColor: RGB = [100, 116, 139]; // slate-500
  const blueColor: RGB = [59, 130, 246]; // blue-500

  let yPos = 20;

  // Header
  doc.setFontSize(20);
  doc.setTextColor(...primaryColor);
  doc.text(`${card.nickname} - Report`, 14, yPos);
  yPos += 8;

  doc.setFontSize(10);
  doc.setTextColor(...mutedColor);
  doc.text(`Card: •••• ${card.last4} | ${card.brand}`, 14, yPos);
  yPos += 6;
  doc.text(`Range: ${range.charAt(0).toUpperCase() + range.slice(1)} | Generated: ${today}`, 14, yPos);
  yPos += 10;

  // Divider line
  doc.setDrawColor(...mutedColor);
  doc.line(14, yPos, 196, yPos);
  yPos += 10;

  // Summary Block
  doc.setFontSize(14);
  doc.setTextColor(...darkColor);
  doc.text("Summary", 14, yPos);
  yPos += 8;

  doc.setFontSize(10);
  
  // Typed summary array
  const summaryData: Array<[string, string, RGB]> = [
    ["Total Income", `$${report.totalIncome.toFixed(2)}`, emeraldColor],
    ["Total Spent", `$${report.totalSpent.toFixed(2)}`, roseColor],
    ["Total Saved", `$${report.totalSaved.toFixed(2)}`, blueColor], 
    ["Current Balance", `$${report.currentBalance.toFixed(2)}`, primaryColor],
  ];

  summaryData.forEach(([label, value, color]) => {
    doc.setTextColor(...darkColor);
    doc.text(label, 18, yPos);
    doc.setTextColor(...color);
    doc.text(value, 100, yPos);
    yPos += 6;
  });

  yPos += 6;

  // Transactions Table
  doc.setFontSize(14);
  doc.setTextColor(...darkColor);
  doc.text("Transactions", 14, yPos);
  yPos += 6;

  if (report.transactions && report.transactions.length > 0) {
    const tableData = report.transactions.map((t) => [
      new Date(t.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      SOURCE_LABELS[t.sourceType] || t.sourceType,
      t.note || "-",
      `-$${t.amount.toFixed(2)}`,
    ]);

    autoTable(doc, {
      startY: yPos,
      head: [["Date", "Category", "Note", "Amount"]],
      body: tableData,
      headStyles: {
        fillColor: primaryColor,
        textColor: [255, 255, 255],
        fontStyle: "bold",
        fontSize: 10,
      },
      bodyStyles: {
        fontSize: 9,
        textColor: darkColor,
      },
      alternateRowStyles: {
        fillColor: [241, 245, 249], // slate-100
      },
      columnStyles: {
        3: { halign: "right", textColor: roseColor, fontStyle: "bold" },
      },
      margin: { left: 14 },
    });

    // Safely extract finalY from the autotable plugin
    yPos = (doc as jsPDF & { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 10;
  } else {
    doc.setFontSize(10);
    doc.setTextColor(...mutedColor);
    doc.text("No transactions in this period", 18, yPos);
    yPos += 10;
  }

  // Category Breakdown Table
  doc.setFontSize(14);
  doc.setTextColor(...darkColor);
  doc.text("Spending by Category", 14, yPos);
  yPos += 6;

  if (report.sourceBreakdown && report.sourceBreakdown.length > 0) {
    const categoryData = report.sourceBreakdown.map((s) => [
      SOURCE_LABELS[s.sourceType] || s.sourceType,
      `$${s.amount.toFixed(2)}`,
      report.totalSpent > 0
        ? `${((s.amount / report.totalSpent) * 100).toFixed(1)}%`
        : "0%",
    ]);

    autoTable(doc, {
      startY: yPos,
      head: [["Category", "Amount", "Share"]],
      body: categoryData,
      headStyles: {
        fillColor: primaryColor,
        textColor: [255, 255, 255],
        fontStyle: "bold",
        fontSize: 10,
      },
      bodyStyles: {
        fontSize: 9,
        textColor: darkColor,
      },
      alternateRowStyles: {
        fillColor: [241, 245, 249],
      },
      columnStyles: {
        1: { halign: "right", fontStyle: "bold" },
        2: { halign: "center" },
      },
      margin: { left: 14 },
    });

    yPos = (doc as jsPDF & { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 10;
  } else {
    doc.setFontSize(10);
    doc.setTextColor(...mutedColor);
    doc.text("No category data available", 18, yPos);
    yPos += 10;
  }

  // Monthly Breakdown (if year range)
  if (range === "year" && report.monthlyBreakdown) {
    if (yPos > 240) {
      doc.addPage();
      yPos = 20;
    }

    doc.setFontSize(14);
    doc.setTextColor(...darkColor);
    doc.text("Monthly Breakdown", 14, yPos);
    yPos += 6;

    const monthlyData = Object.entries(report.monthlyBreakdown).map(
      ([key, data]) => {
        const [year, month] = key.split("-");
        const monthName = MONTHS[parseInt(month, 10) - 1]?.slice(0, 3) || "Unknown";
        return [
          `${monthName} ${year}`,
          `$${data.income.toFixed(2)}`,
          `$${data.spent.toFixed(2)}`,
          `$${data.saved.toFixed(2)}`,
        ];
      }
    );

    autoTable(doc, {
      startY: yPos,
      head: [["Month", "Income", "Spent", "Saved"]],
      body: monthlyData,
      headStyles: {
        fillColor: primaryColor,
        textColor: [255, 255, 255],
        fontStyle: "bold",
        fontSize: 10,
      },
      bodyStyles: {
        fontSize: 9,
        textColor: darkColor,
      },
      alternateRowStyles: {
        fillColor: [241, 245, 249],
      },
      columnStyles: {
        1: { halign: "right", textColor: emeraldColor },
        2: { halign: "right", textColor: roseColor },
        3: { halign: "right" },
      },
      margin: { left: 14 },
    });
  }

  // Footer
  const pageCount = (doc as any).internal.getNumberOfPages() || doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(...mutedColor);
    doc.text(
      `Page ${i} of ${pageCount} | Generated by Our Space | ${today}`,
      14,
      doc.internal.pageSize.height - 10
    );
  }

  // Save with a local-time safe date string
  const safeDateStr = `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(2, '0')}-${String(dateObj.getDate()).padStart(2, '0')}`;
  const fileName = `${card.nickname.replace(/\s+/g, "-").toLowerCase()}-report-${range}-${safeDateStr}.pdf`;
  
  doc.save(fileName);
}