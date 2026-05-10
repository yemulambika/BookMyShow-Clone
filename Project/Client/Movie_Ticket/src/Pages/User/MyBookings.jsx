import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getUserBookings } from "../../calls/bookingCalls";
import { Card, Tag, Typography, Empty, Spin, message, Row, Col, Space, Divider } from "antd";
import { CalendarOutlined, ClockCircleOutlined, EnvironmentOutlined, DollarOutlined, CheckCircleOutlined, CloseCircleOutlined, SyncOutlined } from "@ant-design/icons";
import moment from "moment";
import Navbar from "../../components/Navbar";
import "./MyBookings.css";

const { Title, Text } = Typography;

function MyBookings() {
  const { userData } = useSelector((state) => state.user);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = async () => {
    if (!userData || !userData._id) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await getUserBookings(userData._id);
      
      if (response.success && response.data) {
        setBookings(response.data);
      } else {
        message.error(response.message || "Failed to fetch bookings");
      }
    } catch (error) {
      console.error("Error fetching bookings:", error);
      message.error("Error loading bookings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [userData]);

  const getStatusConfig = (status) => {
    switch (status) {
      case "completed":
        return { color: "green", icon: <CheckCircleOutlined />, text: "Confirmed" };
      case "pending":
        return { color: "orange", icon: <SyncOutlined spin />, text: "Pending" };
      case "failed":
        return { color: "red", icon: <CloseCircleOutlined />, text: "Failed" };
      default:
        return { color: "default", icon: null, text: status?.toUpperCase() || "PENDING" };
    }
  };

  const formatTime = (time) => {
    if (!time) return "N/A";
    return moment(time, "HH:mm").format("hh:mm A");
  };

  return (
    <div className="my-bookings-page">
      <Navbar />
      <div className="bookings-container">
        <div className="bookings-header">
          <Title level={1} className="page-title">My Bookings</Title>
          <Text className="page-subtitle">Your movie tickets and booking history</Text>
        </div>
        
        {loading ? (
          <div className="loading-container">
            <Spin size="large" />
          </div>
        ) : bookings.length === 0 ? (
          <Card className="empty-card">
            <Empty
              description="No bookings found"
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            />
          </Card>
        ) : (
          <Row gutter={[24, 24]}>
            {bookings.map((booking) => {
              const movie = booking.show?.movie;
              const theatre = booking.show?.theatre;
              const statusConfig = getStatusConfig(booking.status);
              
              return (
                <Col xs={24} sm={24} md={12} lg={12} xl={8} key={booking._id}>
                  <Card className="ticket-card" hoverable>
                    <div className="ticket-content">
                      {/* Movie Poster Section */}
                      <div className="ticket-poster-section">
                        <div className="poster-wrapper">
                          <img
                            src={movie?.posterPath || "https://via.placeholder.com/200x300?text=No+Image"}
                            alt={movie?.title || "Movie"}
                            className="movie-poster"
                            onError={(e) => {
                              e.target.src = "https://via.placeholder.com/200x300?text=No+Image";
                            }}
                          />
                          <div className="poster-overlay">
                            <Tag 
                              color={statusConfig.color} 
                              className="status-tag"
                              icon={statusConfig.icon}
                            >
                              {statusConfig.text}
                            </Tag>
                          </div>
                        </div>
                      </div>

                      {/* Ticket Details Section */}
                      <div className="ticket-details">
                        <Title level={4} className="movie-title">
                          {movie?.title || "Unknown Movie"}
                        </Title>

                        <Divider className="ticket-divider" />

                        <Space direction="vertical" size="middle" className="details-list">
                          {theatre && (
                            <div className="detail-item">
                              <EnvironmentOutlined className="detail-icon" />
                              <div className="detail-content">
                                <Text className="detail-label">Theatre</Text>
                                <Text strong className="detail-value">
                                  {theatre.name}
                                </Text>
                                {theatre.address && (
                                  <Text type="secondary" className="detail-subtext">
                                    {theatre.address}
                                  </Text>
                                )}
                              </div>
                            </div>
                          )}

                          <div className="detail-item">
                            <CalendarOutlined className="detail-icon" />
                            <div className="detail-content">
                              <Text className="detail-label">Show Date</Text>
                              <Text strong className="detail-value">
                                {booking.show?.date 
                                  ? moment(booking.show.date).format("MMM DD, YYYY")
                                  : "N/A"}
                              </Text>
                            </div>
                          </div>

                          <div className="detail-item">
                            <ClockCircleOutlined className="detail-icon" />
                            <div className="detail-content">
                              <Text className="detail-label">Show Time</Text>
                              <Text strong className="detail-value">
                                {formatTime(booking.show?.time)}
                              </Text>
                            </div>
                          </div>

                          <div className="detail-item">
                            <div className="detail-icon seats-icon">🎫</div>
                            <div className="detail-content">
                              <Text className="detail-label">Seats</Text>
                              <Text strong className="detail-value seats-value">
                                {booking.seats && booking.seats.length > 0
                                  ? booking.seats.sort((a, b) => a - b).join(", ")
                                  : "N/A"}
                              </Text>
                              <Text type="secondary" className="detail-subtext">
                                {booking.seats?.length || 0} {booking.seats?.length === 1 ? "seat" : "seats"}
                              </Text>
                            </div>
                          </div>

                          <div className="detail-item">
                            <DollarOutlined className="detail-icon" />
                            <div className="detail-content">
                              <Text className="detail-label">Total Amount</Text>
                              <Text strong className="detail-value amount-value">
                                ₹{booking.totalAmount || 0}
                              </Text>
                            </div>
                          </div>
                        </Space>

                        <Divider className="ticket-divider" />

                        <div className="booking-meta">
                          <Text type="secondary" className="booking-date">
                            Booked on {moment(booking.createdAt).format("MMM DD, YYYY [at] hh:mm A")}
                          </Text>
                        </div>
                      </div>
                    </div>
                  </Card>
                </Col>
              );
            })}
          </Row>
        )}
      </div>
    </div>
  );
}

export default MyBookings;