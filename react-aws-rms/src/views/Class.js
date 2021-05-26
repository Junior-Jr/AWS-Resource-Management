import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Button, Card, Col, Form, Input, message, Modal, PageHeader, Popconfirm, Row, Spin, Statistic, Tooltip } from 'antd'
import { ExclamationCircleOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons'
import Error500 from '../components/Error500'

const axios = require('axios')

function Class() {

  const [isModalVisible, setIsModalVisible] = useState(false)
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState([])
  const [update, setUpdate] = useState([''])
  const [subject, setSubject] = useState('')
  const [lecturer, setLecturer] = useState('')
  const [section, setSection] = useState('')
  const [budget, setBudget] = useState()
  const [awsTag, setAWSTag] = useState('')
  const [isError, setIsError] = useState(false)
  const [ec2, setEC2] = useState([])

  useEffect(() => {
    getSubject()
  }, [update])

  const getSubject = async () => {
    try {
      const response = await axios.get('http://localhost:9000/api/subject')
      setData(response.data)
      setIsError(false)
      console.log(response.data)
      setLoading(true)

    } catch (error) {
      console.error(error)
      setIsError(true)
    }
  }

  const addSubject = async () => {
    try {
      message.success(`${subject} created successfully`, 2.75)
      const response = await axios.post('http://localhost:9000/api/subject', {
        'subject': subject,
        'lecturer': lecturer,
        'section': section,
        'budget': budget,
        'aws_tag_value': awsTag
      })
      setUpdate('add')
      console.log(response.data)

    } catch (error) {
      console.log(error)
    };
    setIsModalVisible(false)
  }

  const deleteSubject = async (id, subject) => {
    try {
      message.success(`${subject} deleted`, 2.75)
      const response = await axios.post('http://localhost:9000/api/subject/delete', {
        'id': id
      })
      setUpdate('delete')
      console.log(response.data)

    } catch (error) {
      console.log(error)
    }
  }

  const stopEC2 = async (aws_tag_value) => {
    try {
      message.success(`Stopping All EC2 Instances that has tag value "${aws_tag_value}"`, 2.75)
      const response = await axios.get('http://localhost:9000/api/ec2/filter/by-tag-value/' + aws_tag_value)
      setEC2(response.data)
      let instanceIDArr = await ec2.map(data => data.InstanceId)
      const request = await axios.post('http://localhost:9000/api/ec2/stop-all', {
        'instanceIds': instanceIDArr
      })
    } catch (error) {
      message.success(`All EC2 Instances has been STOPPED`, 2.75)
      console.error(error)
      setIsError(true)
    }
  }

  const terminateEC2 = async (aws_tag_value) => {
    try {
      message.success(`Terminating All EC2 Instances that has tag value "${aws_tag_value}"`, 2.75)
      const response = await axios.get('http://localhost:9000/api/ec2/filter/by-tag-value/' + aws_tag_value)
      setEC2(response.data)
      let instanceIDArr = await ec2.map(data => data.InstanceId)
      const request = await axios.post('http://localhost:9000/api/ec2/terminate-all', {
        'instanceIds': instanceIDArr
      })
    } catch (error) {
      message.success(`All EC2 Instances has been TERMINATED`, 2.75)
      console.error(error)
      setIsError(true)
    }
  }

  const renderSubject = () => {

    return data.map(data => {

      return (
        <Col span={12} justify='center'>
          <Card
            title={data.subject}
            extra={<Link to={'/class/' + data._id + '/' + data.aws_tag_value}>Enter</Link>}
            style={{ width: 500 }}
            actions={[
              <Popconfirm
                title='Are you sure to delete this class?'
                icon={<ExclamationCircleOutlined style={{ color: 'red' }} />}
                okText='Delete'
                onConfirm={() => (deleteSubject(data._id, data.subject))}
              >
                <DeleteOutlined />
              </Popconfirm>

              ,]}>
            <Row gutter={[16, 16]}>
              <Col span={6}>
                <Statistic title='Section' value={data.section} />
              </Col>
              <Col span={6}>
                <Statistic title='Lecturer' value={data.lecturer} />
              </Col>
              <Col span={6}>
                <Statistic title='AWS Tag Value' groupSeparator='' value={data.aws_tag_value} />
              </Col>
            </Row>
            <Row gutter={[16, 16]}>
              <Col span={8}>
                <Popconfirm
                  title='Are you sure to STOP ALL EC2 Instances?'
                  icon={<ExclamationCircleOutlined style={{ color: 'red' }} />}
                  okText='Stop'
                  onConfirm={() => stopEC2(data.aws_tag_value)}
                >
                  <Button>
                    Stop All EC2
                  </Button>
                </Popconfirm>
              </Col>
              <Col span={8}>
                <Popconfirm
                  title='Are you sure to TERMINATE ALL EC2 Instances?'
                  icon={<ExclamationCircleOutlined style={{ color: 'red' }} />}
                  okText='Terminate'
                  onConfirm={() => terminateEC2(data.aws_tag_value)}
                >
                  <Button danger>
                    Terminate All EC2
                  </Button>
                </Popconfirm>
              </Col>
            </Row>
          </Card>
        </Col>
      )
    })
  }

  const renderError = () => {
    if (isError === true) {
      return (
        <Error500 />
      )
    }
  }

  const showModal = () => {
    setIsModalVisible(true);
  }

  const handleCancel = () => {
    setIsModalVisible(false)
  }

  const onFinish = () => {
    addSubject()
  }

  return (
    <div>
      <PageHeader className='page-header' extra={[
        <Button type='primary' icon={<PlusOutlined />} key='delete' onClick={showModal}>
          Add Class
        </Button>,
      ]}>
      </PageHeader>
      <Modal title='Add Class' visible={isModalVisible} okType='primary' okText='Add' onOk={addSubject} onCancel={handleCancel}>
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
          <Form.Item label='Budget'>
            <Input type='text' value={budget} name='budget' onChange={(event) => setBudget(event.target.value)} autoComplete='off' />
          </Form.Item>
          <Form.Item label='AWS Resource Tag Value'>
            <Tooltip title='Please Enter AWS Resource Tag Exactly Match on AWS' color='yellow' placement='bottomLeft'>
              <Input type='text' value={awsTag} name='awsTag' onChange={(event) => setAWSTag(event.target.value)} autoComplete='off' />
            </Tooltip>
          </Form.Item>
        </Form>
      </Modal>
      <Row className='Card-row' style={{ marginLeft: '7vw' }} gutter={[16, 16]}>
        {loading ? (renderSubject()) : (<Spin size='large' style={{ marginLeft: '50%' }} />)}
      </Row>
      {renderError()}
    </div>
  )
}

export default Class
