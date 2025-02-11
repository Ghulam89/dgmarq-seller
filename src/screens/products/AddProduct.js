import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { Base_url } from "../../utils/Base_url";
import axios from "axios";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Button from "../../components/Button";
import { MdClose } from "react-icons/md";
import Wrapper from "../Wrapper";
import { useNavigate } from "react-router-dom";
import AutoCalculateGST from "./AutoCalculateGST"; // Adjust the import path as needed

const AddProduct = () => {
  const userData = JSON.parse(localStorage.getItem("ceat_admin_user"));
  const navigate = useNavigate();
  const [loading, setLoader] = useState(false);
  const [categories, setCategories] = useState([]);
  const [region, setRegion] = useState([]);
  const [platform, setPlatfrom] = useState([]);
  const [subcategories, setSubCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);

  useEffect(() => {
    axios.get(`${Base_url}/region/getAll`).then((res) => setRegion(res.data.data)).catch(console.error);
    axios.get(`${Base_url}/platform/getAll`).then((res) => setPlatfrom(res.data.data)).catch(console.error);
    axios.get(`${Base_url}/category/getAll`).then((res) => setCategories(res.data.data)).catch(console.error);
    axios.get(`${Base_url}/subcategory/getAll`).then((res) => setSubCategories(res.data.data)).catch(console.error);
    axios.get(`${Base_url}/brands/getAll`).then((res) => setBrands(res.data.data)).catch(console.error);
  }, []);

  // Image Preview Handler
  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    setSelectedFiles((prevFiles) => [...prevFiles, ...files]);
    const previews = files.map((file) => URL.createObjectURL(file));
    setPreviewImages((prevPreviews) => [...prevPreviews, ...previews]);
  };

  // Remove Image Handler
  const handleRemoveImage = (index) => {
    setPreviewImages((prev) => prev.filter((_, i) => i !== index));
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  // Validation Schema
  const validationSchema = Yup.object().shape({
    title: Yup.string().required("Title is required"),
    actualPrice: Yup.string().required("Actual price is required"),
    discountPrice: Yup.string().required("Discount price is required"),
    gst: Yup.string().required("Gst is required"),
    description: Yup.string().required("Description is required"),
    categoryId: Yup.string().required("Category selection is required"),
    platform: Yup.string().required("Platform selection is required"),
    region: Yup.string().required("Region selection is required"),
    subCategoryId: Yup.string().required("Sub Category selection is required"),
    brandId: Yup.string().required("Brand selection is required"),
    type: Yup.string().required("Type selection is required"),
    stock: Yup.string().required("Stock is required"),
    minStock: Yup.string().required("Min Stock is required"),
    stockStatus: Yup.string().required("Stock status is required"),
    images: Yup.array().min(1, "At least one image is required"),
  });

  // Form Submit Handler
  const onSubmit = async (values, { resetForm }) => {
    setLoader(true);
    const formData = new FormData();
    selectedFiles.forEach((file) => {
      formData.append("images", file);
    });
    formData.append("sellerId", userData?._id);
    Object.keys(values).forEach((key) => {
      if (key !== "images") {
        formData.append(key, values[key]);
      }
    });

    try {
      const response = await axios.post(`${Base_url}/products/create`, formData);
      if (response.status === 200) {
        toast.success(response.data.message);
        resetForm();
        setPreviewImages([]);
        setSelectedFiles([]);
        navigate("/products");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong!");
    } finally {
      setLoader(false);
    }
  };

  return (
    <Wrapper>
      <div className="p-3 flex justify-between items-center">
        <h1 className="capitalize main_title font-semibold">Add Products</h1>
      </div>
      <div className="p-5 shadow-lg bg-white mt-4 rounded-md">
        <Formik
          initialValues={{
            title: "",
            categoryId: "",
            subCategoryId: "",
            actualPrice: "",
            discountPrice: "",
            gst: "",
            description: "",
            region: "",
            brandId: "",
            platform: "",
            stock: "",
            minStock: "",
            stockStatus: "",
            type: "",
            images: [],
          }}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
        >
          {({ handleSubmit, setFieldValue, values }) => (
            <>
              {/* This component will update the GST field automatically */}
              <AutoCalculateGST />

              <Form onSubmit={handleSubmit}>
                <div className="flex gap-5 justify-between flex-wrap">
                  {/* Product Name */}
                  <div className="w-[100%]">
                    <label className="block mb-2 text-sm font-medium text-gray-900">
                      Product Name
                    </label>
                    <Field
                      name="title"
                      type="text"
                      placeholder="Enter name"
                      className="border w-full bg-lightGray py-3 px-2 rounded-md"
                    />
                    <ErrorMessage name="title" component="div" className="text-red text-sm mt-1" />
                  </div>

                  {/* Region */}
                  <div className="w-[49%]">
                    <label className="block mb-2 text-sm font-medium text-gray-900">Region</label>
                    <Field
                      as="select"
                      name="region"
                      className="outline-none bg-lightGray w-full border p-2.5 text-black placeholder:text-black rounded-md"
                    >
                      <option value="" label="Select Region" />
                      {region.map((item) => (
                        <option key={item._id} value={item._id}>
                          {item.title}
                        </option>
                      ))}
                    </Field>
                    <ErrorMessage name="region" component="div" className="text-red text-sm mt-1" />
                  </div>

                  {/* Platform */}
                  <div className="w-[49%]">
                    <label className="block mb-2 text-sm font-medium text-gray-900">Platform</label>
                    <Field
                      as="select"
                      name="platform"
                      className="outline-none bg-lightGray w-full border p-2.5 text-black placeholder:text-black rounded-md"
                    >
                      <option value="" label="Select Platform" />
                      {platform.map((item) => (
                        <option key={item._id} value={item._id}>
                          {item.title}
                        </option>
                      ))}
                    </Field>
                    <ErrorMessage name="platform" component="div" className="text-red text-sm mt-1" />
                  </div>

                  {/* Type */}
                  <div className="w-[49%]">
                    <label className="block mb-2 text-sm font-medium text-gray-900">Type</label>
                    <Field
                      as="select"
                      name="type"
                      className="outline-none bg-lightGray w-full border p-2.5 text-black placeholder:text-black rounded-md"
                    >
                      <option value="" label="Select Type" />
                      <option value="key">Key</option>
                      <option value="account">Account</option>
                      <option value="gift">Gift</option>
                    </Field>
                    <ErrorMessage name="type" component="div" className="text-red text-sm mt-1" />
                  </div>

                  {/* Stock */}
                  <div className="w-[48%]">
                    <label className="block mb-2 text-sm font-medium text-gray-900">Stock</label>
                    <Field
                      name="stock"
                      type="text"
                      placeholder="Enter stock"
                      className="border w-full bg-lightGray py-3 px-2 rounded-md"
                    />
                    <ErrorMessage name="stock" component="div" className="text-red text-sm mt-1" />
                  </div>

                  {/* Min Stock */}
                  <div className="w-[48%]">
                    <label className="block mb-2 text-sm font-medium text-gray-900">Min Stock</label>
                    <Field
                      name="minStock"
                      type="text"
                      placeholder="Enter min Stock"
                      className="border w-full bg-lightGray py-3 px-2 rounded-md"
                    />
                    <ErrorMessage name="minStock" component="div" className="text-red text-sm mt-1" />
                  </div>

                  {/* Stock Status */}
                  <div className="w-[49%]">
                    <label className="block mb-2 text-sm font-medium text-gray-900">Stock Status</label>
                    <Field
                      as="select"
                      name="stockStatus"
                      className="outline-none bg-lightGray w-full border p-2.5 text-black placeholder:text-black rounded-md"
                    >
                      <option value="" label="Select" />
                      <option value="In Stock">In Stock</option>
                      <option value="Out Of Stock">Out Of Stock</option>
                    </Field>
                    <ErrorMessage name="stockStatus" component="div" className="text-red text-sm mt-1" />
                  </div>

                  {/* Brand (Categories) */}
                  <div className="w-[49%]">
                    <label className="block mb-2 text-sm font-medium text-gray-900">Categories</label>
                    <Field
                      as="select"
                      name="brandId"
                      className="outline-none bg-lightGray w-full border p-2.5 text-black placeholder:text-black rounded-md"
                    >
                      <option value="" label="Select Categories" />
                      {brands.map((item) => (
                        <option key={item._id} value={item._id}>
                          {item.name}
                        </option>
                      ))}
                    </Field>
                    <ErrorMessage name="brandId" component="div" className="text-red text-sm mt-1" />
                  </div>

                  {/* Category */}
                  <div className="w-[49%]">
                    <label className="block mb-2 text-sm font-medium text-gray-900">Sub Categories</label>
                    <Field
                      as="select"
                      name="categoryId"
                      className="outline-none bg-lightGray w-full border p-2.5 text-black placeholder:text-black rounded-md"
                    >
                      <option value="" label="Select categories" />
                      {categories.map((item) => (
                        <option key={item._id} value={item._id}>
                          {item.title}
                        </option>
                      ))}
                    </Field>
                    <ErrorMessage name="categoryId" component="div" className="text-red text-sm mt-1" />
                  </div>

                  {/* Sub Category */}
                  <div className="w-[49%]">
                    <label className="block mb-2 text-sm font-medium text-gray-900">Sub Sub Categories</label>
                    <Field
                      as="select"
                      name="subCategoryId"
                      className="outline-none bg-lightGray w-full border p-2.5 text-black placeholder:text-black rounded-md"
                    >
                      <option value="" label="Select sub categories" />
                      {subcategories.map((item) => (
                        <option key={item._id} value={item._id}>
                          {item.title}
                        </option>
                      ))}
                    </Field>
                    <ErrorMessage name="subCategoryId" component="div" className="text-red text-sm mt-1" />
                  </div>

                  {/* Actual Price */}
                  <div className="w-[49%]">
                    <label className="block mb-2 text-sm font-medium text-gray-900">Actual Price</label>
                    <Field
                      name="actualPrice"
                      type="text"
                      placeholder="Enter Actual Price"
                      className="border w-full bg-lightGray py-3 px-2 rounded-md"
                    />
                    <ErrorMessage name="actualPrice" component="div" className="text-red text-sm mt-1" />
                  </div>

                  {/* Discount Price */}
                  <div className="w-[49%]">
                    <label className="block mb-2 text-sm font-medium text-gray-900">Discount Price</label>
                    <Field
                      name="discountPrice"
                      type="text"
                      placeholder="Enter Discount Price"
                      className="border w-full bg-lightGray py-3 px-2 rounded-md"
                    />
                    <ErrorMessage name="discountPrice" component="div" className="text-red text-sm mt-1" />
                  </div>

                  {/* GST (Calculated automatically) */}
                  <div className="w-[49%]">
                    <label className="block mb-2 text-sm font-medium text-gray-900">GST</label>
                    <Field
                      name="gst"
                      type="number"
                      placeholder="GST will be calculated automatically"
                      className="border w-full bg-lightGray py-3 px-2 rounded-md"
                      disabled
                    />
                    <ErrorMessage name="gst" component="div" className="text-red text-sm mt-1" />
                  </div>

                  {/* Image Upload */}
                  <div className="w-[100%]">
                    <label className="block mb-2 text-sm font-medium text-gray-900">Upload Images</label>
                    <input
                      type="file"
                      multiple
                      onChange={(e) => {
                        handleFileChange(e);
                        setFieldValue("images", [...selectedFiles, ...Array.from(e.target.files)]);
                      }}
                      className="block w-full p-3 text-sm text-gray-900 border rounded-md cursor-pointer focus:outline-none"
                    />
                    <div className="flex flex-wrap gap-4 mt-3">
                      {previewImages.map((image, index) => (
                        <div key={index} className="relative">
                          <img
                            src={image}
                            alt="Preview"
                            className="w-24 h-24 object-cover rounded-md shadow-md"
                          />
                          <button
                            type="button"
                            className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1"
                            onClick={() => {
                              handleRemoveImage(index);
                              setFieldValue("images", selectedFiles.filter((_, i) => i !== index));
                            }}
                          >
                            <MdClose size={20} />
                          </button>
                        </div>
                      ))}
                    </div>
                    <ErrorMessage name="images" component="div" className="text-red text-sm mt-1" />
                  </div>

                  {/* Description */}
                  <div className="w-[100%]">
                    <label className="block mb-2 text-sm font-medium text-gray-900">Description</label>
                    <Field
                      as="textarea"
                      name="description"
                      placeholder="Enter Description"
                      className="border w-full bg-lightGray py-3 px-2 rounded-md"
                    />
                    <ErrorMessage name="description" component="div" className="text-red text-sm mt-1" />
                  </div>
                </div>

                <div className="flex justify-center items-center">
                  {loading ? (
                    <button
                      disabled
                      type="button"
                      className="h-11 bg-primary w-64 border-none outline-none rounded-lg mt-4 shadow-sm cursor-pointer text-lg text-white font-semibold"
                    >
                      Loading...
                    </button>
                  ) : (
                    <Button
                      label="Submit"
                      type="submit"
                      className="bg-primary mt-3 uppercase w-64 text-white py-2"
                    />
                  )}
                </div>
              </Form>
            </>
          )}
        </Formik>
      </div>
    </Wrapper>
  );
};

export default AddProduct;
