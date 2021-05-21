import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button, Card, Col, Form, Input, message, Modal, PageHeader, Popconfirm, Row, Select, Spin, Statistic, Tooltip } from "antd";
import { ExclamationCircleOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import Error500 from '../components/Error500';

const axios = require('axios');

const Project = () => {

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [update, setUpdate] = useState(['']);
  const [groupProject, setGroupProject] = useState('');
  const [advisor, setAdvisor] = useState('');
  const [groupType, setGroupType] = useState('');
  const [awsTag, setAWSTag] = useState('');
  const [isError, setIsError] = useState(false);

  const { Option } = Select

  useEffect(() => {
    getGroupProject();
  }, [update])

  const getGroupProject = async () => {
    try {
      const response = await axios.get('http://localhost:9000/api/project');
      setData(response.data);
      setIsError(false);
      console.log(response.data);
      setLoading(true);

    } catch (error) {
      console.error(error);
      setIsError(true);
    }
  }

  const addGroupProject = async () => {
    try {
      message.success(`${groupProject} created successfully`, 2.75)
      const response = await axios.post('http://localhost:9000/api/project', {
        'group_name': groupProject,
        'group_type': groupType,
        'advisor': advisor,
        'aws_tag_value': awsTag
      })
      setUpdate('add');
      console.log(response.data)

    } catch (error) {
      console.log(error)
    };
    setIsModalVisible(false);
  }

  const deleteGroupProject = async (id, subject) => {
    try {
      message.success(`${groupProject} deleted`, 2.75)
      const response = await axios.post('http://localhost:9000/api/project/delete', {
        'id': id
      })
      setUpdate('delete');
      console.log(response.data)

    } catch (error) {
      console.log(error)
    };
  }

  const renderGroupProject = () => {

    return data.map(data => {
      return (
        <Col span={12} justify='center'>
          <Card
            title={data.group_name}
            extra={<Link to={'/project/' + data._id + '/' + data.aws_tag_value}>Enter</Link>}
            style={{ width: 500 }}
            actions={[
              <Popconfirm
                title='Are you sure to delete this group?'
                icon={<ExclamationCircleOutlined style={{ color: 'red' }} />}
                okText='Delete'
                onConfirm={() => (deleteGroupProject(data._id, data.group_name))}
              >
                <DeleteOutlined />
              </Popconfirm>

              ,]}>
            <Row gutter={[16, 16]}>
              <Col span={6}>
                <Statistic title='Group Type' value={data.group_type} />
              </Col>
              <Col span={6}>
                <Statistic title='Advisor' value={data.advisor} />
              </Col>
              <Col span={6}>
                <Statistic title='AWS Tag Value' groupSeparator='' value={data.aws_tag_value} />
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

  const onFinish = () => {
    addGroupProject()
  };

  return (
    <div>
      <PageHeader className='page-header' extra={[
        <Button type='primary' icon={<PlusOutlined />} key='delete' onClick={showModal}>
          Add Group
        </Button>,
      ]}>
      </PageHeader>
      <Modal title='Add Group' visible={isModalVisible} okType='primary' okText='Add' onOk={addGroupProject} onCancel={handleCancel}>
        <Form onFinish={onFinish}>
          <Form.Item label='Group Name'>
            <Input type='text' value={groupProject} name='group_name' onChange={(event) => setGroupProject(event.target.value)} autoComplete='off' />
          </Form.Item>
          <Form.Item label='Advisor'>
            <Input type='text' value={advisor} name='advisor' onChange={(event) => setAdvisor(event.target.value)} autoComplete='off' />
          </Form.Item>
          <Form.Item label='Group Type'>
            <Select defaultValue="1-Year" onChange={(value) => setGroupType(value)}>
              <Option value="1-Year">1-Year</Option>
              <Option value="1-Term">1-Term</Option>
            </Select>
          </Form.Item>
          <Form.Item label='AWS Resource Tag Value'>
            <Tooltip title='Please Enter AWS Resource Tag Exactly Match on AWS' color='yellow' placement='bottomLeft'>
              <Input type='text' value={awsTag} name='awsTag' onChange={(event) => setAWSTag(event.target.value)} autoComplete='off' />
            </Tooltip>
          </Form.Item>
        </Form>
      </Modal>
      <Row className='Card-row' style={{ marginLeft: '7vw' }} gutter={[16, 16]}>
        {loading ? (renderGroupProject()) : (<Spin size='large' style={{ marginLeft: '50%' }} />)}
      </Row>
      {renderError()}
    </div>
  );
}

export default Project
