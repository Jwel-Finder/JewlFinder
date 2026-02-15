import { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';

const ImageUpload = ({ images = [], onChange, maxImages = 5 }) => {
    const [dragActive, setDragActive] = useState(false);
    const fileInputRef = useRef(null);

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    };

    const validateFile = (file) => {
        // Check file type
        const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
        if (!validTypes.includes(file.type)) {
            alert('Only JPG, JPEG, and PNG images are allowed');
            return false;
        }

        // Check file size (max 5MB)
        const maxSize = 5 * 1024 * 1024; // 5MB in bytes
        if (file.size > maxSize) {
            alert('File size must be less than 5MB');
            return false;
        }

        return true;
    };

    const processFiles = (files) => {
        const fileArray = Array.from(files);

        // Check max images limit
        if (images.length + fileArray.length > maxImages) {
            alert(`You can only upload up to ${maxImages} images`);
            return;
        }

        // Validate and convert each file
        fileArray.forEach(file => {
            if (validateFile(file)) {
                const reader = new FileReader();
                reader.onloadend = () => {
                    onChange([...images, reader.result]);
                };
                reader.readAsDataURL(file);
            }
        });
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            processFiles(e.dataTransfer.files);
        }
    };

    const handleFileInput = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            processFiles(e.target.files);
        }
    };

    const handleRemoveImage = (index) => {
        const newImages = images.filter((_, i) => i !== index);
        onChange(newImages);
    };

    const handleClick = () => {
        fileInputRef.current?.click();
    };

    return (
        <div className="space-y-4">
            {/* Upload Area */}
            <div
                className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-all ${
                    dragActive
                        ? 'border-gold bg-gold/5'
                        : 'border-gray-300 hover:border-gold'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={handleClick}
            >
                <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/jpeg,image/jpg,image/png"
                    onChange={handleFileInput}
                    className="hidden"
                />

                <div className="flex flex-col items-center justify-center gap-3 cursor-pointer">
                    <div className="w-16 h-16 bg-gold/10 rounded-full flex items-center justify-center">
                        <Upload className="w-8 h-8 text-gold" />
                    </div>
                    <div>
                        <p className="text-base font-serif font-semibold text-charcoal mb-1">
                            {dragActive ? 'Drop images here' : 'Click to upload or drag & drop'}
                        </p>
                        <p className="text-xs text-gray-500 font-sans">
                            JPG, PNG up to 5MB • Maximum {maxImages} images
                        </p>
                    </div>
                </div>
            </div>

            {/* Image Previews */}
            {images.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {images.map((image, index) => (
                        <div
                            key={index}
                            className="relative group aspect-square rounded-lg overflow-hidden border border-gray-200 bg-gray-50"
                        >
                            <img
                                src={image}
                                alt={`Upload ${index + 1}`}
                                className="w-full h-full object-cover"
                            />
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleRemoveImage(index);
                                }}
                                className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                            >
                                <X className="w-4 h-4" />
                            </button>
                            <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                Image {index + 1}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Helper Text */}
            {images.length === 0 && (
                <div className="flex items-start gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <ImageIcon className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                    <p className="text-xs text-blue-800 font-sans">
                        Upload at least 2 clear photos showing the damage or issue with your gold item for accurate quotes
                    </p>
                </div>
            )}

            {/* Image Count */}
            {images.length > 0 && (
                <p className="text-xs text-gray-500 font-sans">
                    {images.length} of {maxImages} images uploaded
                </p>
            )}
        </div>
    );
};

export default ImageUpload;
