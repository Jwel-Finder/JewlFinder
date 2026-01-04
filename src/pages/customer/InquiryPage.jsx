import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDesignStore } from '../../store/designStore';
import { useStoreStore } from '../../store/storeStore';
import { useInquiryStore } from '../../store/inquiryStore';
import { useAuthStore } from '../../store/authStore';
import { Phone, MessageCircle, Mail, Send, CheckCircle } from 'lucide-react';

const InquiryPage = () => {
    const { designId } = useParams();
    const navigate = useNavigate();
    const { getDesignById } = useDesignStore();
    const { getStoreById } = useStoreStore();
    const { createInquiry } = useInquiryStore();
    const { user } = useAuthStore();

    const [design, setDesign] = useState(null);
    const [store, setStore] = useState(null);
    const [inquiryType, setInquiryType] = useState('message');
    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        phone: user?.phone || '',
        message: ''
    });
    const [submitted, setSubmitted] = useState(false);

    useEffect(() => {
        const designData = getDesignById(designId);
        setDesign(designData);

        if (designData) {
            const storeData = getStoreById(designData.storeId);
            setStore(storeData);
        }
    }, [designId]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!design || !store) return;

        const inquiryData = {
            customerId: user.id,
            customerName: formData.name,
            customerEmail: formData.email,
            customerPhone: formData.phone,
            storeId: store.id,
            storeName: store.name,
            designId: design.id,
            designName: design.name,
            message: formData.message,
            inquiryType
        };

        createInquiry(inquiryData);
        setSubmitted(true);

        // Navigate to confirmation after 2 seconds
        setTimeout(() => {
            navigate('/customer/inquiry-confirmation', {
                state: { inquiry: inquiryData }
            });
        }, 2000);
    };

    const handleCall = () => {
        if (store) {
            window.location.href = `tel:${store.phone}`;

            // Still create inquiry record
            const inquiryData = {
                customerId: user.id,
                customerName: user.name,
                customerEmail: user.email,
                customerPhone: user.phone,
                storeId: store.id,
                storeName: store.name,
                designId: design.id,
                designName: design.name,
                message: 'Customer called for inquiry',
                inquiryType: 'call'
            };
            createInquiry(inquiryData);
        }
    };

    const handleWhatsApp = () => {
        if (store && design) {
            const message = `Hi, I'm interested in ${design.name} from your store ${store.name}. Can we schedule a visit?`;
            const whatsappUrl = `https://wa.me/${store.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(message)}`;
            window.open(whatsappUrl, '_blank');

            // Create inquiry record
            const inquiryData = {
                customerId: user.id,
                customerName: user.name,
                customerEmail: user.email,
                customerPhone: user.phone,
                storeId: store.id,
                storeName: store.name,
                designId: design.id,
                designName: design.name,
                message: 'Customer contacted via WhatsApp',
                inquiryType: 'whatsapp'
            };
            createInquiry(inquiryData);

            // Navigate to confirmation
            navigate('/customer/inquiry-confirmation', {
                state: { inquiry: inquiryData }
            });
        }
    };

    if (!design || !store) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p>Loading...</p>
            </div>
        );
    }

    if (submitted) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Inquiry Sent!</h2>
                    <p className="text-gray-600">Redirecting...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                    {/* Header with Design Info */}
                    <div className="bg-gradient-to-r from-primary-500 to-primary-600 p-6 text-white">
                        <h1 className="text-3xl font-bold mb-2">Send Inquiry</h1>
                        <p className="text-primary-100">Get in touch with the store about this design</p>
                    </div>

                    {/* Design Preview */}
                    <div className="p-6 bg-gray-50 border-b border-gray-200">
                        <div className="flex items-center gap-4">
                            <img
                                src={design.images[0]}
                                alt={design.name}
                                className="w-24 h-24 object-cover rounded-lg"
                            />
                            <div>
                                <h3 className="text-lg font-bold text-gray-800">{design.name}</h3>
                                <p className="text-gray-600">{store.name}</p>
                                <p className="text-sm text-gray-500">{store.city}</p>
                            </div>
                        </div>
                    </div>

                    {/* Inquiry Type Selection */}
                    <div className="p-6 border-b border-gray-200">
                        <h2 className="text-xl font-bold text-gray-800 mb-4">Choose Inquiry Method</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <button
                                onClick={() => setInquiryType('call')}
                                className={`p-4 rounded-lg border-2 transition ${inquiryType === 'call'
                                        ? 'border-primary-500 bg-primary-50'
                                        : 'border-gray-200 hover:border-primary-300'
                                    }`}
                            >
                                <Phone className="w-8 h-8 mx-auto mb-2 text-primary-600" />
                                <p className="font-semibold text-gray-800">Call</p>
                                <p className="text-xs text-gray-500">Direct phone call</p>
                            </button>

                            <button
                                onClick={() => setInquiryType('whatsapp')}
                                className={`p-4 rounded-lg border-2 transition ${inquiryType === 'whatsapp'
                                        ? 'border-primary-500 bg-primary-50'
                                        : 'border-gray-200 hover:border-primary-300'
                                    }`}
                            >
                                <MessageCircle className="w-8 h-8 mx-auto mb-2 text-primary-600" />
                                <p className="font-semibold text-gray-800">WhatsApp</p>
                                <p className="text-xs text-gray-500">Chat via WhatsApp</p>
                            </button>

                            <button
                                onClick={() => setInquiryType('message')}
                                className={`p-4 rounded-lg border-2 transition ${inquiryType === 'message'
                                        ? 'border-primary-500 bg-primary-50'
                                        : 'border-gray-200 hover:border-primary-300'
                                    }`}
                            >
                                <Mail className="w-8 h-8 mx-auto mb-2 text-primary-600" />
                                <p className="font-semibold text-gray-800">Message</p>
                                <p className="text-xs text-gray-500">Send a message</p>
                            </button>
                        </div>
                    </div>

                    {/* Inquiry Form or Quick Actions */}
                    <div className="p-6">
                        {inquiryType === 'call' && (
                            <div className="text-center">
                                <p className="text-gray-600 mb-6">Click the button below to call the store</p>
                                <button
                                    onClick={handleCall}
                                    className="gradient-primary text-white font-semibold py-3 px-8 rounded-lg hover:shadow-lg transform hover:scale-105 transition duration-200 inline-flex items-center gap-2"
                                >
                                    <Phone className="w-5 h-5" />
                                    Call {store.phone}
                                </button>
                            </div>
                        )}

                        {inquiryType === 'whatsapp' && (
                            <div className="text-center">
                                <p className="text-gray-600 mb-6">Click the button below to chat on WhatsApp</p>
                                <button
                                    onClick={handleWhatsApp}
                                    className="gradient-primary text-white font-semibold py-3 px-8 rounded-lg hover:shadow-lg transform hover:scale-105 transition duration-200 inline-flex items-center gap-2"
                                >
                                    <MessageCircle className="w-5 h-5" />
                                    Open WhatsApp
                                </button>
                            </div>
                        )}

                        {inquiryType === 'message' && (
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Your Name
                                        </label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Email
                                        </label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Phone Number
                                    </label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Message
                                    </label>
                                    <textarea
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        rows="5"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none resize-none"
                                        placeholder="Tell the store about your interest in this design..."
                                        required
                                    ></textarea>
                                </div>

                                <button
                                    type="submit"
                                    className="w-full gradient-primary text-white font-semibold py-3 px-6 rounded-lg hover:shadow-lg transform hover:scale-105 transition duration-200 flex items-center justify-center gap-2"
                                >
                                    <Send className="w-5 h-5" />
                                    Send Inquiry
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InquiryPage;
