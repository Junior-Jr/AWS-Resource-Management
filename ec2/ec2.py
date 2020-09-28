import boto3


ec2 = boto3.resource('ec2')
client = boto3.client('ec2')

def main():
    while True:
        print(""" 
        -----------------------------------------------------------------
        Welcome to AWS Resource Management System, IT KMITL 
        Alpha Version
        Developed By Possathon & Apinant
        -----------------------------------------------------------------

        [1] Show Instance
        [2] Create Instance
        [3] Stop Instance
        [4] Terminate Instance
        [0] Exit
        """)
        
        menu_select = str(input("Please Enter Number To Select Menu: "))
        
        if menu_select == '1':
            describe_instance_state()

        elif menu_select == '2':
            create_instance()

        elif menu_select == '3':
            stop_instance()

        elif menu_select == '4':
            terminate_instance()

        elif menu_select == '5':
            timer()

        elif menu_select == '0':
            sys.exit()

def describe_instance_state():
    responses = client.describe_instances(
        Filters = [
            {
                'Name':'instance-state-name',
                'Values':[
                    'running',
                ]
            },
        ]
    )

    for reservation in responses["Reservations"]:
        for instance in reservation["Instances"]:
            instance_value = (instance["InstanceId"])

    print(instance_value)
            
def create_instance():

    studentID = str(input("Please Enter Your Student ID: "))
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

def stop_instance():

    stop_response = client.stop_instances(
        InstanceIds = [
            'i-0e52cc2bcfb013d80',
        ],
        Force = True
    )
    print('EC2 Instance stopped')
    

def terminate_instance():

    terminate_response = client.terminate_instances(
        InstanceIds = [
            'i-0e52cc2bcfb013d80',
        ]
    )

    print('EC2 Instance terminated')




main()