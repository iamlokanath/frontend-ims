// @ts-check
import React, { useState, useEffect, useCallback, FormEvent, ChangeEvent } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

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

    const fetchImages = useCallback(async () => {
        if (!user) return; // Ensure user is available before fetching
        try {
            const endpoint = user.role === 'user' ? '/my-images' : '/all';
            const response = await axios.get<Image[]>(`http://localhost:5000/api/images${endpoint}`);
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

            await axios.post('http://localhost:5000/api/images', formData, {
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

    const handleDelete = async (imageId: string) => {
        if (user?.role !== 'super_admin') return; // Optional chaining for safety
        setError('');

        try {
            await axios.delete(`http://localhost:5000/api/images/${imageId}`);
            fetchImages();
        } catch (error) {
            setError('Failed to delete image');
        }
    };

    if (loading) {
        return <div className="text-center">Loading...</div>;
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="space-y-8">
                {/* Upload Form */}
                {user?.role !== 'super_admin' && ( // Only show upload for non-super-admins if needed, adjust based on requirements
                    <div className="bg-white shadow rounded-lg p-6">
                        <h2 className="text-2xl font-bold mb-4">Upload Image</h2>
                        <form onSubmit={handleUpload} className="space-y-4">
                            <div>
                                <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
                                <input
                                    type="text"
                                    id="title"
                                    name="title"
                                    value={uploadData.title}
                                    onChange={handleInputChange}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                                <textarea
                                    id="description"
                                    name="description"
                                    value={uploadData.description}
                                    onChange={handleInputChange}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    rows={3}
                                />
                            </div>
                            <div>
                                <label htmlFor="image" className="block text-sm font-medium text-gray-700">Image</label>
                                <input
                                    type="file"
                                    id="image"
                                    onChange={handleFileChange}
                                    className="mt-1 block w-full"
                                    accept="image/*"
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                                Upload
                            </button>
                        </form>
                    </div>
                )}

                {/* Image Grid */}
                <div className="bg-white shadow rounded-lg p-6">
                    <h2 className="text-2xl font-bold mb-4">Images</h2>
                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
                            {error}
                        </div>
                    )}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {images.map((image) => (
                            <div key={image._id} className="relative group">
                                <img
                                    src={`http://localhost:5000${image.imageUrl}`}
                                    alt={image.title}
                                    className="w-full h-48 object-cover rounded-lg"
                                />
                                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 rounded-lg">
                                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                        {user?.role === 'super_admin' && (
                                            <button
                                                onClick={() => handleDelete(image._id)}
                                                className="bg-red-500 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-red-600"
                                            >
                                                Delete
                                            </button>
                                        )}
                                    </div>
                                </div>
                                <div className="mt-2">
                                    <h3 className="text-lg font-medium">{image.title}</h3>
                                    <p className="text-sm text-gray-500">{image.description}</p>
                                    {(user?.role === 'admin' || user?.role === 'super_admin') && (
                                        <p className="text-xs text-gray-400 mt-1">
                                            Uploaded by: {'user' in image && image.user ? (image.user as User).name : 'Unknown'}
                                        </p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard; 