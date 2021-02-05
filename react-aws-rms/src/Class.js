import React, { useState, useEffect } from "react";
import { Button, Card, Col, Divider, Form, Input, Modal, Row, Spin, Statistic, Tooltip } from "antd";
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import Error500 from './Error500';

const axios = require('axios');

function Class() {

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [subject, setSubject] = useState('');
  const [lecturer, setLecturer] = useState('');
  const [section, setSection] = useState('');
  const [awsTag, setAWSTag] = useState('');
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    getSubject();
  },[])

  const getSubject = async () => {
    try {
      const response = await axios.get('http://localhost:9000/api/subject');
      setData(response.data);
      setIsError(false);
      console.log(response.data);
      setLoading(true);

    } catch (error) {
      console.error(error);
      setIsError(true);
    }
  }

  const addSubject = async () => {

    axios.post('http://localhost:9000/api/subject', {
      'subject': subject,
      'lecturer': lecturer,
      'section': section,
      'awsTag': awsTag
    })
    .then(function (response) {
      console.log(response)
    })
    .catch(function (error) {
      console.log(error)
    });

    setIsModalVisible(false);
    // const response = await axios.get('http://localhost:9000/api/subject');
    // setData(response.data);
    window.location.reload()
  }

  const renderSubject = () => {

      return data.map(data => {
        return (
          <Col span={12} justify='center'>
            <Card title={data.subject} extra={<a>Enter</a>} style={{ width: 500 }} actions={[<DeleteOutlined key="setting" />,]}>
              <Row gutter={[16, 16]}>
                <Col span={6}>
                  <Statistic title="Section" value={data.section} />
                </Col>
                <Col span={6}>
                  <Statistic title="Lecturer" value={data.lecturer} />
                </Col>
              </Row>
              <Row gutter={[16, 16]}>
                <Col span={8}>
                  <Button>
                    Stop All EC2
                  </Button>
                </Col>
                <Col span={8}>
                  <Button danger>
                    Terminate All EC2
                  </Button>
                </Col>
              </Row>
            </Card>
          </Col>
        )
      })
    };

    const renderError = () => {
      if (isError === true) {
        return (
          <Error500 />
        )
      }
    };

    const showModal = () => {
      setIsModalVisible(true);
    };

    const handleCancel = () => {
      setIsModalVisible(false)
    };

    const onFinish = (event) => {
      addSubject()
    };

    return (
      <div>
        <Button type='primary' icon={<PlusOutlined />} onClick={showModal}>
          Add Class
      </Button>
        <Modal title="Add Class" visible={isModalVisible} okType='primary' okText='Add' onOk={addSubject} onCancel={handleCancel}>
          <Form onFinish={onFinish}>
            <Form.Item label='Subject'>
              <Input type='text' value={subject} name='subject' onChange={(event) => setSubject(event.target.value)} autoComplete='off' />
            </Form.Item>
            <Form.Item label='Lecturer'>
              <Input type='text' value={lecturer} name='lecturer' onChange={(event) => setLecturer(event.target.value)} autoComplete='off' />
            </Form.Item>
            <Form.Item label='Section'>
              <Input type='text' value={section} name='section' onChange={(event) => setSection(event.target.value)} autoComplete='off' />
            </Form.Item>
            <Form.Item label='AWS Resource Tag'>
              <Tooltip title='Please Enter AWS Resource Tag Exactly Match on AWS' color='yellow' placement='bottomLeft'>
                <Input type='text' value={awsTag} name='awsTag' onChange={(event) => setAWSTag(event.target.value)} autoComplete='off' />
              </Tooltip>
            </Form.Item>
          </Form>
        </Modal>
        <Divider />
        <Row gutter={[16, 16]}>
          {loading ? (renderSubject()) : (<Spin size="large" />)}
        </Row>
        {renderError()}
      </div>
    );
  }

  export default Class;
