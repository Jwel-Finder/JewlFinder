import { useState } from 'react';
import { Star } from 'lucide-react';

const ReviewPanel = ({ storeName, onSubmit, onCancel }) => {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const maxChars = 500;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (rating === 0) {
      alert('Please select a rating');
      return;
    }
    console.log('Review submitted:', { rating, reviewText });
    onSubmit?.({ rating, reviewText });
  };

  return (
    <div className="p-6 flex flex-col h-full">
      {/* Store Info */}
      <div className="mb-6 pb-4 border-b border-gray-100">
        <p className="text-sm text-gray-500 font-sans mb-1">Reviewing</p>
        <h3 className="text-lg font-serif font-semibold text-charcoal">{storeName}</h3>
      </div>

      <form onSubmit={handleSubmit} className="flex-1 flex flex-col">
        {/* Scrollable Content */}
        <div className="space-y-6 flex-1 overflow-y-auto pr-2">
        {/* Star Rating */}
        <div>
          <label className="block text-sm font-serif font-semibold text-charcoal mb-3">
            Your Rating
          </label>
          <div className="flex items-center gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoveredRating(star)}
                onMouseLeave={() => setHoveredRating(0)}
                className="transition-transform hover:scale-110 focus:outline-none"
              >
                <Star
                  className={`w-10 h-10 transition-colors ${
                    star <= (hoveredRating || rating)
                      ? 'text-gold fill-current'
                      : 'text-gray-300'
                  }`}
                />
              </button>
            ))}
            {rating > 0 && (
              <span className="ml-2 text-sm text-gray-600 font-sans">
                {rating === 1 && 'Poor'}
                {rating === 2 && 'Fair'}
                {rating === 3 && 'Good'}
                {rating === 4 && 'Very Good'}
                {rating === 5 && 'Excellent'}
              </span>
            )}
          </div>
        </div>

        {/* Review Text */}
        <div>
          <label className="block text-sm font-serif font-semibold text-charcoal mb-2">
            Your Review
          </label>
          <textarea
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value.slice(0, maxChars))}
            placeholder="Share your experience with this boutique..."
            className="w-full h-40 px-4 py-3 border border-gray-200 rounded-lg focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none resize-none font-sans text-sm transition-all"
          />
          <div className="flex items-center justify-between mt-2">
            <p className="text-xs text-gray-400 font-sans">
              Be specific and helpful to others
            </p>
            <p className={`text-xs font-sans ${reviewText.length >= maxChars ? 'text-red-500' : 'text-gray-400'}`}>
              {reviewText.length} / {maxChars}
            </p>
          </div>
        </div>

        {/* Guidelines */}
        <div className="mt-6 p-4 bg-gold/5 rounded-lg border border-gold/10">
          <p className="text-xs font-serif font-semibold text-charcoal mb-2">Review Guidelines</p>
          <ul className="text-xs text-gray-600 font-sans space-y-1">
            <li>• Be honest and respectful</li>
            <li>• Focus on your personal experience</li>
            <li>• Mention product quality and service</li>
          </ul>
        </div>
        </div>

        {/* Action Buttons - Fixed at bottom */}
        <div className="flex gap-3 pt-6 border-t border-gray-100 mt-4">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 px-6 py-3 border-2 border-gray-300 rounded-lg text-gray-700 font-sans font-semibold hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex-1 px-6 py-3 border-2 border-gray-300 rounded-lg text-gray-700 font-sans font-semibold hover:bg-gray-50 transition-colors"
            disabled={rating === 0}
          >
            Submit Review
          </button>
        </div>
      </form>
    </div>
  );
};

export default ReviewPanel;
