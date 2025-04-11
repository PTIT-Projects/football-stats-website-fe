import { Button, Form, message, Modal } from "antd";
import { useEffect, useState } from "react";
import { updateLeagueAPI, updateLeagueWithImageAPI } from "../../../services/api.service.js";
import LeagueForm from "./league.form.jsx";

const EditLeagueModal = ({ isOpen, onCancel, onSuccess, league }) => {
    const [form] = Form.useForm();
    const [submitting, setSubmitting] = useState(false);
    const [imageFile, setImageFile] = useState(null);

    // Reset form when modal closes
    useEffect(() => {
        if (!isOpen) {
            form.resetFields();
            setImageFile(null);
        }
    }, [isOpen, form]);

    const handleImageChange = (file) => {
        setImageFile(file);
    };

    const handleSubmit = async () => {
        try {
            const values = await form.validateFields();
            setSubmitting(true);

            const formattedValues = {
                ...values,
                id: league.id
            };

            // Use the image upload API if an image is selected
            let res;
            if (imageFile) {
                res = await updateLeagueWithImageAPI(formattedValues, imageFile);
            } else {
                res = await updateLeagueAPI(formattedValues);
            }

            if (res.data) {
                message.success("League updated successfully");
                setImageFile(null);
                onSuccess();
                onCancel();
            } else {
                message.error("Failed to update league");
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
            title="Edit League"
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
                    Update
                </Button>,
            ]}
            width={600}
            destroyOnClose={true}
        >
            {isOpen && league && (
                <LeagueForm
                    form={form}
                    initialValues={league}
                    formName="editLeagueForm"
                    onImageChange={handleImageChange}
                />
            )}
        </Modal>
    );
};

export default EditLeagueModal;