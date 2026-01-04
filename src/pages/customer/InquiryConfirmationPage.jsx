import { useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle, ArrowRight, Eye } from 'lucide-react';

const InquiryConfirmationPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const inquiry = location.state?.inquiry;

    if (!inquiry) {
        navigate('/customer/home');
        return null;
    }

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
            <div className="max-w-2xl w-full">
                <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
                    {/* Success Icon */}
                    <div className="flex justify-center mb-6">
                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                            <CheckCircle className="w-12 h-12 text-green-500" />
                        </div>
                    </div>

                    {/* Heading */}
                    <h1 className="text-3xl font-bold text-gray-800 mb-4">
                        Inquiry Sent Successfully!
                    </h1>

                    <p className="text-lg text-gray-600 mb-8">
                        Your inquiry has been sent to <span className="font-semibold text-primary-600">{inquiry.storeName}</span>.
                        The vendor will contact you soon.
                    </p>

                    {/* Inquiry Details */}
                    <div className="bg-gray-50 rounded-xl p-6 mb-8 text-left">
                        <h2 className="text-lg font-semibold text-gray-800 mb-4">Inquiry Details</h2>
                        <div className="space-y-3">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Design:</span>
                                <span className="font-medium text-gray-800">{inquiry.designName}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Store:</span>
                                <span className="font-medium text-gray-800">{inquiry.storeName}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Method:</span>
                                <span className="font-medium text-gray-800 capitalize">{inquiry.inquiryType}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Status:</span>
                                <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm font-semibold">
                                    Pending
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Next Steps */}
                    <div className="bg-primary-50 rounded-xl p-6 mb-8 text-left">
                        <h2 className="text-lg font-semibold text-gray-800 mb-3">What's Next?</h2>
                        <ul className="space-y-2 text-gray-700">
                            <li className="flex items-start gap-2">
                                <ArrowRight className="w-5 h-5 text-primary-600 mt-0.5 flex-shrink-0" />
                                <span>The vendor will review your inquiry</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <ArrowRight className="w-5 h-5 text-primary-600 mt-0.5 flex-shrink-0" />
                                <span>You'll be contacted via phone or email</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <ArrowRight className="w-5 h-5 text-primary-600 mt-0.5 flex-shrink-0" />
                                <span>Schedule a store visit to see the design</span>
                            </li>
                        </ul>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4">
                        <button
                            onClick={() => navigate('/customer/inquiries')}
                            className="flex-1 flex items-center justify-center gap-2 gradient-primary text-white font-semibold py-3 px-6 rounded-lg hover:shadow-lg transform hover:scale-105 transition duration-200"
                        >
                            <Eye className="w-5 h-5" />
                            View My Inquiries
                        </button>
                        <button
                            onClick={() => navigate('/customer/home')}
                            className="flex-1 bg-gray-200 text-gray-700 font-semibold py-3 px-6 rounded-lg hover:bg-gray-300 transition duration-200"
                        >
                            Back to Home
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InquiryConfirmationPage;
