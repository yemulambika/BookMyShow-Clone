import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getTheShow } from "../calls/showCalls";
import { createCheckoutSession } from "../calls/bookingCalls";
import { Card, Row, Col, Typography, Button, Divider, Space, message } from "antd";
import { useSelector } from "react-redux";
import moment from "moment";

const { Title, Text } = Typography;

function BookShow() {
  const params = useParams();
  const navigate = useNavigate();
  const { userData } = useSelector((state) => state.user);
  const [show, setShow] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [loading, setLoading] = useState(false);
  const columns = 10;

  console.log(selectedSeats)

  const getData = async () => {
    try {
      const res = await getTheShow({ showId: params.id });
      if (res && res.success && res.data) {
        console.log(res.data)
      setShow(res.data);
      } else if (typeof res === 'string') {
        message.error(res);
      } else {
        message.error("Failed to load show details");
      }
    } catch (error) {
      console.log(error);
      message.error("Error loading show details");
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const isSeatBooked = (seatNumber) => {
    return show?.bookedSeats?.includes(seatNumber) || false;
  };

  const isSeatSelected = (seatNumber) => {
    return selectedSeats.includes(seatNumber);
  };

  const handleSeatClick = (seatNumber) => {
    if (isSeatBooked(seatNumber)) {
      return; // Can't select booked seats
    }

    if (isSeatSelected(seatNumber)) {
      // Deselect seat
      setSelectedSeats(selectedSeats.filter((seat) => seat !== seatNumber));
    } else {
      // Select seat
      setSelectedSeats([...selectedSeats, seatNumber]);
    }
  };

  const getSeatStyle = (seatNumber) => {
    if (isSeatBooked(seatNumber)) {
      return {
        backgroundColor: "#d9d9d9",
        cursor: "not-allowed",
        color: "#8c8c8c",
      };
    }
    if (isSeatSelected(seatNumber)) {
      return {
        backgroundColor: "#1890ff",
        color: "white",
        cursor: "pointer",
      };
    }
    return {
      backgroundColor: "#f0f0f0",
      cursor: "pointer",
    };
  };

  const totalPrice = selectedSeats.length * (show?.ticketPrice || 0); 

  const handleBooking = async () => {
    if (selectedSeats.length === 0) {
      message.warning("Please select at least one seat");
      return;
    }

    if (!userData || !userData._id) {
      message.error("Please login to book tickets");
      navigate("/login");
      return;
    }

    setLoading(true);

    try {
      const response = await createCheckoutSession({
        amount: totalPrice,
        userId: userData._id,
        showId: show._id,
        seats: selectedSeats,
        showName: show.movie?.title || "Movie",
        customerName: userData.name || "",
        customerEmail: userData.email || "",
      });

      if (response.success && response.data.url) {
        // Redirect to Stripe checkout
        window.location.href = response.data.url;
      } else {
        message.error(response.message || "Failed to initiate payment");
        setLoading(false);
      }
    } catch (error) {
      console.error("Error in booking:", error);
      message.error("Failed to initiate payment");
      setLoading(false);
    }
  };

  if (!show) {
    return <div style={{ padding: 20 }}>Loading...</div>;
  }

  const totalSeats = show.totalSeats || 0; // 200


  return (
    <div style={{ padding: 20, maxWidth: 1200, margin: "0 auto" }}>
      <Card>
        {/* Show Information */}
        <div style={{ marginBottom: 24 }}>
          <Title level={2}>{show.movie?.title || "Movie"}</Title>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div>
              <Text strong>Theatre: </Text>
              <Text>{show.theatre?.name || "N/A"}</Text>
            </div>
            <div>
              <Text strong>Address: </Text>
              <Text>{show.theatre?.address || "N/A"}</Text>
            </div>
            <div>
              <Text strong>Date: </Text>
              <Text>{moment(show.date).format("MMMM DD, YYYY")}</Text>
            </div>
            <div>
              <Text strong>Time: </Text>
              <Text>{show.time}</Text>
            </div>
            <div>
              <Text strong>Price per ticket: </Text>
              <Text>₹{show.ticketPrice}</Text>
            </div>
          </div>
        </div>

        <Divider />

        {/* Screen */}
        <div
          style={{
            textAlign: "center",
            marginBottom: 30,
            padding: "10px 0",
            backgroundColor: "#f0f0f0",
            borderRadius: 4,
          }}
        >
          <Text strong style={{ fontSize: 16 }}>
            SCREEN
          </Text>
        </div>

        {/* Seating Arrangement */}
        <div style={{ marginBottom: 24 }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: `repeat(${columns}, 1fr)`,
              gap: 20,
              marginBottom: 20,
            }}
          >
            {Array.from({ length: totalSeats }, (_, index) => {
              const seatNumber = index + 1; // 200
              return (
                <Button
                  key={seatNumber}
                  onClick={() => handleSeatClick(seatNumber)}
                  disabled={isSeatBooked(seatNumber)}
                  style={{
                    ...getSeatStyle(seatNumber),
                    height: 40,
                    minWidth: 40,
                    padding: 0,
                    border: "1px solid #d9d9d9",
                  }}
                >
                  {seatNumber}
                </Button>
              );
            })}
          </div>
        </div>

        {/* Legend */}
        <div style={{ marginBottom: 24, textAlign: "center" }}>
          <Space size="large">
            <Space>
              <div
                style={{
                  width: 20,
                  height: 20,
                  backgroundColor: "#f0f0f0",
                  border: "1px solid #d9d9d9",
                }}
              />
              <Text>Available</Text>
            </Space>
            <Space>
              <div
                style={{
                  width: 20,
                  height: 20,
                  backgroundColor: "#1890ff",
                }}
              />
              <Text>Selected</Text>
            </Space>
            <Space>
              <div
                style={{
                  width: 20,
                  height: 20,
                  backgroundColor: "#d9d9d9",
                }}
              />
              <Text>Booked</Text>
            </Space>
          </Space>
        </div>

        <Divider />

        {/* Booking Summary */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, width: "100%" }}>
            <div>
              <Text strong>Selected Seats: </Text>
              <Text>
                {selectedSeats.length > 0
                  ? selectedSeats.sort((a, b) => a - b).join(", ")
                  : "None"}
              </Text>
            </div>
            <div>
              <Text strong>Total Seats: </Text>
              <Text>{selectedSeats.length}</Text>
            </div>
            <div>
              <Text strong>Total Price: </Text>
              <Text style={{ fontSize: 18, color: "#1890ff" }}>
                ₹{totalPrice}
              </Text>
            </div>
          </div>
        </div>

        {/* Book Button */}
          <Button
          type="primary"
          size="large"
          block
          onClick={handleBooking}
          disabled={selectedSeats.length === 0 || loading}
          loading={loading}
          style={{ height: 50, fontSize: 16 }}
        >
          {loading ? "Processing..." : "Pay with Stripe"}
        </Button>
      </Card>
    </div>
  );
}

export default BookShow;