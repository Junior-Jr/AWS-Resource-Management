import boto3
ec2 = boto3.resource('ec2')

def main():

    studentID = str(input("Enter Your Student ID: "))
    create_instance(studentID)

def create_instance(studentID):

    instances = ec2.create_instances(
        ImageId='ami-0cd31be676780afa7',
        MinCount=1,
        MaxCount=1,
        InstanceType='t2.micro',
        KeyName='ec2-keypair',
        TagSpecifications=[
            {
                'ResourceType':'instance',
                'Tags': [
                    {
                        'Key': 'StudentID',
                        'Value': studentID
                    }
                ]
            }
        ]
    )
    print('EC2 Instance created')
    print('Student ID: ' + studentID)

main()