import {Button, Form, message, Modal} from "antd";
import {useEffect, useState} from "react";
import {updateCoachAPI, updateCoachWithImageAPI} from "../../../services/api.service.js";
import CoachForm from "./coach.form.jsx";

const EditCoachModal = ({ isOpen, onCancel, onSuccess, coach }) => {
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

            // Format the date for the API
            const formattedValues = {
                ...values,
                dob: values.dob ? values.dob.format('YYYY-MM-DD') : null,
                id: coach.id
            };

            console.log('Submitting coach update:', formattedValues);

            // Use the image upload API if an image is selected or changed
            let res;
            if (imageFile) {
                res = await updateCoachWithImageAPI(formattedValues, imageFile);
            } else {
                res = await updateCoachAPI(formattedValues);
            }

            if (res.data) {
                message.success("Coach updated successfully");
                setImageFile(null);
                // Call onSuccess to trigger table reload
                onSuccess();
                onCancel(); // Close the modal
            } else {
                message.error("Failed to update coach");
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
            title="Edit Coach"
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
            {isOpen && coach && (
                <CoachForm
                    form={form}
                    initialValues={coach}
                    formName="editCoachForm"
                    onImageChange={handleImageChange}
                />
            )}
        </Modal>
    );
};

export default EditCoachModal;