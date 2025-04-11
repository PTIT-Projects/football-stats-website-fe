import { Button, Form, message, Modal } from "antd";
import { useState } from "react";
import { createClubAPI, createClubWithImageAPI } from "../../../services/api.service.js";
import ClubForm from "./club.form.jsx";

const CreateClubModal = ({ isOpen, onCancel, onSuccess }) => {
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

            // Use the image upload API if an image is selected
            let res;
            if (imageFile) {
                res = await createClubWithImageAPI(values, imageFile);
            } else {
                res = await createClubAPI(values);
            }

            if (res.data) {
                message.success("Club created successfully");
                form.resetFields();
                setImageFile(null);
                onSuccess();
                onCancel();
            } else {
                message.error("Failed to create club");
            }
        } catch (error) {
            console.error("Error creating club:", error);
            message.error("An error occurred while creating the club");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Modal
            title="Add New Club"
            open={isOpen}
            onCancel={onCancel}
            footer={[
                <Button key="cancel" onClick={onCancel}>
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
            destroyOnClose
        >
            <ClubForm
                form={form}
                formName="createClubForm"
                onImageChange={handleImageChange}
            />
        </Modal>
    );
};

export default CreateClubModal;