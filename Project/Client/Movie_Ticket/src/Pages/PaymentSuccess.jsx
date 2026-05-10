import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { verifyPayment } from "../calls/bookingCalls";
import { Card, Typography, Button, Spin, message, Space } from "antd";
import { CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [booking, setBooking] = useState(null);

  useEffect(() => {
    const verifyPaymentStatus = async () => {
      try {
        const sessionId = searchParams.get("session_id");
        
        if (!sessionId) {
          setPaymentStatus("error");
          setLoading(false);
          return;
        }

        const response = await verifyPayment(sessionId);
        
        if (response.success && response.data) {
          setBooking(response.data);
          setPaymentStatus("success");
          message.success("Payment successful! Booking confirmed.");
          // Refresh the show page to update seat availability
        } else {
          setPaymentStatus("failed");
          message.error(response.message || "Payment verification failed.");
        }
        setLoading(false);
      } catch (error) {
        console.error("Error verifying payment:", error);
        setPaymentStatus("error");
        setLoading(false);
      }
    };

    verifyPaymentStatus();
  }, [searchParams]);

  if (loading) {
    return (
      <div style={{ padding: 50, textAlign: "center" }}>
        <Spin size="large" />
        <div style={{ marginTop: 20 }}>
          <Text>Verifying payment...</Text>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: 50, maxWidth: 600, margin: "0 auto" }}>
      <Card>
        {paymentStatus === "success" && (
          <div style={{ textAlign: "center" }}>
            <CheckCircleOutlined
              style={{ fontSize: 64, color: "#52c41a", marginBottom: 20 }}
            />
            <Title level={2} style={{ color: "#52c41a" }}>
              Payment Successful!
            </Title>
            <Text style={{ fontSize: 16, display: "block", marginBottom: 20 }}>
              Your booking has been confirmed.
            </Text>
            {booking && (
              <div style={{ textAlign: "left", marginBottom: 20, padding: 20, backgroundColor: "#f5f5f5", borderRadius: 8 }}>
                <Text strong>Booking Status: </Text>
                <Text style={{ color: "#52c41a", fontWeight: "bold" }}>COMPLETED</Text>
                <br />
                <br />
                <Text strong>Seats: </Text>
                <Text>{booking.seats.sort((a, b) => a - b).join(", ")}</Text>
                <br />
                <Text strong>Total Amount: </Text>
                <Text>₹{booking.totalAmount}</Text>
                {booking.show && booking.show.movie && (
                  <>
                    <br />
                    <Text strong>Movie: </Text>
                    <Text>{booking.show.movie.title}</Text>
                  </>
                )}
              </div>
            )}
            <Space>
              <Button type="primary" size="large" onClick={() => navigate("/my-bookings")}>
                View My Bookings
              </Button>
              <Button size="large" onClick={() => navigate("/home")}>
                Go to Home
              </Button>
            </Space>
          </div>
        )}

        {(paymentStatus === "failed" || paymentStatus === "error") && (
          <div style={{ textAlign: "center" }}>
            <CloseCircleOutlined
              style={{ fontSize: 64, color: "#ff4d4f", marginBottom: 20 }}
            />
            <Title level={2} style={{ color: "#ff4d4f" }}>
              Payment {paymentStatus === "failed" ? "Failed" : "Error"}
            </Title>
            <Text style={{ fontSize: 16, display: "block", marginBottom: 20 }}>
              {paymentStatus === "failed" 
                ? "Your payment could not be processed. Please try again."
                : "We couldn't verify your payment. Please check your bookings or contact support."}
            </Text>
            <Button type="primary" size="large" onClick={() => navigate("/home")}>
              Go to Home
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
}

export default PaymentSuccess;
