import { Check } from 'lucide-react';

const StatusTracker = ({ currentStatus, timestamps = {} }) => {
    const stages = [
        {
            key: 'posted',
            label: 'Posted',
            description: 'Request submitted'
        },
        {
            key: 'vendor_contacted',
            label: 'Vendor Contacted',
            description: 'Quote received'
        },
        {
            key: 'in_progress',
            label: 'In Progress',
            description: 'Repair started'
        },
        {
            key: 'completed',
            label: 'Completed',
            description: 'Repair finished'
        }
    ];

    const getStatusIndex = (status) => {
        return stages.findIndex(stage => stage.key === status);
    };

    const currentIndex = getStatusIndex(currentStatus);

    const isStageCompleted = (index) => {
        return index <= currentIndex;
    };

    const isCurrentStage = (index) => {
        return index === currentIndex;
    };

    const formatDate = (timestamp) => {
        if (!timestamp) return null;
        const date = new Date(timestamp);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

    return (
        <div className="bg-white p-6 md:p-8 rounded-lg border border-gray-100 shadow-sm">
            {/* Title */}
            <h3 className="text-lg font-serif font-semibold text-charcoal mb-6">
                Repair Status
            </h3>

            {/* Progress Bar - Desktop (Horizontal) */}
            <div className="hidden md:block">
                <div className="flex items-center justify-between relative">
                    {/* Progress Line */}
                    <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-200 -z-10" />
                    <div
                        className="absolute top-5 left-0 h-0.5 bg-gold transition-all duration-500 -z-10"
                        style={{
                            width: `${(currentIndex / (stages.length - 1)) * 100}%`
                        }}
                    />

                    {/* Stages */}
                    {stages.map((stage, index) => (
                        <div key={stage.key} className="flex flex-col items-center relative flex-1">
                            {/* Circle */}
                            <div
                                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                                    isStageCompleted(index)
                                        ? 'bg-gold text-white shadow-md'
                                        : 'bg-white border-2 border-gray-300 text-gray-400'
                                }`}
                            >
                                {isStageCompleted(index) ? (
                                    <Check className="w-5 h-5" strokeWidth={3} />
                                ) : (
                                    <span className="text-xs font-bold">{index + 1}</span>
                                )}
                            </div>

                            {/* Label */}
                            <div className="mt-3 text-center max-w-[120px]">
                                <p
                                    className={`text-xs font-serif font-semibold ${
                                        isCurrentStage(index)
                                            ? 'text-gold'
                                            : isStageCompleted(index)
                                            ? 'text-charcoal'
                                            : 'text-gray-400'
                                    }`}
                                >
                                    {stage.label}
                                </p>
                                <p className="text-[10px] text-gray-400 font-sans mt-0.5">
                                    {stage.description}
                                </p>
                                {isStageCompleted(index) && timestamps[stage.key] && (
                                    <p className="text-[10px] text-gold font-sans mt-1">
                                        {formatDate(timestamps[stage.key])}
                                    </p>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Progress Bar - Mobile (Vertical) */}
            <div className="md:hidden space-y-4">
                {stages.map((stage, index) => (
                    <div key={stage.key} className="flex items-start gap-4 relative">
                        {/* Vertical Line */}
                        {index < stages.length - 1 && (
                            <div className="absolute left-5 top-10 bottom-0 w-0.5 bg-gray-200 -translate-x-1/2" />
                        )}
                        {index < stages.length - 1 && isStageCompleted(index) && (
                            <div className="absolute left-5 top-10 w-0.5 bg-gold transition-all duration-500 -translate-x-1/2"
                                style={{
                                    height: isStageCompleted(index + 1) ? '100%' : '0%'
                                }}
                            />
                        )}

                        {/* Circle */}
                        <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
                                isStageCompleted(index)
                                    ? 'bg-gold text-white shadow-md'
                                    : 'bg-white border-2 border-gray-300 text-gray-400'
                            }`}
                        >
                            {isStageCompleted(index) ? (
                                <Check className="w-5 h-5" strokeWidth={3} />
                            ) : (
                                <span className="text-xs font-bold">{index + 1}</span>
                            )}
                        </div>

                        {/* Content */}
                        <div className="flex-1 pt-2">
                            <p
                                className={`text-sm font-serif font-semibold ${
                                    isCurrentStage(index)
                                        ? 'text-gold'
                                        : isStageCompleted(index)
                                        ? 'text-charcoal'
                                        : 'text-gray-400'
                                }`}
                            >
                                {stage.label}
                            </p>
                            <p className="text-xs text-gray-400 font-sans mt-0.5">
                                {stage.description}
                            </p>
                            {isStageCompleted(index) && timestamps[stage.key] && (
                                <p className="text-xs text-gold font-sans mt-1">
                                    {formatDate(timestamps[stage.key])}
                                </p>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default StatusTracker;
