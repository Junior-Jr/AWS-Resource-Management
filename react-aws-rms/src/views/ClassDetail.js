import { useParams } from "react-router-dom";
import { Tag, Table } from 'antd'
import { useState, useEffect } from 'react';
import Error500 from '../components/Error500'

const axios = require('axios');

function ClassDetail() {

    const { aws_tag_value } = useParams();
    const [ec2, setEC2] = useState([])
    const [isError, setIsError] = useState(false)


    useEffect(() => {
        getEC2Detail();
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
    };

    const columns = [
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
            title: 'State',
            dataIndex: ['State', 'Name'],
            render: (dataIndex) => (tagColor(dataIndex)),
            key: ''

        }
    ]

    return (
        <div>
            <Table columns={columns} dataSource={ec2} />
            { renderError()}
        </div>
    )
}

export default ClassDetail;