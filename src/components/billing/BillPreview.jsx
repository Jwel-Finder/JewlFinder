import { calcItemBreakdown, calcBillTotal } from '../../utils/billingUtils';

/**
 * BillPreview – print-ready invoice component.
 * Props:
 *   bill     – { customer, items, paymentStatus, paymentMode, billNumber, date }
 *   vendor   – { shopName, logo, address, gstNumber }
 *   style    – 'simple' | 'detailed'
 *   roundOff – boolean
 */
const BillPreview = ({ bill, vendor, style = 'detailed', roundOff = false }) => {
    if (!bill || !bill.items?.length) {
        return (
            <div className="flex flex-col items-center justify-center h-64 text-center">
                <p className="text-gray-400 font-serif italic text-sm">
                    Add items to see the live bill preview
                </p>
            </div>
        );
    }

    const grandTotal = calcBillTotal(bill.items, roundOff);
    const isDetailed = style === 'detailed';

    // Compute breakdowns
    const breakdowns = bill.items.map((item) => ({
        ...item,
        ...calcItemBreakdown(item),
    }));

    const totalSubtotal = breakdowns.reduce((s, b) => s + b.subtotal, 0);
    const totalGST = breakdowns.reduce((s, b) => s + b.gst, 0);

    return (
        <div id="bill-preview-content" className="bg-white p-6 sm:p-8 border border-gold/20 rounded-lg font-sans text-sm print:border-none print:shadow-none print:p-0">
            {/* ── Header ───────────────────────────────────── */}
            <div className="text-center border-b border-gold/20 pb-5 mb-5">
                {vendor.logo && (
                    <img
                        src={vendor.logo}
                        alt="Shop Logo"
                        className="w-16 h-16 mx-auto mb-3 object-contain rounded-full border border-gold/20"
                    />
                )}
                <h2 className="text-2xl font-serif font-bold text-gray-900">
                    {vendor.shopName || 'Gold Shop'}
                </h2>
                {vendor.address && <p className="text-xs text-gray-500 mt-1">{vendor.address}</p>}
                {vendor.gstNumber && (
                    <p className="text-[11px] text-gray-400 mt-0.5">GSTIN: {vendor.gstNumber}</p>
                )}
                <div className="mt-3 inline-block px-3 py-1 bg-gold/5 border border-gold/15 rounded-full">
                    <span className="text-[11px] text-gold-dark font-bold tracking-widest uppercase">Tax Invoice</span>
                </div>
            </div>

            {/* ── Bill Info + Customer ──────────────────────── */}
            <div className="grid grid-cols-2 gap-4 mb-5 text-xs">
                <div>
                    <p className="text-gray-400 uppercase tracking-wider text-[10px] mb-1">Bill No</p>
                    <p className="font-bold text-gray-900">{bill.billNumber || '—'}</p>
                    <p className="text-gray-400 uppercase tracking-wider text-[10px] mt-2 mb-1">Date</p>
                    <p className="text-gray-700">{bill.date ? new Date(bill.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
                </div>
                <div className="text-right">
                    <p className="text-gray-400 uppercase tracking-wider text-[10px] mb-1">Customer</p>
                    <p className="font-bold text-gray-900">{bill.customer?.name || '—'}</p>
                    {bill.customer?.phone && <p className="text-gray-500 mt-0.5">{bill.customer.phone}</p>}
                </div>
            </div>

            {/* ── Items Table ───────────────────────────────── */}
            <div className="overflow-x-auto mb-5">
                <table className="w-full text-xs">
                    <thead>
                        <tr className="border-b-2 border-gold/20">
                            <th className="text-left py-2 text-gray-500 uppercase tracking-wider text-[10px] font-bold">#</th>
                            <th className="text-left py-2 text-gray-500 uppercase tracking-wider text-[10px] font-bold">Item</th>
                            {isDetailed && (
                                <>
                                    <th className="text-right py-2 text-gray-500 uppercase tracking-wider text-[10px] font-bold">Purity</th>
                                    <th className="text-right py-2 text-gray-500 uppercase tracking-wider text-[10px] font-bold">Gr. Wt</th>
                                    <th className="text-right py-2 text-gray-500 uppercase tracking-wider text-[10px] font-bold">Net Wt</th>
                                    <th className="text-right py-2 text-gray-500 uppercase tracking-wider text-[10px] font-bold">Rate/g</th>
                                    <th className="text-right py-2 text-gray-500 uppercase tracking-wider text-[10px] font-bold">Gold Val</th>
                                    <th className="text-right py-2 text-gray-500 uppercase tracking-wider text-[10px] font-bold">Making</th>
                                    <th className="text-right py-2 text-gray-500 uppercase tracking-wider text-[10px] font-bold">Wastage</th>
                                    <th className="text-right py-2 text-gray-500 uppercase tracking-wider text-[10px] font-bold">GST</th>
                                </>
                            )}
                            <th className="text-right py-2 text-gray-500 uppercase tracking-wider text-[10px] font-bold">Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {breakdowns.map((b, i) => {
                            const displayName = b.itemName === 'Custom' ? (b.customItemName || 'Custom') : b.itemName;
                            const displayPurity = b.purity === 'Custom' ? (b.customPurity || 'Custom') : b.purity;
                            return (
                                <tr key={b.id || i} className="border-b border-gray-100">
                                    <td className="py-2.5 text-gray-500">{i + 1}</td>
                                    <td className="py-2.5 font-medium text-gray-900">{displayName}</td>
                                    {isDetailed && (
                                        <>
                                            <td className="py-2.5 text-right text-gray-700">{displayPurity}</td>
                                            <td className="py-2.5 text-right text-gray-700">{b.grossWeight || '—'}g</td>
                                            <td className="py-2.5 text-right text-gray-700">{b.netWeight || '—'}g</td>
                                            <td className="py-2.5 text-right text-gray-700">₹{Number(b.goldRate || 0).toLocaleString('en-IN')}</td>
                                            <td className="py-2.5 text-right text-gray-700">₹{b.goldValue.toLocaleString('en-IN')}</td>
                                            <td className="py-2.5 text-right text-gray-700">₹{b.making.toLocaleString('en-IN')}{b.makingChargePercent ? <span className="text-gray-400 text-[9px] ml-0.5">({b.makingChargePercent}%)</span> : null}</td>
                                            <td className="py-2.5 text-right text-gray-700">₹{b.wastage.toLocaleString('en-IN')}{b.wastagePercent ? <span className="text-gray-400 text-[9px] ml-0.5">({b.wastagePercent}%)</span> : null}</td>
                                            <td className="py-2.5 text-right text-gray-700">{b.gstEnabled ? `₹${b.gst.toLocaleString('en-IN')}` : '—'}</td>
                                        </>
                                    )}
                                    <td className="py-2.5 text-right font-bold text-gray-900">₹{b.itemTotal.toLocaleString('en-IN')}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* ── Totals ────────────────────────────────────── */}
            <div className="border-t-2 border-gold/20 pt-4 space-y-1.5 text-xs">
                {isDetailed && (
                    <>
                        <div className="flex justify-between text-gray-600">
                            <span>Subtotal</span>
                            <span>₹{totalSubtotal.toLocaleString('en-IN')}</span>
                        </div>
                        <div className="flex justify-between text-gray-600">
                            <span>GST (3%)</span>
                            <span>₹{totalGST.toLocaleString('en-IN')}</span>
                        </div>
                        {roundOff && (
                            <div className="flex justify-between text-gray-400 text-[11px]">
                                <span>Round-off</span>
                                <span>{(grandTotal - (totalSubtotal + totalGST)).toFixed(2)}</span>
                            </div>
                        )}
                    </>
                )}
                <div className="flex justify-between text-base font-serif font-bold text-gray-900 pt-2 border-t border-gold/10">
                    <span>Grand Total</span>
                    <span className="text-gold-dark">₹{grandTotal.toLocaleString('en-IN')}</span>
                </div>
            </div>

            {/* ── Payment Status ────────────────────────────── */}
            <div className="mt-5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] uppercase tracking-widest font-bold border
            ${bill.paymentStatus === 'Paid' ? 'bg-green-50 text-green-700 border-green-200' :
                            bill.paymentStatus === 'Partial' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                                'bg-red-50 text-red-600 border-red-200'}`}>
                        {bill.paymentStatus}
                    </span>
                    <span className="text-[11px] text-gray-400">{bill.paymentMode}</span>
                </div>
            </div>

            {/* ── Notes ──────────────────────────────────────── */}
            {bill.customer?.notes && (
                <div className="mt-4 p-3 bg-cream/60 border border-gold/10 rounded-md">
                    <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-1">Notes</p>
                    <p className="text-xs text-gray-600">{bill.customer.notes}</p>
                </div>
            )}

            {/* ── Footer ─────────────────────────────────────── */}
            <div className="mt-6 pt-4 border-t border-gray-100 text-center">
                <p className="text-[10px] text-gray-400 uppercase tracking-widest">Thank you for your purchase</p>
            </div>
        </div>
    );
};

export default BillPreview;
