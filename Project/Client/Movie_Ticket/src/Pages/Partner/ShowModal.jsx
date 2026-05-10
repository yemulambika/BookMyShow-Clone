import React, { useEffect, useState } from "react";
import { Button, Modal, Table, Form, Row, Col, Input, Select , message } from "antd";
import moment from "moment";
import {
  ArrowLeftOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { getAllMovies } from "../../calls/movieCalls";
import { addShow, getShows } from "../../calls/showCalls";



const ShowModal = ({ isShowModalOpen, setIsShowModalOpen , selectedTheatre }) => {
  const [view, setView] = useState("table");
  const [movies , setMovies] = useState([])
  const [shows , setShows] = useState([])

  console.log(selectedTheatre._id)

  function handleCancel() {
    setIsShowModalOpen(false);
  }

  const getData = async()=>{
    try {
        const movieResponse = await getAllMovies()
        if(movieResponse.success){
            console.log(movieResponse.data)
            setMovies(movieResponse.data)
        }
        else{
            message.error(movieResponse.error);
        }

       const allShowsResponse =  await getShows({thearteId : selectedTheatre._id})
     
       if(allShowsResponse.success){
        console.log(allShowsResponse.data)
        setShows(allShowsResponse.data)
         console.log(allShowsResponse)
       }
       else{
        message.error(allShowsResponse.message);
       }
        
    } catch (error) {
        message.error(error.message);
    }
  }


  const onFinish = async(values)=>{
      try {
         const response = await addShow({ ...values, theatre: selectedTheatre._id })
         console.log(response)
         if(response.sucess){
            message.success(response.message);
            setView('table')
         }
      } catch (error) {
        message.error('Cannot add Show')
      }
  }


  useEffect(()=>{
    getData()
  }, [])

  const columns = [
    {
      title: "ShowName",
      dataIndex: 'name'


    },
    {
      title: "Show Date",
      dataIndex: "date",
      render: (text, data) => {
        return moment(data.date).format("DD-MM-YYYY");
      },

    },
    {
      title: "Show Time",
      dataIndex: "time",
    },
    {
      title: "Movie",
      dataIndex: "movie",
      render : (text , data)=>{
        return data.movie.title
      }
    },

    {
      title: "Theatre",
      dataIndex: "movie",
      render : (text , data)=>{
        return data.theatre.name
      }

    },

    {
      title: "Total Seats",
      dataIndex : 'totalSeats'
    },
    {
      title: "Ticket Price",
      dataIndex:'ticketPrice'
    },
    // {
    //   title: "Availbale Seats",
    //   dataIndex:'seats'
    // },
  ];

  return (
    <>
      <Modal width={1200} onCancel={handleCancel} open={isShowModalOpen}>
        <div className="d-flex justify-content-between">
          <h3>
            {view === "table"
              ? "List of Shows"
              : view === "form"
              ? "Add Show"
              : "Edit Show"}
          </h3>
          {view === "table" && (
            <Button type="primary" onClick={() => setView("form")}>
              Add Show
            </Button>
          )}
        </div>

        {view === "table" && <Table dataSource={shows} columns={columns} />}

        {view === "form" && (
          <Form onFinish={onFinish}>
            <Row
              gutter={{
                xs: 6,
                sm: 10,
                md: 12,
                lg: 16,
              }}
            >
              <Col span={24}>
                <Row
                  gutter={{
                    xs: 6,
                    sm: 10,
                    md: 12,
                    lg: 16,
                  }}
                >
                  <Col span={8}>
                    <Form.Item
                      label="Show Name"
                      htmlFor="name"
                      name="name"
                      className="d-block"
                      rules={[
                        { required: true, message: "Show name is required!" },
                      ]}
                    >
                      <Input
                        id="name"
                        type="text"
                        placeholder="Enter the show name"
                      ></Input>
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item
                      label="Show Date"
                      htmlFor="date"
                      name="date"
                      className="d-block"
                      rules={[
                        { required: true, message: "Show date is required!" },
                      ]}
                    >
                      <Input
                        id="date"
                        type="date"
                        placeholder="Enter the show date"
                      ></Input>
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item
                      label="Show Timing"
                      htmlFor="time"
                      name="time"
                      className="d-block"
                      rules={[
                        { required: true, message: "Show time is required!" },
                      ]}
                    >
                      <Input
                        id="time"
                        type="time"
                        placeholder="Enter the show date"
                      ></Input>
                    </Form.Item>
                  </Col>
                </Row>
              </Col>
              <Col span={24}>
                <Row
                  gutter={{
                    xs: 6,
                    sm: 10,
                    md: 12,
                    lg: 16,
                  }}
                >
                  <Col span={8}>
                    <Form.Item
                      label="Select the Movie"
                      htmlFor="movie"
                      name="movie"
                      className="d-block"
                      rules={[
                        { required: true, message: "Movie  is required!" },
                      ]}
                    >
                      <Select
                        id="movie"
                        placeholder="Select Movie"
                        // defaultValue={selectedMovie && selectedMovie.title}
                        style={{ width: "100%", height: "45px" }}
                        options={movies.map((movie) => ({
                          key: movie._id,
                          value: movie._id,
                          label: movie.title,
                        }))}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item
                      label="Ticket Price"
                      htmlFor="ticketPrice"
                      name="ticketPrice"
                      className="d-block"
                      rules={[
                        {
                          required: true,
                          message: "Ticket price is required!",
                        },
                      ]}
                    >
                      <Input
                        id="ticketPrice"
                        type="number"
                        placeholder="Enter the ticket price"
                      ></Input>
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item
                      label="Total Seats"
                      htmlFor="totalSeats"
                      name="totalSeats"
                      className="d-block"
                      rules={[
                        {
                          required: true,
                          message: "Total seats are required!",
                        },
                      ]}
                    >
                      <Input
                        id="totalSeats"
                        type="number"
                        placeholder="Enter the number of total seats"
                      ></Input>
                    </Form.Item>
                  </Col>
                </Row>
              </Col>
            </Row>
            <div className="d-flex gap-10">
              <Button
                className=""
                block
                onClick={() => {
                  setView("table");
                }}
                htmlType="button"
              >
                <ArrowLeftOutlined /> Go Back
              </Button>
              <Button
                block
                type="primary"
                htmlType="submit"
                style={{ fontSize: "1rem", fontWeight: "600" }}
              >
                {view === "form" ? "Add the Show" : "Edit the Show"}
              </Button>
            </div>
          </Form>
        )}
      </Modal>
    </>
  );
};

export default ShowModal;