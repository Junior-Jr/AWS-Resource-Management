import { Link } from "react-router-dom"
import { Spin, Tabs, Tag, Table } from 'antd'
import { Fragment, useState, useEffect } from 'react'
import Error500 from '../components/Error500'

const axios = require('axios')

const CostControl = () => {

    const [loading, setLoading] = useState(false)
    const [classDetail, setClassDetail] = useState([])
    const [project, setProject] = useState([])
    const [isError, setIsError] = useState(false)


    useEffect(() => {
        getClassDetail()
        getProjectDetail()
    }, [])

    const getClassDetail = async () => {
        try {
            const response = await axios.get(`http://localhost:9000/api/subject`)
            setClassDetail(response.data)
            setLoading(true)
            console.log(response.data)

        } catch (error) {
            console.error(error)
            setIsError(true)
        }
    }

    const getProjectDetail = async () => {
        try {
            const response = await axios.get(`http://localhost:9000/api/project`)
            setProject(response.data)
            console.log(response.data)

        } catch (error) {
            console.error(error)
            setIsError(true)
        }
    }

    const tagColor = (dataIndex) => {
        let color = 'blue'

        return (
            <Tag color={color} >{dataIndex}</Tag>
        )
    }

    const classAction = (dataIndex) => {

        return (
            <Link to={'/cost-control/' + dataIndex}>Enter</Link>
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

    const classColumns = [
        {
            title: 'Subject Name',
            dataIndex: 'subject',
            key: ''
        },
        {
            title: 'Section',
            dataIndex: 'section',
            key: ''
        },
        {
            title: 'AWS Tag',
            dataIndex: 'aws_tag_value',
            render: (dataIndex) => (tagColor(dataIndex)),
            key: ''

        },
        {
            title: 'Action',
            dataIndex: 'aws_tag_value',
            render: (dataIndex) => (classAction(dataIndex)),
            key: ''
        }
    ]

    const projectColumns = [
        {
            title: 'Group Name',
            dataIndex: 'group_name',
            key: ''
        },
        {
            title: 'Group Type',
            dataIndex: 'group_type',
            key: ''
        },
        {
            title: 'Advisor',
            dataIndex: 'advisor',
            key: ''
        },
        {
            title: 'AWS tag',
            dataIndex: 'aws_tag_value',
            render: (dataIndex) => (tagColor(dataIndex)),
            key: ''
        },
        {
            title: 'Action',
            dataIndex: 'group_name',
            render: (dataIndex) => (classAction(dataIndex)),
            key: ''
        }

    ]

    const renderCostControl = () => {
        return (
            <Tabs id='cost-control-tab' defaultActiveKey='1' size='large' onChange={callback}>
                <TabPane tab='Class' key='1'>
                    <Table columns={classColumns} dataSource={classDetail} />
                    {renderError()}
                </TabPane>
                <TabPane tab='Project' key='2'>
                    <Table columns={projectColumns} dataSource={project} />
                    {renderError()}
                </TabPane>
            </Tabs>
        )
    }

    return (
        <Fragment>
            {loading ? (renderCostControl()) : (<Spin size='large' style={{ marginLeft: '50%' }} />)}
        </Fragment>
    )
}

export default CostControl