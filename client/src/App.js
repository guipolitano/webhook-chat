import React, { useEffect, useState } from "react";
import { Card, Row, Col, Input } from "antd";
import { UserOutlined, SendOutlined } from "@ant-design/icons";
import io from "socket.io-client";
import "antd/dist/antd.css";
import "./App.css";
import Message from "./components/Message";

const { Search } = Input;
const { Meta } = Card;
function App() {
  // Cria a variável Socket para fazer a conexão com o backend
  const socket = io("http://localhost:5000");

  //Cria os Estados iniciais da aplicação
  const [chat, setChat] = useState([]);
  const [message, setMessage] = useState('');
  const [user, setUser] = useState('');

  //Cria a função de enviar mensagem
  const handleSubmit = () => {
    socket.emit("message", { user, message }); //Envia a mensagem para o socket
    // setChat([...chat, {user, message}]);     //Altera o estado do Chat para incluir a nova mensagem
    setMessage(""); //Reseta o input
  }

  //Função para rolar o chat para a última mensagem
  const scrollToBottom = () => {
    const chat = document.getElementById('chat');
    chat.scrollTop = chat.scrollHeight;
  }

  //Faz a conexão com o socket ao montar o componente
  useEffect(()=>{
    //Ao iniciar o componente, conecta e resgata os chats do banco de dados
    socket.on('init', (msg) => {
      // console.log(msg)
      setChat([...chat, ...msg.reverse()])
    });

    // Ao chegar uma mensagem nova no banco de dados, atualiza o chat
    socket.on("push", (msg) => {
        console.log(msg)
        setChat([...chat, msg]);
      });
  }, []);

  //Sempre que a variável chat for atualizada, desce o chat pra a última mensagem
  useEffect(()=> scrollToBottom(), [chat]);

  return (
    <Row align="middle" justify="center">
      <Col span={24}>
        <Row align="middle" justify="center">
          <Col xs={23} sm={23} lg={18} xl={12}>
            <Card style={{ marginTop: "10%", width: "100%" }}>
              <Input
                size="large"
                placeholder="Insira seu nome de Usuário"
                prefix={<UserOutlined />}
                onChange={(e) => setUser(e.target.value)}
              />
            </Card>
          </Col>
        </Row>
        <Row align="middle" justify="center">
          <Col xs={23} sm={23} lg={18} xl={12}>
            <Card style={{ marginTop: "10px", width: "100%" }} title="Chat">
              <Card
                id="chat"
                style={{ backgroundColor: "rgb(69, 78, 86)", maxHeight: "400px", overflowY: "auto" }}
              >
                {chat.map((e, index) => (
                  <Message
                    key={index}
                    user={e.user}
                    message={e.message}
                    timestamp={e.createdAt}
                  />
                ))}
              </Card>
              <Meta
                title={
                  <Search
                    disabled={user !== "" ? false : true}
                    size="large"
                    value={message}
                    enterButton={<SendOutlined />}
                    placeholder="Digite sua mensagem"
                    onSearch={handleSubmit}
                    onPressEnter={handleSubmit}
                    onChange={(e) => setMessage(e.target.value)}
                  />
                }
              />
            </Card>
          </Col>
        </Row>
      </Col>
    </Row>
  );
}

export default App;
