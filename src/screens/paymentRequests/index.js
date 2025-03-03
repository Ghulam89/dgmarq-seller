import React, { useEffect, useState } from "react";
import Wrapper from "../Wrapper";
import { Base_url } from "../../utils/Base_url";
import axios from "axios";
import Swal from "sweetalert2";
import Button from "../../components/Button";
import AddPaymentRequests from "./AddPaymentRequests";
const PaymentRequests = () => {

  const userData = JSON.parse(localStorage.getItem('ceat_admin_user'))
    console.log(userData?._id,'uerdata');

  const [products, setProducts] = useState([]);
  useEffect(() => {
    axios
      .get(`${Base_url}/withdraw/getBySellerId/${userData?._id}`)
      .then((res) => {
        console.log(res?.data);

        setProducts(res?.data?.data);
      })
      .catch((error) => {
        console.log(error);
      });


  }, []);

  const removeFunction = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#A47ABF",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(`${Base_url}/withdraw/delete/${id}`)
          .then((res) => {
            console.log(res);
            if (res.status === 200) {
              Swal.fire("Deleted!", "Your file has been deleted.", "success");
              axios
                .get(`${Base_url}/withdraw/getBySellerId`)
                .then((res) => {
                  console.log(res?.data);

                  setProducts(res?.data?.data);
                })
                .catch((error) => {
                  console.log(error);
                });

            }
          })
          .catch((error) => {
            console.log(error);
          });
      }
    });
  };

 const [isOpen,setOpen] = useState(false);

  return (
    <Wrapper>
      <div className=" flex   justify-between items-center">
        <div>
          <h2 className="main_title">Payment Request</h2>
        </div>
        <div>
            <Button onClick={()=>setOpen(true)} label={'Add Requests'} className={' bg-primary'} />    
        </div>

      </div>
      <AddPaymentRequests  setIsModalOpen={setOpen} setUsers={setProducts} isModalOpen={isOpen}  />


      <section className="mb-20 mt-7 text-gray-800">
        <div className="block rounded-lg shadow-lg">
          <div className="flex overflow-x-auto flex-col">
            <div className=" sm:-mx-6 lg:-mx-8">
              <div className="inline-block min-w-full sm:px-6 lg:px-8">
                <div className="">
                  <table className="min-w-full mb-0">
                    <thead className=" bg-primary">
                      <tr className=" rounded-lg whitespace-nowrap ">
                        <th
                          scope="col"
                          className=" text-sm text-white  font-bold px-6 py-4"
                        >
                          No
                        </th>
                        <th
                          scope="col"
                          className=" text-sm text-white  font-bold px-6 py-4"
                        >
                          Amount
                        </th>

                      </tr>
                    </thead>
                    <tbody className="">
                      {products?.map((item, index) => {
                        return (
                          <tr className="bg-white border-t   rounded-md ">
                            <th
                              scope="row"
                              className="text-sm font-normal px-6 py-4   whitespace-nowrap "
                            >
                              <p className="mb-0.5 font-medium text-black">
                                #{index + 1}
                              </p>
                            </th>
                            <td className="align-middle text-sm font-normal px-6 py-4 whitespace-nowrap  text-center">
                              <span className=" text-base text-black  py-1 px-2.5 leading-none text-center whitespace-nowrap align-baseline   bg-green-200  rounded-full">
                                {item?.amount}
                              </span>
                            </td>


                           
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>


    </Wrapper>
  );
};

export default PaymentRequests;
