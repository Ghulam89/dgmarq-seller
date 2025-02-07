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
    const [currentStep, setCurrentStep] = React.useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
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
        cnicBack: null
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
    });

    const  navigate = useNavigate();

    const handleSubmit = async (values, { setErrors }) => {
        console.log("Form Values:", values);
    
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
                if (values[key]) {
                    formData.append(key, values[key]);
                }
            });
    
            console.log("FormData Preview:");
            for (const pair of formData.entries()) {
                console.log(pair[0], pair[1]);
            }
    
            const response = await fetch(`${Base_url}/seller/register`, {
                method: "POST",
                body: formData, 
            });
    
            console.log("Response Status:", response.ok);
    
            if (response.ok) {
                const result = await response.json();
                console.log("Success:", result);
                toast.success(result?.message || "Seller verification submitted successfully!");
                navigate('/')
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
        <div className="max-w-5xl mx-auto p-6 bg-white rounded-lg">
            <h2 className="text-2xl font-semibold mb-4">Seller Verification</h2>

            <div className="pb-6 pt-4">
                <Stepper currentStep={currentStep} />
            </div>

            <Formik
                initialValues={initialValues}
                validationSchema={currentStep === 1 ? validationSchemaStep1 : validationSchemaStep2}
                onSubmit={(values, actions) => {
                    if (currentStep === 1) {
                        setCurrentStep(2);
                    } else {
                        handleSubmit(values, actions);
                    }
                }}
            >
                {({ values, setFieldValue }) => (
                    <Form className="shadow-lg border">
                        {currentStep === 1 && (
                            <div className="pb-4 mb-4">
                                <h3 className="text-lg font-medium border-b p-3">Business Details</h3>
                                <div className="space-y-2 mt-2">
                                    <div className="flex pt-10 gap-2 justify-center">
                                        <label className="block">Business Entity Type</label>
                                        <div className="flex flex-col">
                                            <label>
                                                <Field
                                                    type="radio"
                                                    name="businessType"
                                                    value="sole_trader"
                                                    className="mr-2"
                                                />
                                                Sole Trader
                                            </label>
                                            <label>
                                                <Field
                                                    type="radio"
                                                    name="businessType"
                                                    value="company"
                                                    className="mr-2"
                                                />
                                                Company
                                            </label>
                                            <label>
                                                <Field
                                                    type="radio"
                                                    name="businessType"
                                                    value="partnership"
                                                    className="mr-2"
                                                />
                                                Partnership
                                            </label>
                                        </div>
                                    </div>
                                    <div className="flex pb-3 justify-center gap-3">
                                        <div className="w-48">
                                            <label>Company name</label>
                                        </div>
                                        <div>
                                            <Field
                                                as={Input}
                                                type="text"
                                                name="companyName"
                                                placeholder="Company Name"
                                                className="w-96 p-2 border rounded"
                                            />
                                            <ErrorMessage name="companyName" component="div" className="text-red" />
                                        </div>
                                    </div>
                                    <div className="flex pb-3 justify-center gap-3">
                                        <div className="w-48">
                                            <label className="text-sm">Registration Number</label>
                                            <p className="text-xs text-gray-500">
                                                A unique identification number given to your business by the registering
                                                institution (i.e. an official business registry number).
                                            </p>
                                        </div>
                                        <div>
                                            <Field
                                                as={Input}
                                                type="text"
                                                name="registrationNumber"
                                                placeholder="Registration Number"
                                                className="w-96 p-2 border rounded"
                                            />
                                            <ErrorMessage name="registrationNumber" component="div" className="text-red" />
                                        </div>
                                    </div>
                                    <div className="flex justify-center gap-3">
                                        <div className="w-48">
                                            <label className="text-sm">Tax Number</label>
                                            <p className="text-xs text-gray-500">
                                                A unique number given by the tax authorities in your country, usually required
                                                on all invoices or other financial documents issued by your business.
                                            </p>
                                        </div>
                                        <div>
                                            <Field
                                                as={Input}
                                                type="text"
                                                name="taxNumber"
                                                placeholder="Tax Number"
                                                className="w-96 p-2 border rounded"
                                            />
                                            <ErrorMessage name="taxNumber" component="div" className="text-red" />
                                        </div>
                                    </div>
                                </div>

                                <h3 className="text-lg font-medium pb-4 px-4 border-b">Registered Address</h3>
                                <div className="pb-4 pt-6 mb-4">
                                    <div className="flex pb-3 items-center justify-center gap-3">
                                        <div className="w-48 text-right">
                                            <label className="text-sm">Country</label>
                                        </div>
                                        <div>
                                            <Field
                                                as={Input}
                                                type="text"
                                                name="registeredCountry"
                                                placeholder="Country"
                                                className="w-96 p-2 border rounded"
                                            />
                                            <ErrorMessage name="registeredCountry" component="div" className="text-red" />
                                        </div>
                                    </div>

                                    <div className="flex pb-3 items-center justify-center gap-3">
                                        <div className="w-48 text-right">
                                            <label className="text-sm">ZIP Code</label>
                                        </div>
                                        <div>
                                            <Field
                                                as={Input}
                                                type="text"
                                                name="registeredZip"
                                                placeholder="ZIP Code"
                                                className="w-96 p-2 border rounded"
                                            />
                                            <ErrorMessage name="registeredZip" component="div" className="text-red" />
                                        </div>
                                    </div>

                                    <div className="flex pb-3 items-center justify-center gap-3">
                                        <div className="w-48 text-right">
                                            <label className="text-sm text-end">City</label>
                                        </div>
                                        <div>
                                            <Field
                                                as={Input}
                                                type="text"
                                                name="registeredCity"
                                                placeholder="City"
                                                className="w-96 p-2 border rounded"
                                            />
                                            <ErrorMessage name="registeredCity" component="div" className="text-red" />
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-center gap-3">
                                        <div className="w-48 text-right">
                                            <label className="text-sm">Street</label>
                                        </div>
                                        <div>
                                            <Field
                                                as={Input}
                                                type="text"
                                                name="registeredStreet"
                                                placeholder="Street"
                                                className="w-96 p-2 border rounded"
                                            />
                                            <ErrorMessage name="registeredStreet" component="div" className="text-red" />
                                        </div>
                                    </div>
                                </div>

                                <h3 className="text-lg font-medium pb-4 px-4 border-b">Business Address</h3>
                                <div className="pb-4 pt-6 mb-4">
                                    <div className="flex pb-3 items-center justify-center gap-3">
                                        <div className="w-48 text-right">
                                            <label className="text-sm">Country</label>
                                        </div>
                                        <div>
                                            <Field
                                                as={Input}
                                                type="text"
                                                name="businessCountry"
                                                placeholder="Country"
                                                className="w-96 p-2 border rounded"
                                            />
                                            <ErrorMessage name="businessCountry" component="div" className="text-red" />
                                        </div>
                                    </div>

                                    <div className="flex pb-3 items-center justify-center gap-3">
                                        <div className="w-48 text-right">
                                            <label className="text-sm">State (optional)</label>
                                        </div>
                                        <Field
                                            as={Input}
                                            type="text"
                                            name="businessState"
                                            placeholder="State (optional)"
                                            className="w-96 p-2 border rounded"
                                        />
                                    </div>

                                    <div className="flex pb-3 items-center justify-center gap-3">
                                        <div className="w-48 text-right">
                                            <label className="text-sm">ZIP Code</label>
                                        </div>
                                        <div>
                                            <Field
                                                as={Input}
                                                type="text"
                                                name="businessZip"
                                                placeholder="ZIP code"
                                                className="w-96 p-2 border rounded"
                                            />
                                            <ErrorMessage name="businessZip" component="div" className="text-red" />
                                        </div>
                                    </div>

                                    <div className="flex pb-3 items-center justify-center gap-3">
                                        <div className="w-48 text-right">
                                            <label className="text-sm text-end">City</label>
                                        </div>
                                        <div>
                                            <Field
                                                as={Input}
                                                type="text"
                                                name="businessCity"
                                                placeholder="City"
                                                className="w-96 p-2 border rounded"
                                            />
                                            <ErrorMessage name="businessCity" component="div" className="text-red" />
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-center gap-3">
                                        <div className="w-48 text-right">
                                            <label className="text-sm">Street</label>
                                        </div>
                                        <div>
                                            <Field
                                                as={Input}
                                                type="text"
                                                name="businessStreet"
                                                placeholder="Street"
                                                className="w-96 p-2 border rounded"
                                            />
                                            <ErrorMessage name="businessStreet" component="div" className="text-red" />
                                        </div>
                                    </div>

                                    <div className="flex items-center pt-3 justify-center gap-3">
                                        <div className="w-48 text-right">
                                            <label className="text-sm">House number</label>
                                        </div>
                                        <Field
                                            as={Input}
                                            type="text"
                                            name="businessHouseNumber"
                                            placeholder="House number"
                                            className="w-96 p-2 border rounded"
                                        />
                                    </div>
                                </div>

                                <h3 className="text-lg font-medium pb-4 px-4 border-b">Contact information</h3>
                                <div className="pb-4 pt-6 mb-4">
                                    <div className="flex pb-3 items-center justify-center gap-3">
                                        <div className="w-48 text-right">
                                            <label className="text-sm">Phone Number</label>
                                        </div>
                                        <div>
                                            <div>
                                                <Field
                                                    as={Input}
                                                    type="text"
                                                    name="phoneNumber"
                                                    placeholder="Phone"
                                                    className="w-96 p-2 border rounded"
                                                />
                                                <ErrorMessage name="phoneNumber" component="div" className="text-red" />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex pb-3 items-center justify-center gap-3">
                                        <div className="w-48 text-right">
                                            <label className="text-sm">Email Address</label>
                                        </div>
                                        <div>
                                            <Field
                                                as={Input}
                                                type="text"
                                                name="email"
                                                placeholder="Email Address"
                                                className="w-96 p-2 border rounded"
                                            />
                                            <ErrorMessage name="email" component="div" className="text-red" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {currentStep === 2 && (
                            <div className="pb-4 pt-6 mb-4">
                                <h3 className="text-lg font-medium pb-4 px-4 border-b">Attachments</h3>
                                <div className="space-y-2 mt-2">
                                    <div className="flex justify-center pt-4 gap-3">
                                        <div className="w-48">
                                            <label className="text-sm">Upload Logo</label>
                                        </div>
                                        <div>
                                            <input
                                                type="file"
                                                className="w-96 p-2 border rounded"
                                                onChange={(e) => setFieldValue("logo", e.currentTarget.files[0])}
                                            />
                                            <ErrorMessage name="logo" component="div" className="text-red" />
                                        </div>
                                    </div>
                                    <div className="flex justify-center pt-4 gap-3">
                                        <div className="w-48">
                                            <label className="text-sm">CNIC Front</label>
                                        </div>
                                        <div>
                                            <input
                                                type="file"
                                                className="w-96 p-2 border rounded"
                                                onChange={(e) => setFieldValue("cnicFront", e.currentTarget.files[0])}
                                            />
                                            <ErrorMessage name="cnicFront" component="div" className="text-red" />

                                        </div>
                                    </div>
                                    <div className="flex justify-center pt-4 gap-3">
                                        <div className="w-48">
                                            <label className="text-sm">CNIC Back</label>
                                        </div>
                                        <div>
                                            <input
                                                type="file"
                                                className="w-96 p-2 border rounded"
                                                onChange={(e) => setFieldValue("cnicBack", e.currentTarget.files[0])}
                                            />
                                            <ErrorMessage name="cnicBack" component="div" className="text-red" />
                                        </div>

                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="flex justify-center items-center pb-4">
                            {currentStep === 2 ? <p onClick={() => setCurrentStep(1)} className=" bg-blue-600 ml-4 text-white   px-3 flex items-center gap-2  py-3 cursor-pointer rounded-md"> <IoArrowBack /> Back</p>
                                : null
                            }
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className={`mx-auto w-96 p-3 rounded-lg flex items-center justify-center 
        ${isSubmitting ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 text-white"}
    `}
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
                                    <>{currentStep === 2 ? "Submit" : "Continue"}</>
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