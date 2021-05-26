import { useParams } from "react-router-dom"
import { Table } from 'antd'

const VPCDetail = () => {

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
        <Table columns={s3Columns} />
    )
}
export default VPCDetail