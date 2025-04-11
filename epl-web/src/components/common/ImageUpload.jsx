import React, { useState } from "react";
import { Upload, message, Button, Spin, Modal } from "antd";
import { UploadOutlined, EyeOutlined } from "@ant-design/icons";
import PropTypes from "prop-types";

const ImageUpload = ({ 
  initialImageUrl, 
  onImageChange, 
  entityName = "item",
  maxSize = 10 // Max file size in MB
}) => {
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [loading, setLoading] = useState(false);
  const [fileList, setFileList] = useState([]);
  
  // Set initial image if provided
  React.useEffect(() => {
    if (initialImageUrl) {
      // If we have an initial image URL, create a file object for display
      setFileList([
        {
          uid: "-1",
          name: "current-image.jpg",
          status: "done",
          url: initialImageUrl,
        },
      ]);
    } else {
      setFileList([]);
    }
  }, [initialImageUrl]);

  // Check if file is an image and within size limit
  const beforeUpload = (file) => {
    const isImage = file.type.startsWith("image/");
    if (!isImage) {
      message.error("You can only upload image files!");
      return Upload.LIST_IGNORE;
    }
    
    const isLessThan10MB = file.size / 1024 / 1024 < maxSize;
    if (!isLessThan10MB) {
      message.error(`Image must be smaller than ${maxSize}MB!`);
      return Upload.LIST_IGNORE;
    }
    
    return false; // Prevent auto upload
  };

  const handleChange = (info) => {
    let newFileList = [...info.fileList];
    
    // Only keep the latest file if multiple files are uploaded
    newFileList = newFileList.slice(-1);
    
    // Update status
    newFileList = newFileList.map(file => {
      if (file.response) {
        file.url = file.response.url;
      }
      return file;
    });
    
    setFileList(newFileList);
    
    // Call the parent's onImageChange with the new file
    if (newFileList.length > 0 && newFileList[0].originFileObj) {
      onImageChange(newFileList[0].originFileObj);
    } else {
      onImageChange(null); // No file selected
    }
  };

  const handlePreview = async (file) => {
    if (file.url) {
      setPreviewImage(file.url);
      setPreviewVisible(true);
    } else if (file.originFileObj) {
      // Create a preview URL for the selected file
      const previewURL = URL.createObjectURL(file.originFileObj);
      setPreviewImage(previewURL);
      setPreviewVisible(true);
      
      // Clean up the URL when done
      return () => URL.revokeObjectURL(previewURL);
    }
  };

  const handleRemove = () => {
    // Signal that the image has been removed
    onImageChange(null);
    return true;
  };

  const uploadButton = (
    <Button icon={<UploadOutlined />}>Select Image</Button>
  );

  return (
    <div className="upload-container">
      <Upload
        listType="picture-card"
        fileList={fileList}
        beforeUpload={beforeUpload}
        onChange={handleChange}
        onPreview={handlePreview}
        onRemove={handleRemove}
        customRequest={({ onSuccess }) => {
          // Simulate a success to show the image in the list
          setTimeout(() => {
            onSuccess("ok");
          }, 0);
        }}
      >
        {fileList.length >= 1 ? null : uploadButton}
      </Upload>
      
      {loading && <Spin tip="Processing image..." />}
      
      {fileList.length > 0 && (
        <Button 
          type="link" 
          icon={<EyeOutlined />} 
          onClick={() => handlePreview(fileList[0])}
        >
          Preview
        </Button>
      )}

      <Modal
        open={previewVisible}
        title={`${entityName} Image Preview`}
        footer={null}
        onCancel={() => setPreviewVisible(false)}
      >
        <img alt="preview" style={{ width: '100%' }} src={previewImage} />
      </Modal>
    </div>
  );
};

ImageUpload.propTypes = {
  initialImageUrl: PropTypes.string,
  onImageChange: PropTypes.func.isRequired,
  entityName: PropTypes.string,
  maxSize: PropTypes.number
};

export default ImageUpload;