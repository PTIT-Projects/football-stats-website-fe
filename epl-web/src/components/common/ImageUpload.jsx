import React, { useState, useEffect } from 'react';
import { Upload, message, Button } from 'antd';
import { UploadOutlined, LoadingOutlined, PlusOutlined } from '@ant-design/icons';

/**
 * A reusable image upload component with preview functionality
 * 
 * @param {Object} props
 * @param {string} props.initialImageUrl - The initial image URL (for edit mode)
 * @param {function} props.onImageChange - Callback function when image is changed
 * @param {string} props.entityName - The name of the entity (Player, Coach, etc.)
 */
const ImageUpload = ({ initialImageUrl, onImageChange, entityName = "Entity" }) => {
    const [loading, setLoading] = useState(false);
    const [imageUrl, setImageUrl] = useState(initialImageUrl);
    const [fileList, setFileList] = useState([]);

    // Update image URL when initialImageUrl prop changes (useful for edit forms)
    useEffect(() => {
        if (initialImageUrl) {
            setImageUrl(initialImageUrl);
            // Clear the file list to avoid confusion between initial image and newly selected one
            setFileList([]);
        } else {
            setImageUrl(null);
        }
    }, [initialImageUrl]);

    // Validate file before upload
    const beforeUpload = (file) => {
        const isImage = file.type.startsWith('image/');
        if (!isImage) {
            message.error('You can only upload image files!');
            return false;
        }
        
        // Check file size (limit to 10MB)
        const isLt10M = file.size / 1024 / 1024 < 10;
        if (!isLt10M) {
            message.error('Image must be smaller than 10MB!');
            return false;
        }
        
        // Since we're handling the file ourselves and not uploading automatically,
        // we need to return false to prevent auto upload
        return false;
    };

    // Handle file change events
    const handleChange = (info) => {
        // We only care about the most recent file
        const file = info.fileList[0]?.originFileObj;
        
        if (file) {
            // Preview the image
            setLoading(true);
            
            // Create a blob URL for preview
            const objectUrl = URL.createObjectURL(file);
            setImageUrl(objectUrl);
            setLoading(false);
            
            // Call the parent's onImageChange callback
            onImageChange(file);
            
            // Update file list to show the file in the uploader component
            setFileList([{
                uid: '-1',
                name: file.name,
                status: 'done',
                url: objectUrl,
            }]);
        } else {
            // If no file selected (user removed it), reset
            setImageUrl(initialImageUrl);
            setFileList([]);
            onImageChange(null);
        }
    };

    // Handle file removal
    const handleRemove = () => {
        setImageUrl(initialImageUrl);
        setFileList([]);
        onImageChange(null);
        return true;
    };

    // The upload button UI
    const uploadButton = (
        <div>
            {loading ? <LoadingOutlined /> : <PlusOutlined />}
            <div style={{ marginTop: 8 }}>Upload</div>
        </div>
    );

    return (
        <div>
            <Upload
                name="image"
                listType="picture-card"
                className="avatar-uploader"
                showUploadList={true}
                beforeUpload={beforeUpload}
                onChange={handleChange}
                onRemove={handleRemove}
                fileList={fileList}
                maxCount={1}
            >
                {imageUrl && fileList.length === 0 ? (
                    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                        <img
                            src={imageUrl}
                            alt={`${entityName} Image`}
                            style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'contain',
                            }}
                        />
                        <div style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            background: 'rgba(0,0,0,0.3)',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            color: 'white',
                            opacity: 0,
                            transition: 'opacity 0.3s',
                            cursor: 'pointer',
                            ':hover': {
                                opacity: 1,
                            }
                        }}>
                            Click to change
                        </div>
                    </div>
                ) : (imageUrl && fileList.length > 0) || !imageUrl ? (
                    uploadButton
                ) : null}
            </Upload>
            <p style={{ marginTop: 8 }}>
                {!imageUrl ? `Upload a ${entityName} image (Max: 10MB)` : 'Click the image to change it'}
            </p>
        </div>
    );
};

export default ImageUpload;