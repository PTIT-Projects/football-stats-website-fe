import { Form, Input, DatePicker, Select, Divider } from "antd";
import { useEffect, useState } from "react";
import dayjs from 'dayjs';
import ImageUpload from "../../common/ImageUpload";
import { getImageUrl } from "../../../services/api.service";

const CoachForm = ({ form, initialValues = {}, formName = "coachForm", onImageChange }) => {
    const [initialImageUrl, setInitialImageUrl] = useState(null);

    // Initialize form with values if in edit mode
    useEffect(() => {
        if (initialValues && Object.keys(initialValues).length > 0) {
            console.log('Initial values received:', initialValues);

            // Get date of birth from the correct field (.dob from backend)
            const dateOfBirth = initialValues.dob ? dayjs(initialValues.dob) : null;

            form.setFieldsValue({
                name: initialValues.name,
                dob: dateOfBirth,
                citizenships: initialValues.citizenships
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
                label="Name"
                rules={[{ required: true, message: 'Please enter coach name' }]}
            >
                <Input placeholder="Enter coach name" />
            </Form.Item>

            <Form.Item
                name="dob"
                label="Date of Birth"
                rules={[{ required: true, message: 'Please select date of birth' }]}
            >
                <DatePicker style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item
                name="citizenships"
                label="Citizenships"
                rules={[{ required: true, message: 'Please enter at least one citizenship' }]}
            >
                <Select
                    mode="tags"
                    style={{ width: '100%' }}
                    placeholder="Enter citizenships"
                    tokenSeparators={[',']}
                />
            </Form.Item>

            <Divider>Coach Image</Divider>
            
            <Form.Item label="Coach Photo">
                <ImageUpload 
                    initialImageUrl={initialImageUrl} 
                    onImageChange={handleImageChange} 
                    entityName="Coach"
                />
            </Form.Item>
        </Form>
    );
};

export default CoachForm;