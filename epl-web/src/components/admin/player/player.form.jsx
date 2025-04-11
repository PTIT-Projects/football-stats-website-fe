import { Form, Input, InputNumber, Select, DatePicker, Divider } from "antd";
import { useEffect, useState } from "react";
import dayjs from 'dayjs';
import ImageUpload from "../../common/ImageUpload";
import { getImageUrl } from "../../../services/api.service";

const PlayerForm = ({ form, initialValues = {}, formName = "playerForm", onImageChange }) => {
    const [imageFile, setImageFile] = useState(null);
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
                marketValue: initialValues.marketValue,
                shirtNumber: initialValues.shirtNumber,
                citizenships: initialValues.citizenships,
                positions: initialValues.positions
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
        setImageFile(file);
        
        // Pass the selected file up to the parent component
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
                rules={[{ required: true, message: 'Please enter player name' }]}
            >
                <Input placeholder="Enter player name" />
            </Form.Item>

            <Form.Item
                name="dob"
                label="Date of Birth"
                rules={[{ required: true, message: 'Please select date of birth' }]}
            >
                <DatePicker style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item
                name="marketValue"
                label="Market Value (€)"
                rules={[{ required: true, message: 'Please enter market value' }]}
            >
                <InputNumber
                    min={0}
                    formatter={value => `€ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    parser={value => value.replace(/€\s?|(,*)/g, '')}
                    style={{ width: '100%' }}
                />
            </Form.Item>

            <Form.Item
                name="shirtNumber"
                label="Shirt Number"
            >
                <InputNumber min={1} max={99} style={{ width: '100%' }} />
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

            <Form.Item
                name="positions"
                label="Positions"
                rules={[{ required: true, message: 'Please enter at least one position' }]}
            >
                <Select
                    mode="tags"
                    style={{ width: '100%' }}
                    placeholder="Enter positions"
                    tokenSeparators={[',']}
                />
            </Form.Item>

            <Divider>Player Image</Divider>
            
            <Form.Item label="Player Photo">
                <ImageUpload 
                    initialImageUrl={initialImageUrl} 
                    onImageChange={handleImageChange} 
                    entityName="Player"
                />
            </Form.Item>
        </Form>
    );
};

export default PlayerForm;