import { useParams } from "react-router-dom"
import { Button, Card, Input, PageHeader, Tabs, Tag, Table, Tooltip } from 'antd'
import { useState, useEffect } from 'react'
import Error500 from '../components/Error500'

const axios = require('axios')

function ProjectDetail() {

    const { aws_tag_value } = useParams()
    const [ec2, setEC2] = useState([])
    const [s3, setS3] = useState([])
    const [isError, setIsError] = useState(false)

    const { TextArea } = Input

    useEffect(() => {
        getEC2Detail()
        getS3Detail()
    }, [])

    const getEC2Detail = async () => {
        try {
            const response = await axios.get(`http://localhost:9000/api/ec2/filter/by-tag-value/${aws_tag_value}`);
            setEC2(response.data);
            console.log(response.data);

        } catch (error) {
            console.error(error);
            setIsError(true);
        }
    }

    const getS3Detail = async () => {
        try {
            const response = await axios.get(`http://localhost:9000/api/s3/filter/by-tag-value/${aws_tag_value}`)
            setS3(response.data)
            console.log(response.data)

        } catch (error) {
            console.error(error)
            setIsError(true)
        }
    }

    const tagColor = (dataIndex) => {
        let color = ''
        if (dataIndex === 'stopped') {
            color = 'volcano'
        } else if (dataIndex === 'running') {
            color = 'green'
        } else if (dataIndex === 'stopping' || dataIndex === 'shutting-down') {
            color = 'warning'
        } else if (dataIndex === 'rebooting') {
            color = 'cyan'
        }
        return (
            <Tag color={color} >{dataIndex.toUpperCase()}</Tag>
        )
    }

    const renderError = () => {
        if (isError === true) {
            return (
                <Error500 />
            )
        }
    }

    function callback(key) {
        console.log(key)
    }

    const { TabPane } = Tabs

    const ec2Columns = [
        {
            title: 'Owner',
            dataIndex: ['Tags', 'Key'],
            key: ''
        },
        {
            title: 'Instance Type',
            dataIndex: 'InstanceType',
            key: ''
        },
        {
            title: 'Instance State',
            dataIndex: ['State', 'Name'],
            render: (dataIndex) => (tagColor(dataIndex)),
            key: ''

        }
    ]
    const s3Columns = [
        {
            title: 'Owner',
            dataIndex: ['Tags', 'Key'],
            key: ''
        },
        {
            title: 'Bucket Name',
            dataIndex: 'Bucket',
            key: ''
        },

    ]

    return (
        <div>
            <PageHeader
                className='site-page-header'
                onBack={() => window.history.back()}
                title='Title'
            />
            <Tabs defaultActiveKey='1' size='large' onChange={callback}>
                <TabPane tab='Class Policy' key='1'>
                    <Card id='policy-editor-card' title='Policy Editor'>
                        Please Enter Policy in JSON Format
                        <Tag color="warning">AWS Account:  lapas</Tag>
                        <Tag color="warning">IAM Account:  CostExp</Tag>
                        <Tooltip title='Notice! This Policy will Apply to Every IAM Account that under AWS Account you used' color='red' placement='bottomLeft'>
                            <TextArea rows={20} />
                        </Tooltip>
                        <Button type='primary'>
                            Apply
                        </Button>
                    </Card>
                </TabPane>
                <TabPane tab='EC2' key='2'>
                    <Table columns={ec2Columns} dataSource={ec2} />
                    {renderError()}
                </TabPane>
                <TabPane tab='S3' key='3'>
                    <Table columns={s3Columns} dataSource={s3} />
                    {renderError()}
                </TabPane>
                <TabPane tab='RDS' key='4'>
                    Content of Tab Pane 3
                    {renderError()}
                </TabPane>
            </Tabs>
        </div >
    )
}

export default ProjectDetail