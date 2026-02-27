/**
 * Billing calculation utilities – all pure functions, zero side effects.
 * Currency: ₹ (INR), weight unit: grams.
 */

// ─── Calculation helpers ──────────────────────────────────────────────

/** Gold value = net weight × gold rate */
export const calcGoldValue = (netWeight, goldRate) =>
    parseFloat(((Number(netWeight) || 0) * (Number(goldRate) || 0)).toFixed(2));

/**
 * Resolve a charge's flat ₹ value.
 * The UI keeps percent & value in sync, so we just read the flat value.
 */
export const calcCharge = (flatValue) =>
    parseFloat((Number(flatValue) || 0).toFixed(2));

/** Convert a flat charge to its percentage relative to a base (gold value). */
export const chargeToPercent = (base, flatValue) => {
    if (!base) return '';
    const pct = ((Number(flatValue) || 0) / base) * 100;
    return pct ? parseFloat(pct.toFixed(4)) : '';
};

/** Convert a percentage charge to its flat value relative to a base (gold value). */
export const percentToCharge = (base, percent) => {
    const val = (base * (Number(percent) || 0)) / 100;
    return val ? parseFloat(val.toFixed(2)) : '';
};

/** Subtotal for a single line item (before GST). */
export const calcItemSubtotal = (item) => {
    const goldValue = calcGoldValue(item.netWeight, item.goldRate);
    const making = calcCharge(item.makingChargeValue);
    const wastage = calcCharge(item.wastageValue);
    return parseFloat((goldValue + making + wastage).toFixed(2));
};

/** GST @ 3 % on jewellery. */
export const calcGST = (subtotal, enabled = true) =>
    enabled ? parseFloat((subtotal * 0.03).toFixed(2)) : 0;

/** Grand total across all items, with optional rounding. */
export const calcBillTotal = (items = [], roundOff = false) => {
    let total = 0;
    items.forEach((item) => {
        const sub = calcItemSubtotal(item);
        const gst = calcGST(sub, item.gstEnabled);
        total += sub + gst;
    });
    total = parseFloat(total.toFixed(2));
    return roundOff ? Math.round(total) : total;
};

/** Compute a full breakdown for a single item (used in the preview). */
export const calcItemBreakdown = (item) => {
    const goldValue = calcGoldValue(item.netWeight, item.goldRate);
    const making = calcCharge(item.makingChargeValue);
    const wastage = calcCharge(item.wastageValue);
    const subtotal = parseFloat((goldValue + making + wastage).toFixed(2));
    const gst = calcGST(subtotal, item.gstEnabled);
    const itemTotal = parseFloat((subtotal + gst).toFixed(2));
    return { goldValue, making, wastage, subtotal, gst, itemTotal };
};

// ─── Bill metadata helpers ────────────────────────────────────────────

/** Timestamp-based unique bill number: JF-YYYYMMDD-XXXX */
export const generateBillNumber = () => {
    const d = new Date();
    const date = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}`;
    const rand = String(Math.floor(1000 + Math.random() * 9000));
    return `JF-${date}-${rand}`;
};

/** Plain-text bill summary for WhatsApp / clipboard. */
export const generateBillText = (bill, vendor) => {
    const lines = [];
    lines.push(`── ${vendor.shopName || 'Gold Shop'} ──`);
    if (vendor.address) lines.push(vendor.address);
    if (vendor.gstNumber) lines.push(`GSTIN: ${vendor.gstNumber}`);
    lines.push('');
    lines.push(`Bill No: ${bill.billNumber}`);
    lines.push(`Date: ${new Date(bill.date).toLocaleDateString('en-IN')}`);
    lines.push('');
    lines.push(`Customer: ${bill.customer.name}`);
    if (bill.customer.phone) lines.push(`Phone: ${bill.customer.phone}`);
    lines.push('');
    lines.push('── Items ──');

    bill.items.forEach((item, i) => {
        const bd = calcItemBreakdown(item);
        lines.push(`${i + 1}. ${item.itemName} (${item.purity})`);
        lines.push(`   Net Wt: ${item.netWeight}g | Rate: ₹${Number(item.goldRate).toLocaleString('en-IN')}/g`);
        lines.push(`   Gold Value: ₹${bd.goldValue.toLocaleString('en-IN')}`);
        if (bd.making) lines.push(`   Making: ₹${bd.making.toLocaleString('en-IN')}${item.makingChargePercent ? ` (${item.makingChargePercent}%)` : ''}`);
        if (bd.wastage) lines.push(`   Wastage: ₹${bd.wastage.toLocaleString('en-IN')}${item.wastagePercent ? ` (${item.wastagePercent}%)` : ''}`);
        if (bd.gst) lines.push(`   GST (3%): ₹${bd.gst.toLocaleString('en-IN')}`);
        lines.push(`   Total: ₹${bd.itemTotal.toLocaleString('en-IN')}`);
    });

    lines.push('');
    lines.push(`Grand Total: ₹${Number(bill.grandTotal).toLocaleString('en-IN')}`);
    lines.push(`Payment: ${bill.paymentStatus} (${bill.paymentMode})`);
    if (bill.customer.notes) lines.push(`Notes: ${bill.customer.notes}`);
    return lines.join('\n');
};

// ─── Default objects ──────────────────────────────────────────────────

export const defaultItem = () => ({
    id: Date.now() + Math.random(),
    itemName: 'Ring',
    customItemName: '',
    purity: '22K',
    customPurity: '',
    grossWeight: '',
    netWeight: '',
    goldRate: '',
    makingChargePercent: '',
    makingChargeValue: '',
    wastagePercent: '',
    wastageValue: '',
    gstEnabled: true,
});

export const defaultCustomer = () => ({
    name: '',
    phone: '',
    notes: '',
});
