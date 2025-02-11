import { useEffect } from "react";
import { useFormikContext } from "formik";

const AutoCalculateGST = () => {
  const { values, setFieldValue } = useFormikContext();

  useEffect(() => {
    const actualPrice = parseFloat(values.actualPrice);
    const discountValue = parseFloat(values.discountPrice);

    if (!isNaN(actualPrice) && !isNaN(discountValue) && actualPrice > 0) {
      // Calculate the discount percentage correctly
      const discountPercentage = (discountValue / actualPrice) * 100;

      // Update the GST percentage if changed
      if (discountPercentage.toFixed(2) !== values.gst) {
        setFieldValue("gst",parseInt(discountPercentage.toFixed(2)));
      }
    } else {
      setFieldValue("gst", ""); // Reset GST if values are invalid
    }
  }, [values.actualPrice, values.discountPrice, values.gst, setFieldValue]);

  return null;
};

export default AutoCalculateGST;
