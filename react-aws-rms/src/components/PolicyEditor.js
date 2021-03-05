import React, { useState } from 'react';
import { Checkbox, Layout } from 'antd';
import { Content } from 'antd/lib/layout/layout';

function PolicyEditor() {

    const { Header, Content, Footer } = Layout;

    function onChange(e) {
        console.log(`checked = ${e.target.checked}`);
      }
    
    return (
        <Layout className='layout'>
            <Content>
                <div>
                    <Checkbox onChange={onChange}>Checkbox</Checkbox>
                </div>
            </Content>
            <Footer style={{ textAlign: 'center' }}>Ant Design ©2018 Created by Ant UED</Footer>
        </Layout>
    )
}
export default PolicyEditor;
