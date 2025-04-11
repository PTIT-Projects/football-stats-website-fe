import {Button, Form, message, Modal} from "antd";
import {useState} from "react";
import {createCoachAPI, createCoachWithImageAPI} from "../../../services/api.service.js";
import CoachForm from "./coach.form.jsx";

const CreateCoachModal = ({ isOpen, onCancel, onSuccess }) => {
    const [form] = Form.useForm();
    const [submitting, setSubmitting] = useState(false);
    const [imageFile, setImageFile] = useState(null);

    const handleImageChange = (file) => {
        setImageFile(file);
    };

    const handleSubmit = async () => {
        try {
            const values = await form.validateFields();
            setSubmitting(true);

            // Format the date for the API
            const formattedValues = {
                ...values,
                dob: values.dob ? values.dob.format('YYYY-MM-DD') : null
            };

            // Use the image upload API if an image is selected
            let res;
            if (imageFile) {
                res = await createCoachWithImageAPI(formattedValues, imageFile);
            } else {
                res = await createCoachAPI(formattedValues);
            }

            if (res.data) {
                message.success("Head Coach created successfully");
                form.resetFields();
                setImageFile(null);
                onSuccess();
            } else {
                message.error("Failed to create head coach");
            }
        } catch (error) {
            console.error("Form validation or submission error:", error);
            message.error("Please check the form fields and try again");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Modal
            title="Add New Head Coach"
            open={isOpen}
            onCancel={onCancel}
            footer={[
                <Button key="back" onClick={onCancel}>
                    Cancel
                </Button>,
                <Button
                    key="submit"
                    type="primary"
                    loading={submitting}
                    onClick={handleSubmit}
                >
                    Create
                </Button>,
            ]}
            width={600}
            destroyOnClose={true}
        >
            <CoachForm 
                form={form} 
                formName="createCoachForm" 
                onImageChange={handleImageChange}
            />
        </Modal>
    );
};

export default CreateCoachModal;