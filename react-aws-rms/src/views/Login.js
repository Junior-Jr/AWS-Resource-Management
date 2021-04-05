import { Card } from 'antd';

function Login() {

    const { Meta } = Card;

    return (
        <div className="Login-Card">
            <Card hoverable
                style={{ width: 240 }}
                cover={<img alt="example" src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png" />}
            >
                <Meta title="AWS Resource Management System | IT KMITL" />
                <p>Card content</p>
                <p>Card content</p>
                <p>Card content</p>
            </Card>
        </div>
    )
}

export default Login;