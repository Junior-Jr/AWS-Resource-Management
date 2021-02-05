from django.shortcuts import render
from django.http.response import HttpResponse
import boto3

ec2 = boto3.resource('ec2')
client = boto3.client('ec2')

def home(request):
    return render(request, 'index.html')

def ec2(request):
    return render(request, 'ec2.html')

def create_instance(request):

    studentID = str(input("Please Enter Your Student ID: "))
    instances = ec2.create_instances(
        ImageId = 'ami-0cd31be676780afa7',
        MinCount = 1,
        MaxCount = 1,
        InstanceType = 't2.micro',
        KeyName = 'ec2-keypair',
        TagSpecifications = [
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
    return HttpResponse('EC2 Instance created')
