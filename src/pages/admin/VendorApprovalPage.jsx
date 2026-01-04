import React, { useState } from 'react';
import { CheckCircle, XCircle, Building2, User, Mail, Phone, Calendar, AlertTriangle, Users } from 'lucide-react';
import EmptyState from '../../components/common/EmptyState';

const VendorApprovalPage = () => {
    // Mock data for vendor applications (since we don't have a backend for this yet)
    const [pendingVendors, setPendingVendors] = useState([
        { id: 1, businessName: 'Opulent Ornaments', ownerName: 'Rajesh Kumar', email: 'rajesh@opulent.com', phone: '+91 98765 43210', location: 'Mumbai, MH', appliedDate: '2023-10-26' },
        { id: 2, businessName: 'Silver Linings', ownerName: 'Priya Singh', email: 'priya@silverlinings.in', phone: '+91 98765 43211', location: 'Delhi, DL', appliedDate: '2023-10-25' },
        { id: 3, businessName: 'Gold Standard', ownerName: 'Amit Shah', email: 'amit@goldstandard.com', phone: '+91 98765 43212', location: 'Bangalore, KA', appliedDate: '2023-10-24' },
    ]);

    const handleApprove = (vendorId) => {
        setPendingVendors(pendingVendors.filter(v => v.id !== vendorId));
        // Logic to approve vendor (API call) would go here
        alert(`Vendor ${vendorId} Approved`);
    };

    const handleReject = (vendorId) => {
        if (window.confirm('Are you sure you want to reject this vendor application?')) {
            setPendingVendors(pendingVendors.filter(v => v.id !== vendorId));
            // Logic to reject vendor (API call) would go here
        }
    };

    return (
        <div className="min-h-screen bg-cream py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 border-b border-gold/20 pb-6">
                    <div>
                        <h1 className="text-4xl font-serif font-bold text-gray-900 mb-2">Partner Applications</h1>
                        <p className="text-gray-500 font-sans tracking-wide uppercase text-sm">Review applications from prospective jewelry partners</p>
                    </div>
                    <div className="mt-4 md:mt-0 flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 shadow-sm">
                        <Users className="w-4 h-4 text-gold" />
                        <span className="text-xs font-bold uppercase tracking-widest text-gray-600">{pendingVendors.length} New Applicants</span>
                    </div>
                </div>

                {/* Applications List */}
                {pendingVendors.length > 0 ? (
                    <div className="grid grid-cols-1 gap-6">
                        {pendingVendors.map(vendor => (
                            <div key={vendor.id} className="bg-white border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 p-8 flex flex-col md:flex-row items-center justify-between gap-8 group">
                                <div className="flex items-start gap-6 w-full md:w-auto">
                                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center border border-gray-100 text-gold shadow-inner">
                                        <Building2 className="w-7 h-7" />
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-serif font-bold text-gray-900 mb-1">{vendor.businessName}</h3>
                                        <p className="text-sm text-gray-500 font-sans mb-3">{vendor.ownerName} • {vendor.location}</p>

                                        <div className="flex flex-wrap gap-4 text-xs text-gray-400 font-bold uppercase tracking-wider">
                                            <div className="flex items-center gap-1">
                                                <Mail className="w-3 h-3" />
                                                {vendor.email}
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Phone className="w-3 h-3" />
                                                {vendor.phone}
                                            </div>
                                            <div className="flex items-center gap-1 text-gold">
                                                <Calendar className="w-3 h-3" />
                                                Applied: {vendor.appliedDate}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-4 w-full md:w-auto">
                                    <button
                                        onClick={() => handleApprove(vendor.id)}
                                        className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-black text-white hover:bg-green-600 transition-colors py-3 px-8 text-xs font-bold uppercase tracking-widest shadow-md"
                                    >
                                        <CheckCircle className="w-4 h-4" />
                                        Approve
                                    </button>
                                    <button
                                        onClick={() => handleReject(vendor.id)}
                                        className="flex-1 md:flex-none flex items-center justify-center gap-2 border border-gray-200 text-gray-500 hover:border-red-500 hover:text-red-500 hover:bg-red-50 transition-all py-3 px-8 text-xs font-bold uppercase tracking-widest"
                                    >
                                        <XCircle className="w-4 h-4" />
                                        Reject
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <EmptyState
                        type="vendor"
                        title="No New Applications"
                        message="There are currently no new vendor partner applications to review."
                    />
                )}

                {/* Info Note */}
                <div className="mt-12 bg-blue-50/50 border border-blue-100 p-6 flex gap-4">
                    <AlertTriangle className="w-6 h-6 text-blue-400 flex-shrink-0" />
                    <div>
                        <h4 className="font-serif font-bold text-gray-900 mb-1">Standard Vetting Process</h4>
                        <p className="text-sm text-gray-600 font-sans leading-relaxed">
                            Please ensure all due diligence documents (Business Registration, GSTIN, PAN) are verified before approving a new vendor partner.
                            Approved vendors will immediately gain access to the vendor dashboard and can start listing products.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VendorApprovalPage;
