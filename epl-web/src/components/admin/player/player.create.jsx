import { Modal, Form, Button, message } from "antd";
import { useState } from "react";
import { createPlayerAPI, createPlayerWithImageAPI } from "../../../services/api.service.js";
import PlayerForm from "./player.form.jsx";

const CreatePlayerModal = ({ isOpen, onCancel, onSuccess }) => {
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
                res = await createPlayerWithImageAPI(formattedValues, imageFile);
            } else {
                res = await createPlayerAPI(formattedValues);
            }

            if (res.data) {
                message.success("Player created successfully");
                form.resetFields();
                setImageFile(null);
                onSuccess();
            } else {
                message.error("Failed to create player");
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
            title="Add New Player"
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
            <PlayerForm 
                form={form} 
                formName="createPlayerForm" 
                onImageChange={handleImageChange}
            />
        </Modal>
    );
};

export default CreatePlayerModal;