// @ts-check
import React from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface User {
    _id: string;
    name: string;
    email: string;
    role: 'super_admin' | 'admin' | 'user';
}

interface Image {
    _id: string;
    user: string | User;
    imageUrl: string;
    title: string;
    description?: string;
    uploadedAt: string;
}

interface ImageModalProps {
    image: Image | null;
    isOpen: boolean;
    onClose: () => void;
}

const ImageModal: React.FC<ImageModalProps> = ({ image, isOpen, onClose }) => {
    if (!isOpen || !image) {
        return null;
    }

    // Helper to display uploader name if user object is populated
    const uploaderName = ('user' in image && image.user && typeof image.user !== 'string')
        ? image.user.name
        : 'Unknown';

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
            <div className="flex items-center justify-center min-h-screen px-4 text-center md:px-20">
                {/* Background overlay */}
                <div className="fixed inset-0 bg-gray-500 dark:bg-gray-900 bg-opacity-75 transition-opacity" aria-hidden="true"></div>

                {/* Modal panel */}
                <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                    {/* Close button */}
                    <div className="absolute top-0 right-0 pt-4 pr-4">
                        <button
                            type="button"
                            className="bg-white dark:bg-gray-800 rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-gray-600 dark:hover:text-gray-400"
                            onClick={onClose}
                        >
                            <span className="sr-only">Close modal</span>
                            <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                        </button>
                    </div>

                    <div className="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                        <div className="sm:flex sm:items-start">
                            {/* Image */}
                            <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                <img
                                    src={`http://localhost:5000${image.imageUrl}`}
                                    alt={image.title}
                                    className="w-full h-auto rounded-lg object-contain max-h-96"
                                />
                                {/* Details */}
                                <div className="mt-4">
                                    <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white" id="modal-title">Title: {image.title}
                                    </h3>
                                    {image.description && (
                                        <div className="mt-2">
                                            <p className="text-sm text-gray-500 dark:text-gray-300">Description: {image.description}</p>
                                        </div>
                                    )}
                                    {('user' in image && image.user) && (
                                        <div className="mt-2">
                                            <p className="text-xs text-gray-500 dark:text-gray-400">Uploaded by: {uploaderName}</p>
                                        </div>
                                    )}
                                    <div className="mt-2">
                                        <p className="text-xs text-gray-500 dark:text-gray-400">Uploaded on: {new Date(image.uploadedAt).toLocaleDateString()}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ImageModal; 