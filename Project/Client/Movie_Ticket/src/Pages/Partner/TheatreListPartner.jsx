import React, { useEffect, useState } from "react";
import { Table, Button, message } from "antd";
// import DeleteTheatreModal from './DeleteTheatreModal';
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { useSelector, useDispatch } from "react-redux";
import TheatreForm from "./TheatreForm";
import { getAllTheatres } from "../../calls/theatreCalls.js";
import { setUserData } from "../../redux/userSlice";
import { getCurrentUser } from "../../calls/authCalls";
import ShowModal from "./ShowModal";



const TheatreListPartner = () => {
  const { userData } = useSelector((state) => state.user);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isShowModalOpen, setIsShowModalOpen] = useState(false);
  const [selectedTheatre, setSelectedTheatre] = useState(null);
  const [formType, setFormType] = useState("add");
  const [theatres, setTheatres] = useState(null);
  const dispatch = useDispatch();




  const getData = async (userId = null) => {
    try {
      const ownerId = userId || userData?._id;
      if (!ownerId) {
        message.error("User data not available");
        return;
      }

      const response = await getAllTheatres({ owner: ownerId });
      console.log("Get theatres response:", response);
      if (response && response.success) {
        const allTheatres = response.data || [];
        console.log("All theatres:", allTheatres);
        setTheatres(
          allTheatres.map(function (item) {
            return { ...item, key: `theatre${item._id}` };
          })
        );
      } else {
        message.error(response?.message || "Failed to fetch theatres");
      }
    } catch (err) {
      console.error("Error in getData:", err);
      message.error(err.message || "Failed to fetch theatres");
    }
  };


   useEffect(() => {
      (async () => {
        const user = await getCurrentUser();
        dispatch(setUserData(user || null));
        if (user && user._id) {
          getData(user._id);
        }
      })();
    }, []);

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
    },
    {
      title: "Phone Number",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (status, data) => {
        if(data.isActive){
            return `Approved`
        }else{
            return `Pending/ Blocked`
        }
      }
    },
    {
      title: "Action",
      dataIndex: "action",
      render: (text, data) => {
        return (
          <div className="d-flex align-items-center gap-10">
            <Button
              onClick={() => {
                setIsModalOpen(true);
                setFormType("edit");
                setSelectedTheatre(data);
              }}
            >
              <EditOutlined />
            </Button>
            <Button
              onClick={() => {
                setIsDeleteModalOpen(true);
                setSelectedTheatre(data);
              }}
            >
              <DeleteOutlined />
            </Button>
            {data.isActive && (
              <Button
                onClick={() => {
                  setIsShowModalOpen(true);
                  setSelectedTheatre(data);
                }}
              >
                + Shows
              </Button>
            )}
          </div>
        );
      },
    },
  ];

  
  return (
    <>
      <div className="d-flex justify-content-end">
        <Button type="primary" onClick={() => {
          setFormType("add");
          setSelectedTheatre(null);
          setIsModalOpen(true);
        }}>
          Add Theatre
        </Button>
      </div>
      <Table dataSource={theatres || []} columns={columns} />
      {isModalOpen && (
        <TheatreForm
          isModalOpen={isModalOpen}
          formType={formType}
          setIsModalOpen={setIsModalOpen}
          selectedTheatre={selectedTheatre}
          setSelectedTheatre={setSelectedTheatre}
          getData={getData}
        />
      )}

     {
      isShowModalOpen && <ShowModal isShowModalOpen={isShowModalOpen} setIsShowModalOpen={setIsShowModalOpen} selectedTheatre={selectedTheatre} setSelectedTheatre={setSelectedTheatre} />
     }

    </>
  );
};

export default TheatreListPartner;