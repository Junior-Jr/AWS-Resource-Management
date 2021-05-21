import { Fragment, useEffect, useState } from 'react'
import { useParams } from "react-router-dom"
import moment from 'moment'
import { Alert, Card, DatePicker, Select, Tag, Table, Typography, Row, Col } from 'antd'
import { VictoryAxis, VictoryBar, VictoryChart, VictoryTooltip, VictoryTheme } from 'victory'

const axios = require('axios');

const CostDashboard = () => {

    const { aws_tag_value } = useParams()
    const [date, setDate] = useState([])
    const [granularity, setGranularity] = useState('')
    const [service, setService] = useState('')
    const [costData, setCostData] = useState([])
    const [alert, setAlert] = useState(false)

    const { RangePicker } = DatePicker
    const { Option } = Select
    const { Text } = Typography

    useEffect(() => {
        updateGraph()
    }, [date, granularity, service])

    const updateGraph = async () => {
        try {
            const request = await axios.post('http://localhost:9000/api/cost', {
                'start_date': date[0],
                'end_date': date[1],
                'granularity': granularity,
                'service': service,
                'aws_tag_value': aws_tag_value
            })
            setCostData(request.data)
            console.log(request.data)
        } catch (error) {
            console.log(error)
        }
    }

    const handleChangeGranularity = (value) => {
        setGranularity(value)

        console.log(`selected ${value}`);
    }

    const handleChangeService = (value) => {
        setService(value)
        console.log(moment().format('YYYY-MM-DD'))
        console.log(`selected ${value}`);
    }

    const handleChangeDate = (date, dateString) => {
        setDate(dateString)

        console.log(dateString[0])
        console.log(dateString[1])
    }

    const columns = [
        {
            title: 'Start Date',
            dataIndex: ['Start']
        },
        {
            title: 'End Date',
            dataIndex: ['End']
        },
        {
            title: 'Cost ($USD)',
            dataIndex: ['Amount']
        }
    ]

    return (
        <Fragment>
            {alert ? <Alert message="Warning! Course Budget has used at 80%" banner /> : <Alert message="Normal" type='success' banner />}
            <Row id='cost-row' gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                <Col id='cost-col-left' span={12}>
                    <Card style={{ width: '30vw' }}>
                        <RangePicker onChange={handleChangeDate} />
                        <Select defaultValue="HOURLY" style={{ width: 120 }} onChange={handleChangeGranularity}>
                            <Option value="HOURLY">Hourly</Option>
                            <Option value="DAILY">Daily</Option>
                            <Option value="MONTHLY">Monthly</Option>
                        </Select>
                        <br></br>
                        <Text strong>Filter</Text>
                        <br></br>
                        <Text>Service: </Text>
                        <Select defaultValue="Service" style={{ width: 130 }} onChange={handleChangeService}>
                            <Option value="Amazon Elastic Compute Cloud - Compute">EC2-Instances</Option>
                            <Option value="Relation Database Service (RDS)">RDS</Option>
                            <Option value="S3 (Simple Storage Service)">S3</Option>
                        </Select>
                        <VictoryChart theme={VictoryTheme.material} domainPadding={10}>
                            <VictoryBar
                                style={{ data: { fill: '#634cc7' } }}
                                data={costData}
                                y='Amount'
                                x={(datum) => datum.Start}
                                labels={({ datum }) => `Cost: $${parseFloat(datum.Amount).toFixed(2)}`}
                                labelComponent={<VictoryTooltip constrainToVisibleArea />}
                            />
                        </VictoryChart>
                    </Card>
                </Col>
                <Col id='cost-col-right' span={12}>
                    <Card>
                        <Table
                            columns={columns}
                            dataSource={costData}
                            summary={costData => {
                                let costTotal = 0.00
                                costData.forEach(({ Amount }) => {
                                    costTotal += parseFloat(Amount)
                                    if (costTotal === costTotal) {
                                        setAlert(true)
                                    }
                                })

                                return (
                                    <Table.Summary.Row>
                                        <Table.Summary.Cell>Total</Table.Summary.Cell>
                                        <Table.Summary.Cell></Table.Summary.Cell>
                                        <Table.Summary.Cell><Tag color={'blue'} >{costTotal}</Tag></Table.Summary.Cell>
                                    </Table.Summary.Row>
                                )
                            }} />
                    </Card>
                </Col>
            </Row>
        </Fragment>
    )
}
export default CostDashboard