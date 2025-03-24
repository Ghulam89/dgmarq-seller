import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Input from "../../components/Input";
import Stepper from "./Stepper";
import { Base_url } from "../../utils/Base_url";
import { toast } from "react-toastify";
import { IoArrowBack } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

const SellerVerification = () => {
    const [currentStep, setCurrentStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();

    const initialValues = {
        businessType: "sole_trader",
        companyName: "",
        registrationNumber: "",
        taxNumber: "",
        registeredCountry: "",
        registeredState: "",
        registeredZip: "",
        registeredCity: "",
        registeredStreet: "",
        registeredHouseNumber: "",
        businessCountry: "",
        businessState: "",
        businessZip: "",
        businessCity: "",
        businessStreet: "",
        businessHouseNumber: "",
        phoneNumber: "",
        email: "",
        logo: null,
        cnicFront: null,
        cnicBack: null,
        bankDetails: {
            bankName: "",
            bankBranch: "",
            accountNumber: "",
            nationality: "",
            city: "",
            address: "",
        },
    };

    const validationSchemaStep1 = Yup.object({
        companyName: Yup.string().required("Company Name is required"),
        registrationNumber: Yup.string().required("Registration Number is required"),
        taxNumber: Yup.string().required("Tax Number is required"),
        registeredCountry: Yup.string().required("Registered Country is required"),
        registeredZip: Yup.string().required("Registered ZIP Code is required"),
        registeredCity: Yup.string().required("Registered City is required"),
        registeredStreet: Yup.string().required("Registered Street is required"),
        businessCountry: Yup.string().required("Business Country is required"),
        businessZip: Yup.string().required("Business ZIP Code is required"),
        businessCity: Yup.string().required("Business City is required"),
        businessStreet: Yup.string().required("Business Street is required"),
        phoneNumber: Yup.string().required("Phone Number is required"),
        email: Yup.string().email("Invalid email address").required("Email is required"),
    });

    const validationSchemaStep2 = Yup.object({
        logo: Yup.mixed().required("Logo is required"),
        cnicFront: Yup.mixed().required("CNIC Front Image is required"),
        cnicBack: Yup.mixed().required("CNIC Back Image is required"),
        bankDetails: Yup.object().shape({
            bankName: Yup.string().required("Bank Name is required"),
            bankBranch: Yup.string().required("Bank Branch is required"),
            accountNumber: Yup.string().required("Account Number is required"),
            nationality: Yup.string().required("Nationality is required"),
            city: Yup.string().required("City is required"),
            address: Yup.string().required("Address is required"),
        }),
    });

    const handleSubmit = async (values, { setErrors }) => {
        if (!values.logo || !values.cnicFront || !values.cnicBack) {
            setErrors({
                logo: !values.logo ? "Logo is required" : "",
                cnicFront: !values.cnicFront ? "CNIC Front Image is required" : "",
                cnicBack: !values.cnicBack ? "CNIC Back Image is required" : "",
            });
            return;
        }

        setIsSubmitting(true);

        try {
            const formData = new FormData();
            Object.keys(values).forEach((key) => {
                if (values[key] && key !== "bankDetails") {
                    formData.append(key, values[key]);
                }
            });
            formData.append("bankDetails", JSON.stringify(values.bankDetails));

            const response = await fetch(`${Base_url}/seller/register`, {
                method: "POST",
                body: formData,
            });

            if (response.ok) {
                const result = await response.json();
                toast.success(result?.message || "Seller verification submitted successfully!");
                navigate("/");
            } else {
                const errorResult = await response.json();
                toast.error(errorResult?.message || "Something went wrong. Please try again.");
            }
        } catch (error) {
            console.error("Error:", error);
            toast.error("Network error occurred. Please check your connection.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-5xl mx-auto p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4">Seller Verification</h2>

            <div className="pb-6 pt-4">
                <Stepper currentStep={currentStep} />
            </div>

            <Formik
                initialValues={initialValues}
                enableReinitialize={true}
                validationSchema={currentStep === 1 ? validationSchemaStep1 : validationSchemaStep2}
                onSubmit={(values, actions) => {
                    if (currentStep === 1) {
                        setCurrentStep(2);
                    } else {
                        handleSubmit(values, actions);
                    }
                }}
            >
                {({ values, setFieldValue}) => (
                    <Form className="space-y-6">
                        {currentStep === 1 && (
                            <div className="space-y-6">
                                <h3 className="text-lg font-medium border-b pb-2">Business Details</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {/* Business Entity Type */}
                                    <div className="flex flex-col">
                                        <label className="block mb-2">Business Entity Type</label>
                                        <div className="flex flex-col space-y-2">
                                            <label>
                                                <Field type="radio" name="businessType" value="sole_trader" className="mr-2" />
                                                Sole Trader
                                            </label>
                                            <label>
                                                <Field type="radio" name="businessType" value="company" className="mr-2" />
                                                Company
                                            </label>
                                            <label>
                                                <Field type="radio" name="businessType" value="partnership" className="mr-2" />
                                                Partnership
                                            </label>
                                        </div>
                                    </div>

                                    {/* Company Name */}
                                    <div>
                                        <label className="block mb-2">Company Name</label>
                                        <Field
                                            as={Input}
                                            type="text"
                                            name="companyName"
                                            placeholder="Company Name"
                                            className="w-full p-2 border rounded"
                                        />
                                        
                                        <ErrorMessage name="companyName" component="div" className="text-red text-sm" />
                                    </div>

                                    {/* Registration Number */}
                                    <div>
                                        <label className="block mb-2">Registration Number</label>
                                        <Field
                                            as={Input}
                                            type="text"
                                            name="registrationNumber"
                                            placeholder="Registration Number"
                                            className="w-full p-2 border rounded"
                                        />
                                        <ErrorMessage name="registrationNumber" component="div" className="text-red text-sm" />
                                    </div>

                                    {/* Tax Number */}
                                    <div>
                                        <label className="block mb-2">Tax Number</label>
                                        <Field
                                            as={Input}
                                            type="text"
                                            name="taxNumber"
                                            placeholder="Tax Number"
                                            className="w-full p-2 border rounded"
                                        />
                                        <ErrorMessage name="taxNumber" component="div" className="text-red text-sm" />
                                    </div>
                                </div>

                                {/* Registered Address */}
                                <h3 className="text-lg font-medium border-b pb-2">Registered Address</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block mb-2">Country</label>
                                        <Field
                                            as={Input}
                                            type="text"
                                            name="registeredCountry"
                                            placeholder="Country"
                                            className="w-full p-2 border rounded"
                                        />
                                        <ErrorMessage name="registeredCountry" component="div" className="text-red text-sm" />
                                    </div>

                                    <div>
                                        <label className="block mb-2">ZIP Code</label>
                                        <Field
                                            as={Input}
                                            type="text"
                                            name="registeredZip"
                                            placeholder="ZIP Code"
                                            className="w-full p-2 border rounded"
                                        />
                                        <ErrorMessage name="registeredZip" component="div" className="text-red text-sm" />
                                    </div>

                                    <div>
                                        <label className="block mb-2">City</label>
                                        <Field
                                            as={Input}
                                            type="text"
                                            name="registeredCity"
                                            placeholder="City"
                                            className="w-full p-2 border rounded"
                                        />
                                        <ErrorMessage name="registeredCity" component="div" className="text-red text-sm" />
                                    </div>

                                    <div>
                                        <label className="block mb-2">Street</label>
                                        <Field
                                            as={Input}
                                            type="text"
                                            name="registeredStreet"
                                            placeholder="Street"
                                            className="w-full p-2 border rounded"
                                        />
                                        <ErrorMessage name="registeredStreet" component="div" className="text-red text-sm" />
                                    </div>
                                </div>

                                {/* Business Address */}
                                <h3 className="text-lg font-medium border-b pb-2">Business Address</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block mb-2">Country</label>
                                        <Field
                                            as={Input}
                                            type="text"
                                            name="businessCountry"
                                            placeholder="Country"
                                            className="w-full p-2 border rounded"
                                        />
                                        <ErrorMessage name="businessCountry" component="div" className="text-red text-sm" />
                                    </div>

                                    <div>
                                        <label className="block mb-2">State (optional)</label>
                                        <Field
                                            as={Input}
                                            type="text"
                                            name="businessState"
                                            placeholder="State (optional)"
                                            className="w-full p-2 border rounded"
                                        />
                                    </div>

                                    <div>
                                        <label className="block mb-2">ZIP Code</label>
                                        <Field
                                            as={Input}
                                            type="text"
                                            name="businessZip"
                                            placeholder="ZIP Code"
                                            className="w-full p-2 border rounded"
                                        />
                                        <ErrorMessage name="businessZip" component="div" className="text-red text-sm" />
                                    </div>

                                    <div>
                                        <label className="block mb-2">City</label>
                                        <Field
                                            as={Input}
                                            type="text"
                                            name="businessCity"
                                            placeholder="City"
                                            className="w-full p-2 border rounded"
                                        />
                                        <ErrorMessage name="businessCity" component="div" className="text-red text-sm" />
                                    </div>

                                    <div>
                                        <label className="block mb-2">Street</label>
                                        <Field
                                            as={Input}
                                            type="text"
                                            name="businessStreet"
                                            placeholder="Street"
                                            className="w-full p-2 border rounded"
                                        />
                                        <ErrorMessage name="businessStreet" component="div" className="text-red text-sm" />
                                    </div>

                                    <div>
                                        <label className="block mb-2">House Number</label>
                                        <Field
                                            as={Input}
                                            type="text"
                                            name="businessHouseNumber"
                                            placeholder="House Number"
                                            className="w-full p-2 border rounded"
                                        />
                                    </div>
                                </div>

                                {/* Contact Information */}
                                <h3 className="text-lg font-medium border-b pb-2">Contact Information</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block mb-2">Phone Number</label>
                                        <Field
                                            as={Input}
                                            type="text"
                                            name="phoneNumber"
                                            placeholder="Phone Number"
                                            className="w-full p-2 border rounded"
                                        />
                                        <ErrorMessage name="phoneNumber" component="div" className="text-red text-sm" />
                                    </div>

                                    <div>
                                        <label className="block mb-2">Email Address</label>
                                        <Field
                                            as={Input}
                                            type="text"
                                            name="email"
                                            placeholder="Email Address"
                                            className="w-full p-2 border rounded"
                                        />
                                        <ErrorMessage name="email" component="div" className="text-red text-sm" />
                                    </div>
                                </div>
                            </div>
                        )}

                        {currentStep === 2 && (
                            <div className="space-y-6">
                                <h3 className="text-lg font-medium border-b pb-2">Attachments</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block mb-2">Upload Logo</label>
                                        <input
                                            type="file"
                                            className="w-full p-2 border rounded"
                                            onChange={(e) => setFieldValue("logo", e.currentTarget.files[0])}
                                        />
                                        <ErrorMessage name="logo" component="div" className="text-red text-sm" />
                                    </div>

                                    <div>
                                        <label className="block mb-2">CNIC Front</label>
                                        <input
                                            type="file"
                                            className="w-full p-2 border rounded"
                                            onChange={(e) => setFieldValue("cnicFront", e.currentTarget.files[0])}
                                        />
                                        <ErrorMessage name="cnicFront" component="div" className="text-red text-sm" />
                                    </div>

                                    <div>
                                        <label className="block mb-2">CNIC Back</label>
                                        <input
                                            type="file"
                                            className="w-full p-2 border rounded"
                                            onChange={(e) => setFieldValue("cnicBack", e.currentTarget.files[0])}
                                        />
                                        <ErrorMessage name="cnicBack" component="div" className="text-red text-sm" />
                                    </div>
                                </div>

                                <h3 className="text-lg font-medium border-b pb-2">Bank Details</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block mb-2">Bank Name</label>
                                        <Field
                                            as={Input}
                                            type="text"
                                            name="bankDetails.bankName"
                                            placeholder="Bank Name"
                                            className="w-full p-2 border rounded"
                                        />
                                        <ErrorMessage name="bankDetails.bankName" component="div" className="text-red text-sm" />
                                    </div>

                                    <div>
                                        <label className="block mb-2">Bank Branch</label>
                                        <Field
                                            as={Input}
                                            type="text"
                                            name="bankDetails.bankBranch"
                                            placeholder="Bank Branch"
                                            className="w-full p-2 border rounded"
                                        />
                                        <ErrorMessage name="bankDetails.bankBranch" component="div" className="text-red text-sm" />
                                    </div>

                                    <div>
                                        <label className="block mb-2">Account Number</label>
                                        <Field
                                            as={Input}
                                            type="text"
                                            name="bankDetails.accountNumber"
                                            placeholder="Account Number"
                                            className="w-full p-2 border rounded"
                                        />
                                        <ErrorMessage name="bankDetails.accountNumber" component="div" className="text-red text-sm" />
                                    </div>

                                    <div>
                                        <label className="block mb-2">Nationality</label>
                                        <Field
                                            as={Input}
                                            type="text"
                                            name="bankDetails.nationality"
                                            placeholder="Nationality"
                                            className="w-full p-2 border rounded"
                                        />
                                        <ErrorMessage name="bankDetails.nationality" component="div" className="text-red text-sm" />
                                    </div>

                                    <div>
                                        <label className="block mb-2">City</label>
                                        <Field
                                            as={Input}
                                            type="text"
                                            name="bankDetails.city"
                                            placeholder="City"
                                            className="w-full p-2 border rounded"
                                        />
                                        <ErrorMessage name="bankDetails.city" component="div" className="text-red text-sm" />
                                    </div>

                                    <div>
                                        <label className="block mb-2">Address</label>
                                        <Field
                                            as={Input}
                                            type="text"
                                            name="bankDetails.address"
                                            placeholder="Address"
                                            className="w-full p-2 border rounded"
                                        />
                                        <ErrorMessage name="bankDetails.address" component="div" className="text-red text-sm" />
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="flex justify-between items-center">
                            {currentStep === 2 && (
                                <button
                                    type="button"
                                    onClick={() => setCurrentStep(1)}
                                    className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                                >
                                    <IoArrowBack /> Back
                                </button>
                            )}

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className={`flex items-center justify-center w-48 p-3 rounded-lg ${
                                    isSubmitting ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 text-white"
                                }`}
                            >
                                {isSubmitting ? (
                                    <>
                                        <svg
                                            className="animate-spin h-5 w-5 mr-2 text-white"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                        >
                                            <circle
                                                className="opacity-25"
                                                cx="12"
                                                cy="12"
                                                r="10"
                                                stroke="currentColor"
                                                strokeWidth="4"
                                            ></circle>
                                            <path
                                                className="opacity-75"
                                                fill="currentColor"
                                                d="M4 12a8 8 0 018-8v4l3-3m-3 3V4a8 8 0 018 8h-4l3 3m-3-3h4a8 8 0 01-8 8v-4l-3 3m3-3v4a8 8 0 01-8-8h4l-3-3m3 3H4z"
                                            ></path>
                                        </svg>
                                        Processing...
                                    </>
                                ) : (
                                    currentStep === 2 ? "Submit" : "Continue"
                                )}
                            </button>
                        </div>
                    </Form>
                )}
            </Formik>
        </div>
    );
};

export default SellerVerification;