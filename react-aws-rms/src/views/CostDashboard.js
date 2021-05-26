import { Fragment, useEffect, useState } from 'react'
import { useParams } from "react-router-dom"
import moment from 'moment'
import { Alert, Card, Col, DatePicker, Select, Tag, Table, Typography, Row } from 'antd'
import { VictoryBar, VictoryChart, VictoryTooltip, VictoryTheme } from 'victory'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts"

const axios = require('axios')

const CostDashboard = () => {

    const { aws_tag_value } = useParams()
    const [date, setDate] = useState([])
    const [granularity, setGranularity] = useState('')
    const [service, setService] = useState('')
    const [costData, setCostData] = useState([])
    const [alert80, setAlert80] = useState(false)
    const [alert90, setAlert90] = useState(false)
    const [subject, setSubject] = useState([])

    const { RangePicker } = DatePicker
    const { Option } = Select
    const { Text } = Typography

    useEffect(() => {
        updateGraph()
        getSubject()
    }, [date, granularity, service])

    const getSubject = async () => {
        try {
            const response = await axios.get('http://localhost:9000/api/subject')
            setSubject(response.data)
            console.log(response.data)
            console.log(subject[0].budget)

        } catch (error) {
            console.error(error);
        }
    }

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
            {alert80 ? <Alert message="Warning! Course Budget has used at 80%" banner style={{ marginTop: '1vh' }} /> : <> </>}
            {alert90 ? <Alert message="Alert! Course Budget has used at 90%" type='error' banner style={{ marginTop: '1vh' }} /> : <> </>}
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
                            <Option value="Amazon Relational Database Service">RDS</Option>
                            <Option value="Amazon Simple Storage Service">S3</Option>
                        </Select>
                        {/* <VictoryChart theme={VictoryTheme.material} domain={{ y: [0, 1] }}>
                            <VictoryBar
                                style={{ data: { fill: '#634cc7' } }}
                                data={costData}
                                y='Amount'
                                x={(datum) => datum.Start}
                                labels={({ datum }) => `Cost: $${parseFloat(datum.Amount).toFixed(2)}`}
                                labelComponent={<VictoryTooltip constrainToVisibleArea />}
                            />
                        </VictoryChart> */}
                        <BarChart
                            width={500}
                            height={300}
                            data={costData}
                            margin={{
                                top: 5,
                                right: 30,
                                left: 20,
                                bottom: 5
                            }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="Start" />
                            <YAxis dataKey='Amount' />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="Amount" fill="#8884d8" />
                        </BarChart>
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
                                    if (costTotal >= (subject[0].budget * 50 / 100) && costTotal < (subject[0].budget * 52 / 100)) {
                                        setAlert80(true)
                                        setAlert90(false)
                                    }
                                    else if (costTotal >= (subject[0].budget * 52 / 100)) {
                                        setAlert90(true)
                                        setAlert80(false)
                                    }
                                    else {
                                        setAlert90(false)
                                        setAlert80(false)
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