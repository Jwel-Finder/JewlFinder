import { create } from 'zustand';
import { getInquiries, setInquiries } from '../utils/localStorage';

export const useInquiryStore = create((set, get) => ({
    inquiries: [],

    // Initialize inquiries from localStorage
    initInquiries: () => {
        const savedInquiries = getInquiries();
        set({ inquiries: savedInquiries });
    },

    // Get all inquiries
    getAllInquiries: () => {
        return get().inquiries;
    },

    // Get inquiry by ID
    getInquiryById: (id) => {
        return get().inquiries.find(inquiry => inquiry.id === id);
    },

    // Get inquiries by customer ID
    getInquiriesByCustomer: (customerId) => {
        return get().inquiries.filter(inquiry => inquiry.customerId === customerId);
    },

    // Get inquiries by store ID (for vendors)
    getInquiriesByStore: (storeId) => {
        return get().inquiries.filter(inquiry => inquiry.storeId === storeId);
    },

    // Get inquiries by design ID
    getInquiriesByDesign: (designId) => {
        return get().inquiries.filter(inquiry => inquiry.designId === designId);
    },

    // Get inquiries by status
    getInquiriesByStatus: (status) => {
        return get().inquiries.filter(inquiry => inquiry.status === status);
    },

    // Create new inquiry
    createInquiry: (inquiryData) => {
        const newInquiry = {
            ...inquiryData,
            id: `inquiry-${Date.now()}`,
            status: 'pending',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        const updatedInquiries = [...get().inquiries, newInquiry];
        set({ inquiries: updatedInquiries });
        setInquiries(updatedInquiries);
        return newInquiry;
    },

    // Update inquiry status
    updateInquiryStatus: (id, status, additionalData = {}) => {
        const updatedInquiries = get().inquiries.map(inquiry =>
            inquiry.id === id ? {
                ...inquiry,
                status,
                ...additionalData,
                updatedAt: new Date().toISOString()
            } : inquiry
        );
        set({ inquiries: updatedInquiries });
        setInquiries(updatedInquiries);
    },

    // Accept inquiry (vendor)
    acceptInquiry: (id, visitDate) => {
        const updatedInquiries = get().inquiries.map(inquiry =>
            inquiry.id === id ? {
                ...inquiry,
                status: 'accepted',
                visitDate,
                updatedAt: new Date().toISOString()
            } : inquiry
        );
        set({ inquiries: updatedInquiries });
        setInquiries(updatedInquiries);
    },

    // Reject inquiry (vendor)
    rejectInquiry: (id, reason = '') => {
        const updatedInquiries = get().inquiries.map(inquiry =>
            inquiry.id === id ? {
                ...inquiry,
                status: 'rejected',
                rejectionReason: reason,
                updatedAt: new Date().toISOString()
            } : inquiry
        );
        set({ inquiries: updatedInquiries });
        setInquiries(updatedInquiries);
    },

    // Schedule visit
    scheduleVisit: (id, visitDate) => {
        const updatedInquiries = get().inquiries.map(inquiry =>
            inquiry.id === id ? {
                ...inquiry,
                status: 'scheduled',
                visitDate,
                updatedAt: new Date().toISOString()
            } : inquiry
        );
        set({ inquiries: updatedInquiries });
        setInquiries(updatedInquiries);
    },

    // Mark visit as completed
    completeVisit: (id, notes = '') => {
        const updatedInquiries = get().inquiries.map(inquiry =>
            inquiry.id === id ? {
                ...inquiry,
                status: 'completed',
                completionNotes: notes,
                updatedAt: new Date().toISOString()
            } : inquiry
        );
        set({ inquiries: updatedInquiries });
        setInquiries(updatedInquiries);
    },

    // Delete inquiry
    deleteInquiry: (id) => {
        const updatedInquiries = get().inquiries.filter(inquiry => inquiry.id !== id);
        set({ inquiries: updatedInquiries });
        setInquiries(updatedInquiries);
    }
}));
