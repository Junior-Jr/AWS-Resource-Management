import { Button, Result } from 'antd';

function Error500() {
    const refreshPage = () => {
        window.location.reload();
    };

    return (
        <Result
            status="500"
            title="500"
            subTitle="Sorry, something went wrong."
            extra={<Button type="primary" onClick={refreshPage}>Reload</Button>} />
    )
}

export default Error500;