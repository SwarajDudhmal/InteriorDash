import React, { useState } from 'react';
import { 
  Receipt, 
  Plus, 
  Trash2, 
  Printer, 
  Copy, 
  Check
} from 'lucide-react';
import type { RoomQuotation, QuotationItem } from '../types/interior';

interface QuotationGeneratorProps {
  initialQuotation: RoomQuotation;
  roomType: string;
  styleName: string;
}

export const QuotationGenerator: React.FC<QuotationGeneratorProps> = ({
  initialQuotation,
  roomType,
  styleName,
}) => {
  const [quotation, setQuotation] = useState<RoomQuotation>(initialQuotation);
  const [customerName, setCustomerName] = useState<string>('Valued Client');
  const [copied, setCopied] = useState(false);
  const [newItemName, setNewItemName] = useState('');
  const [newItemCategory, setNewItemCategory] = useState('Custom Fitting');
  const [newItemPrice, setNewItemPrice] = useState<string>('15000');
  const [showAddForm, setShowAddForm] = useState(false);

  const formatter = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 });

  const recalculate = (items: QuotationItem[], labor: number, gstRate: number): RoomQuotation => {
    const subtotalINR = items.reduce((sum, item) => sum + item.totalPriceINR, 0);
    const taxableTotal = subtotalINR + labor;
    const gstINR = Math.round((taxableTotal * gstRate) / 100);
    const grandTotalINR = taxableTotal + gstINR;

    return {
      items,
      subtotalINR,
      laborInstallationINR: labor,
      gstPercentage: gstRate,
      gstINR,
      grandTotalINR,
      currency: 'INR',
      formattedGrandTotal: formatter.format(grandTotalINR)
    };
  };

  const handleQuantityChange = (id: string, delta: number) => {
    const updatedItems = quotation.items.map((item) => {
      if (item.id === id) {
        const newQty = Math.max(1, item.quantity + delta);
        return {
          ...item,
          quantity: newQty,
          totalPriceINR: newQty * item.unitPriceINR
        };
      }
      return item;
    });

    setQuotation(recalculate(updatedItems, quotation.laborInstallationINR, quotation.gstPercentage));
  };

  const handleDeleteItem = (id: string) => {
    const updatedItems = quotation.items.filter((item) => item.id !== id);
    setQuotation(recalculate(updatedItems, quotation.laborInstallationINR, quotation.gstPercentage));
  };

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim() || isNaN(Number(newItemPrice))) return;

    const unitPrice = Number(newItemPrice);
    const newItem: QuotationItem = {
      id: `custom-${Date.now()}`,
      name: newItemName.trim(),
      category: newItemCategory,
      quantity: 1,
      unitPriceINR: unitPrice,
      totalPriceINR: unitPrice,
      description: 'Custom client directive requirement',
      material: 'Bespoke Custom Material'
    };

    const updatedItems = [...quotation.items, newItem];
    setQuotation(recalculate(updatedItems, quotation.laborInstallationINR, quotation.gstPercentage));
    setNewItemName('');
    setNewItemPrice('15000');
    setShowAddForm(false);
  };

  const handleCopyQuotationText = () => {
    const summary = `========================================================
ATELIER MAISON ARCHITECTURAL ESTIMATE & INVOICE QUOTATION
Client: ${customerName}
Project: ${roomType} Redesign (${styleName} Aesthetic)
Date: ${new Date().toLocaleDateString('en-IN')}
========================================================

ITEMIZED COST BREAKDOWN (INR ₹):
${quotation.items.map((item, idx) => `${idx + 1}. ${item.name} (${item.category})
   Qty: ${item.quantity} x ${formatter.format(item.unitPriceINR)} = ${formatter.format(item.totalPriceINR)}`).join('\n\n')}

--------------------------------------------------------
Subtotal Furniture & Materials: ${formatter.format(quotation.subtotalINR)}
Architectural Staging & Supervision Fee: ${formatter.format(quotation.laborInstallationINR)}
GST (${quotation.gstPercentage}%): ${formatter.format(quotation.gstINR)}
--------------------------------------------------------
GRAND TOTAL ESTIMATE: ${quotation.formattedGrandTotal}
========================================================
Includes structural layout protection & 100% material sourcing guarantee.`;

    navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrintQuotation = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const htmlContent = `<!DOCTYPE html>
<html>
<head>
  <title>ATELIER MAISON — Client Quotation Invoice</title>
  <style>
    body { font-family: 'Helvetica Neue', Arial, sans-serif; color: #111; padding: 40px; max-width: 800px; margin: 0 auto; line-height: 1.5; }
    .header { border-bottom: 2px solid #C5A880; padding-bottom: 20px; margin-bottom: 30px; display: flex; justify-content: space-between; align-items: flex-end; }
    .logo { font-size: 24px; font-weight: bold; letter-spacing: 2px; color: #55422D; }
    .subtitle { font-size: 12px; color: #666; text-transform: uppercase; letter-spacing: 1px; }
    .meta { display: grid; grid-template-cols: 1fr 1fr; gap: 20px; margin-bottom: 30px; background: #FAF8F5; padding: 15px; border-radius: 8px; font-size: 13px; }
    table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
    th { text-align: left; background: #F0ECE6; padding: 10px; font-size: 12px; text-transform: uppercase; border-bottom: 1px solid #ccc; }
    td { padding: 12px 10px; border-bottom: 1px solid #eee; font-size: 13px; }
    .text-right { text-align: right; }
    .totals { width: 300px; margin-left: auto; font-size: 13px; }
    .totals div { display: flex; justify-content: space-between; padding: 6px 0; }
    .grand-total { font-size: 18px; font-weight: bold; color: #55422D; border-top: 2px solid #55422D; padding-top: 10px; margin-top: 6px; }
    .footer { margin-top: 50px; border-top: 1px solid #ddd; padding-top: 20px; font-size: 11px; color: #777; text-align: center; }
  </style>
</head>
<body>
  <div class="header">
    <div>
      <div class="logo">ATELIER MAISON</div>
      <div class="subtitle">Architectural Spatial Quotation</div>
    </div>
    <div style="text-align: right; font-size: 12px; color: #666;">
      Date: ${new Date().toLocaleDateString('en-IN')}<br/>
      Quote Ref: AM-${Date.now().toString().slice(-6)}
    </div>
  </div>

  <div class="meta">
    <div>
      <strong>Prepared For:</strong> ${customerName}<br/>
      <strong>Space Type:</strong> ${roomType}<br/>
      <strong>Aesthetic Theme:</strong> ${styleName}
    </div>
    <div>
      <strong>Studio Director:</strong> ATELIER MAISON Architecture<br/>
      <strong>Currency:</strong> Indian Rupee (INR ₹)<br/>
      <strong>Tax Standard:</strong> GST 18% Applicable
    </div>
  </div>

  <table>
    <thead>
      <tr>
        <th>#</th>
        <th>Item Description</th>
        <th>Category</th>
        <th class="text-right">Qty</th>
        <th class="text-right">Unit Price (₹)</th>
        <th class="text-right">Total (₹)</th>
      </tr>
    </thead>
    <tbody>
      ${quotation.items.map((item, idx) => `
        <tr>
          <td>${idx + 1}</td>
          <td><strong>${item.name}</strong><br/><span style="font-size: 11px; color: #666;">${item.material}</span></td>
          <td>${item.category}</td>
          <td class="text-right">${item.quantity}</td>
          <td class="text-right">${formatter.format(item.unitPriceINR)}</td>
          <td class="text-right">${formatter.format(item.totalPriceINR)}</td>
        </tr>
      `).join('')}
    </tbody>
  </table>

  <div class="totals">
    <div><span>Furniture & Materials Subtotal:</span> <span>${formatter.format(quotation.subtotalINR)}</span></div>
    <div><span>Staging & Labor Fee:</span> <span>${formatter.format(quotation.laborInstallationINR)}</span></div>
    <div><span>GST (${quotation.gstPercentage}%):</span> <span>${formatter.format(quotation.gstINR)}</span></div>
    <div class="grand-total"><span>ESTIMATED TOTAL:</span> <span>${quotation.formattedGrandTotal}</span></div>
  </div>

  <div class="footer">
    <p>Thank you for choosing ATELIER MAISON Architectural Design Studio. All estimates valid for 30 days.</p>
  </div>
  <script>window.print();</script>
</body>
</html>`;

    printWindow.document.write(htmlContent);
    printWindow.document.close();
  };

  return (
    <div className="studio-card border-amber-600/30 rounded-2xl p-5 lg:p-7 space-y-6 shadow-2xl">
      
      {/* Quotation Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-stone-800 pb-4 gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
            <Receipt className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-serif font-bold text-lg text-stone-100 flex items-center gap-2">
              Itemized Customer Quotation Estimate (INR ₹)
            </h3>
            <p className="text-xs text-stone-400 font-sans">
              Complete cost breakdown for furniture, labor, surface finishes, and staging
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleCopyQuotationText}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-200 text-xs font-mono border border-stone-800 transition-all"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-amber-400" />}
            <span>{copied ? 'Copied!' : 'Copy Quote Text'}</span>
          </button>
          <button
            type="button"
            onClick={handlePrintQuotation}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-amber-800 hover:bg-amber-700 text-amber-50 text-xs font-serif font-bold border border-amber-500/50 shadow-md transition-all"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Invoice PDF</span>
          </button>
        </div>
      </div>

      {/* Customer Meta Input */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 rounded-xl bg-[#121316] border border-stone-800 text-xs">
        <div>
          <label className="block text-[10px] font-mono uppercase tracking-wider text-stone-500 mb-1">
            Client / Customer Name
          </label>
          <input
            type="text"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            className="w-full px-3 py-1.5 rounded-lg bg-[#0D0E11] border border-stone-800 text-stone-200 text-xs focus:outline-none focus:border-amber-600 font-sans"
            placeholder="e.g. Mr. Sharma"
          />
        </div>
        <div>
          <label className="block text-[10px] font-mono uppercase tracking-wider text-stone-500 mb-1">
            Space Category
          </label>
          <span className="block px-3 py-1.5 rounded-lg bg-[#0D0E11] border border-stone-800 text-stone-300 font-serif font-bold">
            {roomType} ({styleName})
          </span>
        </div>
        <div>
          <label className="block text-[10px] font-mono uppercase tracking-wider text-stone-500 mb-1">
            Tax Structure (GST)
          </label>
          <span className="block px-3 py-1.5 rounded-lg bg-[#0D0E11] border border-stone-800 text-amber-300 font-mono">
            18% Standard GST Included
          </span>
        </div>
      </div>

      {/* Itemized Quotation Table */}
      <div className="overflow-x-auto rounded-xl border border-stone-800">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#15161A] text-stone-400 font-mono text-[10px] uppercase border-b border-stone-800">
            <tr>
              <th className="py-3 px-4">#</th>
              <th className="py-3 px-4">Item & Material Spec</th>
              <th className="py-3 px-4">Category</th>
              <th className="py-3 px-4 text-center">Qty</th>
              <th className="py-3 px-4 text-right">Unit Price (₹)</th>
              <th className="py-3 px-4 text-right">Total Price (₹)</th>
              <th className="py-3 px-4 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-800/80 bg-[#121316]">
            {quotation.items.map((item, idx) => (
              <tr key={item.id} className="hover:bg-[#16171D] transition-colors">
                <td className="py-3 px-4 font-mono text-stone-500">{idx + 1}</td>
                <td className="py-3 px-4">
                  <span className="font-serif font-bold text-stone-100 block">{item.name}</span>
                  <span className="text-[10px] text-stone-400 block">{item.material}</span>
                </td>
                <td className="py-3 px-4">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-stone-900 text-amber-300 border border-stone-800">
                    {item.category}
                  </span>
                </td>
                <td className="py-3 px-4 text-center">
                  <div className="inline-flex items-center gap-1 bg-[#0D0E11] border border-stone-800 rounded-lg p-0.5 font-mono">
                    <button
                      type="button"
                      onClick={() => handleQuantityChange(item.id, -1)}
                      className="w-5 h-5 flex items-center justify-center text-stone-400 hover:text-white"
                    >
                      -
                    </button>
                    <span className="w-5 text-center text-stone-200 font-bold">{item.quantity}</span>
                    <button
                      type="button"
                      onClick={() => handleQuantityChange(item.id, 1)}
                      className="w-5 h-5 flex items-center justify-center text-stone-400 hover:text-white"
                    >
                      +
                    </button>
                  </div>
                </td>
                <td className="py-3 px-4 text-right font-mono text-stone-300">
                  {formatter.format(item.unitPriceINR)}
                </td>
                <td className="py-3 px-4 text-right font-mono font-bold text-amber-300">
                  {formatter.format(item.totalPriceINR)}
                </td>
                <td className="py-3 px-4 text-center">
                  <button
                    type="button"
                    onClick={() => handleDeleteItem(item.id)}
                    className="p-1 rounded text-stone-500 hover:text-rose-400 transition-colors"
                    title="Remove item from quotation"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Custom Item Form Toggle */}
      <div>
        {!showAddForm ? (
          <button
            type="button"
            onClick={() => setShowAddForm(true)}
            className="flex items-center gap-1.5 text-xs font-mono text-amber-400 hover:text-amber-300 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>+ Add Custom Line Item (e.g. False Ceiling, Custom Curtains, Electrical)</span>
          </button>
        ) : (
          <form onSubmit={handleAddItem} className="p-3.5 rounded-xl bg-[#0D0E11] border border-amber-600/40 space-y-3 animate-fadeIn">
            <h4 className="text-xs font-serif font-bold text-stone-200">Add Custom Line Item to Quotation</h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <input
                type="text"
                placeholder="Item Name (e.g. Custom Teak Dining Chairs)"
                value={newItemName}
                onChange={(e) => setNewItemName(e.target.value)}
                className="px-3 py-1.5 rounded-lg bg-[#121316] border border-stone-800 text-xs text-stone-100 placeholder-stone-500 focus:outline-none focus:border-amber-600"
                required
              />
              <select
                value={newItemCategory}
                onChange={(e) => setNewItemCategory(e.target.value)}
                className="px-3 py-1.5 rounded-lg bg-[#121316] border border-stone-800 text-xs text-stone-200 focus:outline-none focus:border-amber-600 font-mono"
              >
                <option value="Seating">Seating</option>
                <option value="Storage">Storage</option>
                <option value="Table">Table</option>
                <option value="Electrical & Lighting">Electrical & Lighting</option>
                <option value="Surface Finish">Surface Finish</option>
                <option value="Custom Fitting">Custom Fitting</option>
              </select>
              <input
                type="number"
                placeholder="Unit Price in ₹ (e.g. 25000)"
                value={newItemPrice}
                onChange={(e) => setNewItemPrice(e.target.value)}
                className="px-3 py-1.5 rounded-lg bg-[#121316] border border-stone-800 text-xs text-stone-100 font-mono focus:outline-none focus:border-amber-600"
                required
              />
            </div>
            <div className="flex items-center gap-2 justify-end">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-3 py-1.5 rounded-lg text-xs text-stone-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-lg text-xs font-bold text-amber-50 bg-amber-800 hover:bg-amber-700 border border-amber-600/50 shadow-md"
              >
                Add to Quotation
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Summary Totals Box */}
      <div className="p-5 rounded-xl bg-[#121316] border border-stone-800 space-y-2.5 max-w-md ml-auto text-xs">
        <div className="flex items-center justify-between text-stone-400">
          <span>Items Subtotal:</span>
          <span className="font-mono text-stone-200">{formatter.format(quotation.subtotalINR)}</span>
        </div>

        <div className="flex items-center justify-between text-stone-400">
          <span>Staging & On-Site Supervision Fee:</span>
          <span className="font-mono text-stone-200">{formatter.format(quotation.laborInstallationINR)}</span>
        </div>

        <div className="flex items-center justify-between text-stone-400">
          <span>GST Rate ({quotation.gstPercentage}%):</span>
          <span className="font-mono text-stone-200">{formatter.format(quotation.gstINR)}</span>
        </div>

        <div className="pt-3 border-t border-stone-800 flex items-center justify-between">
          <div>
            <span className="font-serif font-bold text-stone-100 text-base block">Grand Total Estimate</span>
            <span className="text-[10px] text-emerald-400 font-mono">Includes 18% GST & Sourcing Guarantee</span>
          </div>
          <span className="font-serif font-bold text-xl text-amber-300 tracking-wide">
            {quotation.formattedGrandTotal}
          </span>
        </div>
      </div>

    </div>
  );
};
