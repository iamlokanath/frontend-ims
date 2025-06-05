// @ts-check
import React, { useState, useEffect, useCallback, FormEvent, ChangeEvent } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import ImageModal from './ImageModal'; // Import the new modal component
import ConfirmationModal from './ConfirmationModal'; // Import ConfirmationModal
import { TrashIcon } from '@heroicons/react/24/outline'; // Import TrashIcon

interface User { // Assuming User type from AuthContext, ideally import it
    _id: string;
    name: string;
    email: string;
    role: 'super_admin' | 'admin' | 'user';
}

interface Image {
    _id: string;
    user: string | User; // Can be user ID or populated user object
    imageUrl: string;
    title: string;
    description?: string;
    uploadedAt: string;
}

interface UploadData {
    title: string;
    description: string;
    image: File | null;
}

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const Dashboard: React.FC = () => {
    const { user } = useAuth();
    const [images, setImages] = useState<Image[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>('');
    const [uploadData, setUploadData] = useState<UploadData>({
        title: '',
        description: '',
        image: null
    });
    const [isImageModalOpen, setIsImageModalOpen] = useState<boolean>(false); // Renamed for clarity
    const [selectedImage, setSelectedImage] = useState<Image | null>(null);
    const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState<boolean>(false); // State for confirmation modal
    const [imageToDeleteId, setImageToDeleteId] = useState<string | null>(null); // State for image ID to delete

    const fetchImages = useCallback(async () => {
        if (!user) return; // Ensure user is available before fetching
        try {
            const endpoint = user.role === 'user' ? '/my-images' : '/all';
            const response = await axios.get<Image[]>(`${API_URL}/api/images${endpoint}`);
            setImages(response.data);
        } catch (error) {
            setError('Failed to fetch images');
        } finally {
            setLoading(false);
        }
    }, [user]); // Added user as dependency as its properties are used

    useEffect(() => {
        fetchImages();
    }, [fetchImages]);

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setUploadData({
                ...uploadData,
                image: e.target.files[0]
            });
        }
    };

    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setUploadData({
            ...uploadData,
            [e.target.name]: e.target.value
        });
    };

    const handleUpload = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!uploadData.image) {
            setError('Please select an image file.');
            return;
        }
        setError('');

        try {
            const formData = new FormData();
            formData.append('image', uploadData.image);
            formData.append('title', uploadData.title);
            formData.append('description', uploadData.description);

            await axios.post(`${API_URL}/api/images`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            setUploadData({
                title: '',
                description: '',
                image: null
            });
            fetchImages();
        } catch (error) {
            setError('Failed to upload image');
        }
    };

    // Function to open confirmation modal
    const openConfirmationModal = (imageId: string) => {
        setImageToDeleteId(imageId);
        setIsConfirmationModalOpen(true);
    };

    // Function to close confirmation modal
    const closeConfirmationModal = () => {
        setIsConfirmationModalOpen(false);
        setImageToDeleteId(null);
    };

    // Function to confirm deletion
    const confirmDelete = async () => {
        if (!imageToDeleteId || user?.role !== 'super_admin') return; // Ensure imageId and super_admin role
        setError('');

        try {
            await axios.delete(`${API_URL}/api/images/${imageToDeleteId}`);
            fetchImages(); // Refresh images after deletion
            closeConfirmationModal(); // Close the modal on success
        } catch (error) {
            setError('Failed to delete image');
            closeConfirmationModal(); // Close modal even on error
        }
    };

    const openImageModal = (image: Image) => {
        setSelectedImage(image);
        setIsImageModalOpen(true);
    };

    const closeImageModal = () => {
        setIsImageModalOpen(false);
        setSelectedImage(null);
    };

    if (loading) {
        return <div className="text-center">Loading...</div>;
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 dark:bg-gray-900">
            <div className="space-y-8">
                {/* Upload Form */}
                <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
                    <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Upload Image</h2>
                    <form onSubmit={handleUpload} className="space-y-4">
                        <div>
                            <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Title</label>
                            <input
                                type="text"
                                id="title"
                                name="title"
                                value={uploadData.title}
                                onChange={handleInputChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
                            <textarea
                                id="description"
                                name="description"
                                value={uploadData.description}
                                onChange={handleInputChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                                rows={3}
                            />
                        </div>
                        <div>
                            <label htmlFor="image" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Image</label>
                            <input
                                type="file"
                                id="image"
                                onChange={handleFileChange}
                                className="mt-1 block w-full dark:text-gray-300"
                                accept="image/*"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-800"
                        >
                            Upload
                        </button>
                    </form>
                </div>

                {/* Image Grid */}
                <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
                    <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Images</h2>
                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4 dark:bg-red-900 dark:text-red-200 dark:border-red-700">
                            {error}
                        </div>
                    )}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {images.map((image) => (
                            <div
                                key={image._id}
                                className="relative group bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden cursor-pointer"
                                onClick={() => openImageModal(image)} // Open image modal on click
                            >
                                <img
                                    src={`${API_URL}${image.imageUrl}`}
                                    alt={image.title}
                                    className="w-full h-48 object-cover"
                                />
                                {/* Delete icon for super_admin */}
                                {user?.role === 'super_admin' && (
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation(); // Prevent image modal from opening
                                            openConfirmationModal(image._id); // Open confirmation modal
                                        }}
                                        className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10"
                                        aria-label="Delete image"
                                    >
                                        <TrashIcon className="h-4 w-4" aria-hidden="true" />
                                    </button>
                                )}
                                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 rounded-lg">
                                    {/* The previous delete button div is no longer needed here */}
                                </div>
                                <div className="mt-2 p-4">
                                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">{image.title}</h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-300">{image.description}</p>
                                    {(user?.role === 'admin' || user?.role === 'super_admin') && (
                                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                                            Uploaded by: {'user' in image && image.user ? (image.user as User).name : 'Unknown'}
                                        </p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Image Modal */}
            <ImageModal
                image={selectedImage}
                isOpen={isImageModalOpen}
                onClose={closeImageModal}
            />

            {/* Confirmation Modal */}
            <ConfirmationModal
                isOpen={isConfirmationModalOpen}
                onCancel={closeConfirmationModal}
                onConfirm={confirmDelete}
                title="Confirm Deletion"
                message="Are you sure you want to delete this image? This action cannot be undone."
            />
        </div>
    );
};

export default Dashboard; 