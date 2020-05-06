import React from 'react';
import { Comment, Avatar, Card, Row } from "antd";
import { UserOutlined } from "@ant-design/icons";

export default function Message({user, message, timestamp}) {
  return (
    <Row>
      <Card
        size="small"
        style={{ margin: "5px" }}
        type="inner"
        bodyStyle={{ padding: "0px 3px" }}
      >
        <Comment
          author={user}
          avatar={
            <Avatar shape="square" size="large" icon={<UserOutlined />} />
          }
          content={message}
          datetime={<span>{timestamp}</span>}
        />
      </Card>
    </Row>
  );
}
