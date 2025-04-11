import {Button, Form, Modal, message, notification} from "antd";
import { useEffect, useState } from "react";
import { editClubAPI, updateClubWithImageAPI } from "../../../services/api.service.js";
import ClubForm from "./club.form.jsx";

const EditClubModal = ({ isOpen, onCancel, onSuccess, club }) => {
    const [form] = Form.useForm();
    const [submitting, setSubmitting] = useState(false);
    const [imageFile, setImageFile] = useState(null);

    useEffect(() => {
        if (isOpen && club) {
            form.setFieldsValue(club);
        }
        
        if (!isOpen) {
            setImageFile(null);
        }
    }, [isOpen, club, form]);

    const handleImageChange = (file) => {
        setImageFile(file);
    };

    const handleSubmit = async () => {
        try {
            const values = await form.validateFields();
            setSubmitting(true);

            const updatedClub = { ...values, id: club.id };
            
            // Use the image upload API if an image is selected
            let res;
            if (imageFile) {
                res = await updateClubWithImageAPI(updatedClub, imageFile);
            } else {
                res = await editClubAPI(updatedClub);
            }
            
            if (res.data) {
                message.success("Club updated successfully");
                setImageFile(null);
                onSuccess();
                onCancel();
            } else {
                message.error("Failed to update club");
            }
        } catch (error) {
            console.error("Error updating club:", error);
            notification.error({
                description:"An error occurred while updating the club",
                message: error.message
            });
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Modal
            title="Edit Club"
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
                    Update
                </Button>,
            ]}
            width={600}
            destroyOnClose
        >
            {isOpen && club && (
                <ClubForm
                    form={form}
                    initialValues={club}
                    formName="editClubForm"
                    onImageChange={handleImageChange}
                />
            )}
        </Modal>
    );
};

export default EditClubModal;