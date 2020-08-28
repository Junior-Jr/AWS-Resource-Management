import boto3
ec2_resource = boto3.resource('ec2')
ec2_client = boto3.client('ec2')
response = ec2_client.describe_instances()

# create a new EC2 instance
instances = ec2_resource.create_instances(
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
                     'Value': '60070059'
                 }
             ]
         }
     ]
 )
