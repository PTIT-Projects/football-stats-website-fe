import { Form, Input, Divider } from "antd";
import { useEffect, useState } from "react";
import ImageUpload from "../../common/ImageUpload";
import { getImageUrl } from "../../../services/api.service";

const ClubForm = ({ form, initialValues = {}, formName = "clubForm", onImageChange }) => {
    const [initialImageUrl, setInitialImageUrl] = useState(null);

    // Initialize form with values if in edit mode
    useEffect(() => {
        if (initialValues && Object.keys(initialValues).length > 0) {
            console.log('Initial club values received:', initialValues);

            form.setFieldsValue({
                name: initialValues.name,
                country: initialValues.country,
                stadiumName: initialValues.stadiumName
            });

            // Set initial image URL if available
            if (initialValues.imagePath) {
                setInitialImageUrl(getImageUrl(initialValues.imagePath));
            } else {
                setInitialImageUrl(null);
            }
        }
    }, [initialValues, form]);

    // Handle image file selection
    const handleImageChange = (file) => {
        if (onImageChange) {
            onImageChange(file);
        }
    };

    return (
        <Form
            form={form}
            layout="vertical"
            name={formName}
        >
            <Form.Item
                name="name"
                label="Club Name"
                rules={[{ required: true, message: "Please enter the club name" }]}
            >
                <Input placeholder="Enter club name" />
            </Form.Item>
            
            <Form.Item
                name="country"
                label="Country"
                rules={[{ required: true, message: "Please enter the country" }]}
            >
                <Input placeholder="Enter country" />
            </Form.Item>
            
            <Form.Item
                name="stadiumName"
                label="Stadium Name"
            >
                <Input placeholder="Enter stadium name" />
            </Form.Item>

            <Divider>Club Image</Divider>
            
            <Form.Item label="Club Logo">
                <ImageUpload 
                    initialImageUrl={initialImageUrl} 
                    onImageChange={handleImageChange} 
                    entityName="Club"
                />
            </Form.Item>
        </Form>
    );
};

export default ClubForm;