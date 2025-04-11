import { Button, Form, message, Modal } from "antd";
import { useState } from "react";
import { createLeagueAPI, createLeagueWithImageAPI } from "../../../services/api.service.js";
import LeagueForm from "./league.form.jsx";

const CreateLeagueModal = ({ isOpen, onCancel, onSuccess }) => {
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
                res = await createLeagueWithImageAPI(values, imageFile);
            } else {
                res = await createLeagueAPI(values);
            }

            if (res.data) {
                message.success("League created successfully");
                form.resetFields();
                setImageFile(null);
                onSuccess();
            } else {
                message.error("Failed to create league");
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
            title="Add New League"
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
            <LeagueForm 
                form={form} 
                formName="createLeagueForm" 
                onImageChange={handleImageChange}
            />
        </Modal>
    );
};

export default CreateLeagueModal;