import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Camera, Upload, X, Loader2 } from 'lucide-react';

const ImageDropzone = ({ onImageSelect, onSearch, isSearching = false }) => {
    const [preview, setPreview] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);

    const onDrop = useCallback((acceptedFiles) => {
        const file = acceptedFiles[0];
        if (file) {
            setSelectedFile(file);
            const reader = new FileReader();
            reader.onload = () => {
                setPreview(reader.result);
                if (onImageSelect) {
                    onImageSelect(file);
                }
            };
            reader.readAsDataURL(file);
        }
    }, [onImageSelect]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'image/*': ['.jpeg', '.jpg', '.png', '.webp', '.gif']
        },
        multiple: false,
        maxSize: 5242880, // 5MB
    });

    const handleClear = () => {
        setPreview(null);
        setSelectedFile(null);
    };

    const handleSearch = () => {
        if (selectedFile && onSearch) {
            onSearch(selectedFile);
        }
    };

    return (
        <div className="w-full max-w-2xl mx-auto">
            {!preview ? (
                <div
                    {...getRootProps()}
                    className={`
            glass-card p-12 text-center cursor-pointer
            transition-all duration-300
            ${isDragActive ? 'scale-105 border-primary-400 bg-primary-500/20' : 'hover:scale-102 hover:border-white/40'}
          `}
                >
                    <input {...getInputProps()} />

                    <div className="flex flex-col items-center gap-4">
                        <div className="relative">
                            <div className="absolute inset-0 bg-primary-500 rounded-full blur-2xl opacity-50 animate-pulse-slow"></div>
                            <div className="relative bg-gradient-to-br from-primary-400 to-primary-600 p-6 rounded-full">
                                <Camera className="w-12 h-12 text-white" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <h3 className="text-2xl font-bold text-white">
                                {isDragActive ? 'Drop your image here' : 'Search by Image'}
                            </h3>
                            <p className="text-white/70">
                                Drag & drop an image or click to browse
                            </p>
                            <p className="text-sm text-white/50">
                                Supports: JPG, PNG, WEBP (Max 5MB)
                            </p>
                        </div>

                        <div className="flex items-center gap-2 px-6 py-3 bg-white/10 rounded-full border border-white/20">
                            <Upload className="w-5 h-5 text-white" />
                            <span className="text-white font-medium">Upload Photo</span>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="glass-card p-6 space-y-6">
                    <div className="relative">
                        <button
                            onClick={handleClear}
                            className="absolute -top-3 -right-3 bg-red-500 hover:bg-red-600 text-white p-2 rounded-full shadow-lg transition-all duration-200 z-10"
                            disabled={isSearching}
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <img
                            src={preview}
                            alt="Preview"
                            className="w-full h-auto max-h-96 object-contain rounded-lg"
                        />
                    </div>

                    <button
                        onClick={handleSearch}
                        disabled={isSearching}
                        className={`
              w-full py-4 rounded-lg font-semibold text-white
              transition-all duration-200 flex items-center justify-center gap-2
              ${isSearching
                                ? 'bg-gray-500 cursor-not-allowed'
                                : 'bg-gradient-to-r from-primary-500 to-primary-600 hover:shadow-xl transform hover:-translate-y-0.5'
                            }
            `}
                    >
                        {isSearching ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                <span>Searching with AI...</span>
                            </>
                        ) : (
                            <>
                                <Camera className="w-5 h-5" />
                                <span>Find Similar Products</span>
                            </>
                        )}
                    </button>
                </div>
            )}
        </div>
    );
};

export default ImageDropzone;
