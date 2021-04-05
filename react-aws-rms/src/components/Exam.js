import { useState, useEffect } from "react";
import { Button, Card, Col, Form, Input, message, Modal, PageHeader, Popconfirm, Row, Spin, Statistic, Tooltip } from "antd";
import { DeleteOutlined, ExclamationCircleOutlined, PlusOutlined } from '@ant-design/icons';
import Error500 from './Error500';

const axios = require('axios');

function Exam() {

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState([]);
    const [update, setUpdate] = useState('');
    const [examName, setExamName] = useState('');
    const [lecturer, setLecturer] = useState('');
    const [section, setSection] = useState('');
    const [awsTag, setAWSTag] = useState('');
    const [isError, setIsError] = useState(false);

    useEffect(() => {
        getExam();
    }, [update])

    const getExam = async () => {
        try {
            const response = await axios.get('http://localhost:9000/api/exam');
            setData(response.data);
            setIsError(false);
            console.log(response.data);
            setLoading(true);

        } catch (error) {
            console.error(error);
            setIsError(true);
        }
    }

    const addExam = async () => {
        try {
            message.success(`${examName} created successfully`, 2.75)
            const response = await axios.post('http://localhost:9000/api/exam', {
                'exam_name': examName,
                'lecturer': lecturer,
                'section': section,
                'awsTag': awsTag
            })
            setUpdate('add');
            console.log(response)

        } catch (error) {
            console.log(error)
        };

        setIsModalVisible(false);
    }

    const deleteExam = async (id, exam_name) => {
        try {
            message.success(`${exam_name} deleted`, 2.75)
            const response = await axios.post('http://localhost:9000/api/exam/delete', {
                'id': id
            })
            setUpdate('delete');
            console.log(response)

        } catch (error) {
            console.log(error)
        };
    }

    const renderExam = () => {

        return data.map(data => {
            return (
                <Col span={12} justify='center'>
                    <Card
                        title={data.exam_name}
                        extra={<a>Enter</a>}
                        style={{ width: 500 }}
                        actions={[
                            <Popconfirm
                                title='Are you sure to delete this exam?'
                                icon={<ExclamationCircleOutlined style={{ color: 'red' }} />}
                                okText='Delete'
                                onConfirm={() => (deleteExam(data._id, data.exam_name))}
                            >
                                <DeleteOutlined />
                            </Popconfirm>
                            ,]}>
                        <Row gutter={[16, 16]}>
                            <Col span={6}>
                                <Statistic title="Section" value={data.section} />
                            </Col>
                            <Col span={6}>
                                <Statistic title="Lecturer" value={data.lecturer} />
                            </Col>
                            <Col span={6}>
                                <Statistic title="End Time" value='10:08' />
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
        addExam()
    };

    return (
        <div>
            <PageHeader className='page-header' extra={[
                <Button type="primary" icon={<PlusOutlined />} key='delete' onClick={showModal}>
                    Add Exam
        </Button>,
            ]}>
            </PageHeader>
            <Modal title="Add Exam" visible={isModalVisible} okType='primary' okText='Add' onOk={addExam} onCancel={handleCancel}>
                <Form onFinish={onFinish}>
                    <Form.Item label='Exam Name'>
                        <Input type='text' value={examName} name='exam' onChange={(event) => setExamName(event.target.value)} autoComplete='off' />
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
            <Row className='Card-row' style={{ marginLeft: '7vw' }} gutter={[16, 16]}>
                {loading ? (renderExam()) : (<Spin size="large" style={{ marginLeft: '50%' }} />)}
            </Row>
            {renderError()}
        </div>
    );
}

export default Exam;