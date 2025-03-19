import React from 'react'
import Cookies from 'js-cookie'
import { Button, Card, Descriptions, Typography } from 'antd'
import { useNavigate } from 'react-router-dom'
import dayjs from 'dayjs'
const { Title } = Typography
const UserProfile: React.FC = () => {
    const navigate = useNavigate()
    const userData = Cookies.get('userData')
        ? JSON.parse(Cookies.get('userData') || '{}')
        : null
    console.log(userData)
    if (!userData) return <p>No user data available.</p>

    return (
        <div style={{
            display: 'flex', justifyContent: 'center', marginTop: 50
        }}>
            <Card
                title={<Title level={3}>Your Information</Title>}
                bordered={false}
                style={{
                    width: 500,
                    borderRadius: 10,
                    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                    padding: 20,
                }}
            >
                <Descriptions column={1} bordered>
                    <Descriptions.Item label='Full Name'>
                        {userData.username}
                    </Descriptions.Item>
                    <Descriptions.Item label='Email'>{userData.email}</Descriptions.Item>
                    <Descriptions.Item label='Gender'>
                        {userData.gender ? 'Male' : 'Female'}
                    </Descriptions.Item>
                    <Descriptions.Item label="Birthday">
                        {userData.birthday ? dayjs(userData.birthday).format('DD-MM-YYYY') : '-'}
                    </Descriptions.Item>
                    <Descriptions.Item label='Phone Number'>
                        {userData.phone}
                    </Descriptions.Item>
                </Descriptions>

                <div
                    style={{
                        marginTop: 20,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 10,
                    }}
                >
                    <Button
                        type='primary'
                        block
                        onClick={() => navigate('/profile/edit-profile')}
                    >
                        Edit Profile
                    </Button>
                    <Button
                        type='primary'
                        danger
                        block
                        onClick={() => navigate('/profile/changePassword')}
                    >
                        Change Password
                    </Button>
                </div>
            </Card>
        </div>
    )
}
export default UserProfile