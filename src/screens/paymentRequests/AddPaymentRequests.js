import React from "react";
import { toast } from "react-toastify";
import { Base_url } from "../../utils/Base_url";
import axios from "axios";
import Button from "../../components/Button";
import Modal from "../../components/modal";
import { MdClose } from "react-icons/md";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

const AddPaymentRequests = ({ isModalOpen, setIsModalOpen, closeModal, setUsers }) => {
    const userData = JSON.parse(localStorage.getItem('ceat_admin_user'))
    console.log(userData?._id,'uerdata');
    const validationSchema = Yup.object({
        amount: Yup.string().required("Amount is required"),
    });

    const handleSubmit = async (values, { resetForm }) => {
        try {
            const response = await axios.post(`${Base_url}/withdraw/create`, values, {
                headers: {
                    "Content-Type": "application/json",
                },
            });
            console.log('====================================');
            console.log(response);
            console.log('====================================');
            if (response?.status === "success") {
                const res = await axios.get(`${Base_url}/withdraw/getBySellerId/${userData?._id}`);
                setUsers(res.data.data);
                setIsModalOpen(false);
                toast.success(response.data.message);
                resetForm();
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            toast.success(error.response?.data?.message);
        }
    };

    return (
        <div>
            <Modal isOpen={isModalOpen} onClose={closeModal} className="rounded-md">
                <div>
                    <div className="p-3 flex justify-between items-center">
                        <div></div>
                        <h1 className="capitalize h4 font-semibold">Add Amount</h1>
                        <MdClose onClick={() => setIsModalOpen(false)} size={25} aria-label="Close modal" />
                    </div>
                    <hr />
                    <div className="p-5">
                        <Formik
                            initialValues={{ sellerId:userData?._id, amount: "" }}
                            validationSchema={validationSchema}
                            onSubmit={handleSubmit}
                        >
                            {({ isSubmitting, errors, touched }) => (
                                <Form>
                                    <div className="flex gap-5 flex-wrap">
                                        
                                        <div className="w-[100%]">
                                            <label htmlFor="amount" className="block mb-2 font-medium">
                                                Amount
                                            </label>
                                            <Field
                                                name="amount"
                                                type="text"
                                                placeholder="Enter Amount"
                                                className={`border w-full py-3 px-4 ${
                                                    errors.amount && touched.amount
                                                        ? "border-primary"
                                                        : "border-gray-300"
                                                }`}
                                            />
                                            <ErrorMessage
                                                name="amount"
                                                component="div"
                                                className="text-primary text-sm mt-1"
                                            />
                                        </div>
                                    </div>
                                    <Button
                                        label={isSubmitting ? "Submitting..." : "Submit"}
                                        type="submit"
                                        className="bg-primary mt-3 uppercase text-white py-2 w-full"
                                        disabled={isSubmitting}
                                        aria-label="Submit form"
                                    />
                                </Form>
                            )}
                        </Formik>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default AddPaymentRequests;