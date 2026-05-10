import React from "react";
import { Button, Typography, Row, Col, Card, Space } from "antd";
import { useNavigate } from "react-router-dom";
import { PlayCircleOutlined, StarOutlined, SafetyOutlined, ThunderboltOutlined } from "@ant-design/icons";
import "./Landing.css";

const { Title, Paragraph } = Typography;

function Landing() {
  const navigate = useNavigate();

  const features = [
    {
      icon: <ThunderboltOutlined style={{ fontSize: 48, color: "#1890ff" }} />,
      title: "Instant Booking",
      description: "Book your tickets in seconds with our fast and secure payment system",
    },
    {
      icon: <StarOutlined style={{ fontSize: 48, color: "#ff4d4f" }} />,
      title: "Best Movies",
      description: "Access to the latest blockbusters and timeless classics",
    },
    {
      icon: <SafetyOutlined style={{ fontSize: 48, color: "#52c41a" }} />,
      title: "Secure Payments",
      description: "Your transactions are protected with industry-leading security",
    },
  ];

  return (
    <div className="landing-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <Title level={1} className="hero-title">
            Experience Cinema
            <br />
            <span className="gradient-text">Like Never Before</span>
          </Title>
          <Paragraph className="hero-description">
            Book your favorite movies, choose your perfect seats, and enjoy an
            unforgettable cinematic experience. Your next movie adventure starts here.
          </Paragraph>
          <Space size="large" className="hero-buttons">
            <Button
              type="primary"
              size="large"
              icon={<PlayCircleOutlined />}
              onClick={() => navigate("/register")}
              className="cta-button"
            >
              Get Started
            </Button>
            <Button
              size="large"
              onClick={() => navigate("/login")}
              className="secondary-button"
            >
              Sign In
            </Button>
          </Space>
        </div>
        <div className="hero-image">
          <div className="floating-card card-1">
            <div className="card-content">🎬</div>
          </div>
          <div className="floating-card card-2">
            <div className="card-content">🎭</div>
          </div>
          <div className="floating-card card-3">
            <div className="card-content">🎪</div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <Title level={2} className="section-title">
            Why Choose Us?
          </Title>
          <Row gutter={[32, 32]} justify="center">
            {features.map((feature, index) => (
              <Col xs={24} sm={12} md={8} key={index}>
                <Card className="feature-card" hoverable>
                  <div className="feature-icon">{feature.icon}</div>
                  <Title level={4} className="feature-title">
                    {feature.title}
                  </Title>
                  <Paragraph className="feature-description">
                    {feature.description}
                  </Paragraph>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <Card className="cta-card">
            <Title level={2} className="cta-title">
              Ready to Book Your Next Movie?
            </Title>
            <Paragraph className="cta-description">
              Join thousands of movie lovers and start booking your tickets today!
            </Paragraph>
            <Button
              type="primary"
              size="large"
              onClick={() => navigate("/register")}
              className="cta-button"
            >
              Create Account
            </Button>
          </Card>
        </div>
      </section>
    </div>
  );
}

export default Landing;
